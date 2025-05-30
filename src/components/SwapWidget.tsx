import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { useAccount } from "wagmi";
import {
  DEFAULT_DEADLINE_MINUTES,
  DEFAULT_SLIPPAGE,
  LRT_TOKEN,
  USDT_TOKEN,
} from "../constants";
import useBalances from "../hooks/useBalances";
import useQuote from "../hooks/useQuote";
import useSwap from "../hooks/useSwap";
import { useTokenList } from "../hooks/useTokenList";
import { SwapState } from "../types";
import { TokenList } from "./TokenList";
import { IoMdArrowDown } from "react-icons/io";
import { useAppKit } from "@reown/appkit/react";

const SwapWidget: React.FC = () => {
  const { open } = useAppKit();
  const { isConnected } = useAccount();
  const [state, setState] = useState<SwapState>({
    inputAmount: "",
    outputAmount: "",
    inputToken: USDT_TOKEN,
    outputToken: LRT_TOKEN,
    slippage: DEFAULT_SLIPPAGE,
    deadline: DEFAULT_DEADLINE_MINUTES,
    loading: false,
    txLoading: false,
    success: false,
    error: null,
    balanceIn: "",
    balanceOut: "",
    balancesLoading: false,
  });
  const [showTokenList, setShowTokenList] = useState<"input" | "output" | null>(
    null
  );
  const { tokens } = useTokenList();
  useQuote({ state, setState });
  const { swap } = useSwap({ state, setState });
  const { refreshBalances } = useBalances({ state, setState });

  const handleSwap = async () => {
    await swap();
    await refreshBalances();
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
            type="number"
            value={state.inputAmount}
            onChange={(e) =>
              setState((prev) => ({ ...prev, inputAmount: e.target.value }))
            }
            className={`w-full bg-transparent text-2xl outline-none`}
            placeholder="0"
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowTokenList("input")}
              className="ml-2 p-2 py-0 border border-gray-200 bg-white rounded-full flex items-center gap-2 w-[110px]"
            >
              {state.inputToken?.symbol && (
                <div className="relative w-[100px] h-[24px]">
                  {state.inputToken?.symbol === "USDT" && (
                    <img
                      src={
                        "https://polygonscan.com/token/images/polygonbridge_32.png"
                      }
                      className="absolute top-[-2px] right-[-2px] w-[10px] h-[10px]"
                    />
                  )}
                  <img
                    src={
                      tokens.find((t) => t.symbol === state.inputToken?.symbol)
                        ?.logoURI
                    }
                    alt={state.inputToken?.symbol}
                    className="h-[24px]"
                  />
                </div>
              )}
              <span className="font-bold">
                {state.inputToken?.symbol === "WMATIC"
                  ? "POL"
                  : state.inputToken?.symbol || "Select"}
              </span>
              <FaChevronDown className="text-4xl" />
            </button>
            {isConnected && (
              <div className="flex justify-end">
                {state.balancesLoading ? (
                  <div></div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-right opacity-60 text-sm">
                      {state.balanceIn || "0"}{" "}
                      {state.inputToken?.symbol === "WMATIC"
                        ? "POL"
                        : state.inputToken?.symbol}
                    </p>
                    <button
                      className="text-xs text-pink-500 bg-pink-50 rounded-3xl px-2"
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          inputAmount: state.balanceIn,
                        }))
                      }
                    >
                      Max
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {showTokenList === "input" && (
          <TokenList
            tokens={tokens}
            onSelect={(token) =>
              setState((prev) => ({ ...prev, inputToken: token }))
            }
            onClose={() => setShowTokenList(null)}
          />
        )}
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
              state.loading
                ? "Fetching Quotes"
                : Number(state.outputAmount).toFixed(3)
            }
            readOnly
            disabled={state.loading}
            className="w-full bg-transparent text-2xl outline-none opacity-80 disabled:opacity-30 disabled:text-lg"
            placeholder="0"
          />
          {isConnected && (
            <div className="flex flex-col gap-2">
              <div className="ml-2 p-2 py-1 border-gray-200 bg-white rounded-full flex justify-center items-center gap-2 w-[90px]">
                {state.outputToken?.symbol && (
                  <img
                    src={
                      "https://s2.coinmarketcap.com/static/img/coins/64x64/31463.png"
                    }
                    alt={state.outputToken?.symbol}
                    className="w[24px]- h-[24px]"
                  />
                )}
                <span className="font-bold">
                  {state.outputToken?.symbol === "WMATIC"
                    ? "POL"
                    : state.outputToken?.symbol || "Select"}
                </span>
              </div>
              <div className="flex justify-end">
                {state.balancesLoading ? (
                  <></>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-right opacity-60 text-sm">
                      {state.balanceOut || "0"}{" "}
                      {state.outputToken?.symbol === "WMATIC"
                        ? "POL"
                        : state.outputToken?.symbol}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {state.error && (
        <div className="mb-2 p-4 bg-red-50 text-red-500 rounded-2xl">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="mb-2 p-4 bg-green-50 text-green-500 rounded-2xl">
          Swap successful
        </div>
      )}

      {isConnected ? (
        <button
          disabled={
            state.loading ||
            state.balanceIn < state.inputAmount ||
            state.balancesLoading ||
            state.txLoading ||
            !state.inputToken ||
            !state.outputToken ||
            !state.inputAmount ||
            Number(state.inputAmount) <= 0
          }
          onClick={handleSwap}
          className="w-full py-4 bg-pink-500 text-white rounded-2xl hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {state.txLoading ? "Swapping..." : "Swap"}
        </button>
      ) : (
        <button
          onClick={onConnectWallet}
          className="w-full py-4 bg-pink-100 text-pink-500 rounded-2xl hover:bg-pink-200 transition-colors"
        >
          Connect Wallet
        </button>
      )}

      {state.inputToken &&
        state.outputToken &&
        state.inputAmount &&
        state.outputAmount && (
          <div className="p-4 rounded-2xl">
            <div className="flex justify-between items-center text-sm text-[#7d7d7d]">
              1{" "}
              {state.inputToken.symbol === "WMATIC"
                ? "POL"
                : state.inputToken.symbol}{" "}
              ={" "}
              {(Number(state.outputAmount) / Number(state.inputAmount)).toFixed(
                3
              )}{" "}
              {state.outputToken.symbol}
            </div>
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
