import React, { useState } from "react";
import { useAccount } from "wagmi";
import { DEFAULT_POOL_CONFIG } from "../config/tokens";
import { SwapState, SwapProps } from "../types";
import useQuote from "../hooks/useQuote";
import useSwap from "../hooks/useSwap";
import { IoMdArrowDown } from "react-icons/io";
import { useAppKit } from "@reown/appkit/react";

const SwapWidget: React.FC<SwapProps> = ({
  poolConfig = DEFAULT_POOL_CONFIG,
}) => {
  const { open } = useAppKit();
  const { isConnected } = useAccount();
  const [state, setState] = useState<SwapState>({
    inputAmount: "",
    outputAmount: "",
    inputToken: null,
    outputToken: null,
    loading: false,
    error: null,
  });

  useQuote({ state, setState, poolConfig });
  const { swap } = useSwap({ state, setState });

  // Handle input amount changes
  const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Input change:", {
      value,
      isValid: value === "" || /^\d*\.?\d*$/.test(value),
    });
    // Allow empty string, valid numbers, and partial numbers (like "0.", ".")
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setState((prev) => ({ ...prev, inputAmount: value }));
    }
  };

  const onConnectWallet = async () => {
    open({
      view: "Connect",
    });
  };

  return (
    <div className="relative w-full max-w-md bg-[#FCFAFE] p-2 rounded-xl">
      <div className="p-4 border border-[#EBEBEB] rounded-2xl relative">
        <label className="block text-gray-600 mb-2">Sell</label>
        <div className="flex items-center">
          <input
            key="sell-input"
            type="text"
            value={state.inputAmount}
            onChange={handleInputAmountChange}
            className={`w-full bg-transparent text-2xl outline-none`}
            placeholder="0"
            inputMode="decimal"
          />
          <div className="flex flex-col gap-2">
            <div className="ml-2 p-3 py-2 border border-gray-200 bg-white rounded-full flex items-center justify-center gap-2 min-w-[140px]">
              {poolConfig.tokenIn.logoURI && (
                <img
                  src={poolConfig.tokenIn.logoURI}
                  alt={poolConfig.tokenIn.symbol}
                  className="h-[20px] w-[20px] flex-shrink-0 rounded-full"
                  onError={(e) => {
                    console.log(
                      "Input token logo failed to load:",
                      poolConfig.tokenIn.logoURI
                    );
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <span className="font-bold text-sm">
                {poolConfig.tokenIn.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center items-center h-[5px]">
        <div className="rounded-2xl w-[40px] h-[40px] bg-[#EBEBEB] flex justify-center items-center">
          <IoMdArrowDown className="text-2xl text-black" />
        </div>
      </div>

      <div className="mb-2 p-4 bg-[#f5f5f5] rounded-2xl relative">
        <label className="block text-gray-600 mb-2">Buy</label>
        <div className="flex items-center">
          <input
            type="text"
            value={
              state.loading ? "Fetching Quotes" : state.outputAmount || "0"
            }
            readOnly
            disabled={state.loading}
            className="w-full bg-transparent text-2xl outline-none opacity-80 disabled:opacity-30 disabled:text-lg"
            placeholder="0"
          />
          <div className="flex flex-col gap-2">
            <div className="ml-2 p-3 py-2 border border-gray-200 bg-white rounded-full flex items-center justify-center gap-2 min-w-[140px]">
              {poolConfig.tokenOut.logoURI && (
                <img
                  src={poolConfig.tokenOut.logoURI}
                  alt={poolConfig.tokenOut.symbol}
                  className="h-[20px] w-[20px] flex-shrink-0 rounded-full"
                  onError={(e) => {
                    console.log(
                      "Output token logo failed to load:",
                      poolConfig.tokenOut.logoURI
                    );
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <span className="font-bold text-sm">
                {poolConfig.tokenOut.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>

      {state.error && (
        <div className="mb-2 p-4 bg-red-50 text-red-500 rounded-2xl">
          {state.error}
        </div>
      )}

      {isConnected ? (
        <button
          disabled={
            state.loading ||
            !state.inputAmount ||
            Number(state.inputAmount) <= 0
          }
          onClick={swap}
          className="w-full py-4 bg-pink-500 text-white rounded-2xl hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {state.loading ? "Getting Quote..." : "Swap"}
        </button>
      ) : (
        <button
          onClick={onConnectWallet}
          className="w-full py-4 bg-pink-100 text-pink-500 rounded-2xl hover:bg-pink-200 transition-colors"
        >
          Connect Wallet
        </button>
      )}

      {state.inputAmount && state.outputAmount && (
        <div className="p-4 rounded-2xl">
          <div className="flex justify-between items-center text-sm text-[#7d7d7d] mb-2">
            1 {poolConfig.tokenIn.symbol} ={" "}
            {(Number(state.outputAmount) / Number(state.inputAmount)).toFixed(
              6
            )}{" "}
            {poolConfig.tokenOut.symbol}
          </div>

          {state.routeInfo && (
            <div className="mt-2 text-xs text-gray-500">
              {state.routeInfo.isDirectRoute ? (
                <div className="flex justify-between">
                  <span>Direct swap</span>
                  <span>{state.routeInfo.routeString}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Route: {state.routeInfo.routeString}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isConnected && (
        <div className="flex justify-center items-center mt-2">
          <appkit-account-button />
        </div>
      )}
    </div>
  );
};

export default SwapWidget;
