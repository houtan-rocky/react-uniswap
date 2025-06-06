import React, { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { DEFAULT_POOL_CONFIG } from "../config/tokens";
import { SwapState, SwapProps, lightTheme, ThemeConfig } from "../types";
import useQuote from "../hooks/useQuote";
import useSwap from "../hooks/useSwap";
import { IoMdArrowDown } from "react-icons/io";
import { useAppKit } from "@reown/appkit/react";

const SwapWidget: React.FC<SwapProps> = ({
  poolConfig = DEFAULT_POOL_CONFIG,
  theme: customTheme = {},
}) => {
  const { open } = useAppKit();
  const { isConnected } = useAccount();
  
  // Merge custom theme with default light theme
  const theme = useMemo<ThemeConfig>(() => ({
    ...lightTheme,
    ...customTheme,
    tokenButton: {
      ...lightTheme.tokenButton,
      ...customTheme.tokenButton,
    },
    swapButton: {
      ...lightTheme.swapButton,
      ...customTheme.swapButton,
    },
    connectButton: {
      ...lightTheme.connectButton,
      ...customTheme.connectButton,
    },
    inputField: {
      ...lightTheme.inputField,
      ...customTheme.inputField,
    },
    buySection: {
      ...lightTheme.buySection,
      ...customTheme.buySection,
    },
  }), [customTheme]);

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

  const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
    <div 
      className="relative w-full max-w-md rounded-xl p-2"
      style={{ backgroundColor: theme.background }}
    >
      {/* Sell Section */}
      <div 
        className="p-4 rounded-2xl relative"
        style={{ 
          backgroundColor: theme.foreground,
          border: `1px solid ${theme.border}` 
        }}
      >
        <label className="block mb-2" style={{ color: theme.textSecondary }}>
          Sell
        </label>
        <div className="flex items-center">
          <input
            type="text"
            value={state.inputAmount}
            onChange={handleInputAmountChange}
            className="w-full text-2xl outline-none"
            placeholder="0"
            inputMode="decimal"
            style={{ 
              backgroundColor: theme.inputField.background,
              color: theme.inputField.text,
            }}
          />
          <div className="flex flex-col gap-2">
            <div 
              className="ml-2 p-3 py-2 rounded-full flex items-center justify-center gap-2 min-w-[140px]"
              style={{ 
                backgroundColor: theme.tokenButton.background,
                border: `1px solid ${theme.tokenButton.border}`,
              }}
            >
              {poolConfig.tokenIn.logoURI && (
                <img
                  src={poolConfig.tokenIn.logoURI}
                  alt={poolConfig.tokenIn.symbol}
                  className="h-[20px] w-[20px] flex-shrink-0 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <span style={{ color: theme.tokenButton.text }} className="font-bold text-sm">
                {poolConfig.tokenIn.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="relative z-10 flex justify-center items-center h-[5px]">
        <div 
          className="rounded-2xl w-[40px] h-[40px] flex justify-center items-center"
          style={{ backgroundColor: theme.border }}
        >
          <IoMdArrowDown className="text-2xl" style={{ color: theme.text }} />
        </div>
      </div>

      {/* Buy Section */}
      <div 
        className="mb-2 p-4 rounded-2xl relative"
        style={{ 
          backgroundColor: theme.buySection.background,
          border: `1px solid ${theme.buySection.border}` 
        }}
      >
        <label className="block mb-2" style={{ color: theme.textSecondary }}>
          Buy
        </label>
        <div className="flex items-center">
          <input
            type="text"
            value={state.loading ? "Fetching Quotes" : state.outputAmount || "0"}
            readOnly
            disabled={state.loading}
            className="w-full text-2xl outline-none disabled:text-lg"
            style={{ 
              backgroundColor: theme.inputField.background,
              color: theme.inputField.text,
              opacity: state.loading ? 0.3 : 0.8,
            }}
            placeholder="0"
          />
          <div className="flex flex-col gap-2">
            <div 
              className="ml-2 p-3 py-2 rounded-full flex items-center justify-center gap-2 min-w-[140px]"
              style={{ 
                backgroundColor: theme.tokenButton.background,
                border: `1px solid ${theme.tokenButton.border}`,
              }}
            >
              {poolConfig.tokenOut.logoURI && (
                <img
                  src={poolConfig.tokenOut.logoURI}
                  alt={poolConfig.tokenOut.symbol}
                  className="h-[20px] w-[20px] flex-shrink-0 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <span style={{ color: theme.tokenButton.text }} className="font-bold text-sm">
                {poolConfig.tokenOut.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="mb-2 p-4 bg-red-50 text-red-500 rounded-2xl">
          {state.error}
        </div>
      )}

      {/* Action Button */}
      {isConnected ? (
        <button
          disabled={state.loading || !state.inputAmount || Number(state.inputAmount) <= 0}
          onClick={swap}
          className="w-full py-4 rounded-2xl transition-colors"
          style={{ 
            backgroundColor: state.loading || !state.inputAmount || Number(state.inputAmount) <= 0
              ? theme.swapButton.disabledBackground
              : theme.swapButton.background,
            color: state.loading || !state.inputAmount || Number(state.inputAmount) <= 0
              ? theme.swapButton.disabledText
              : theme.swapButton.text,
          }}
        >
          {state.loading ? "Getting Quote..." : "Swap"}
        </button>
      ) : (
        <button
          onClick={onConnectWallet}
          className="w-full py-4 rounded-2xl transition-colors"
          style={{ 
            backgroundColor: theme.connectButton.background,
            color: theme.connectButton.text,
          }}
        >
          Connect Wallet
        </button>
      )}

      {/* Price Info */}
      {state.inputAmount && state.outputAmount && (
        <div className="p-4 rounded-2xl">
          <div className="flex justify-between items-center text-sm mb-2" style={{ color: theme.textSecondary }}>
            1 {poolConfig.tokenIn.symbol} ={" "}
            {(Number(state.outputAmount) / Number(state.inputAmount)).toFixed(6)}{" "}
            {poolConfig.tokenOut.symbol}
          </div>

          {state.routeInfo && (
            <div className="mt-2 text-xs" style={{ color: theme.textSecondary }}>
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

      {/* Account Button */}
      {isConnected && (
        <div className="flex justify-center items-center mt-2">
          <appkit-account-button />
        </div>
      )}
    </div>
  );
};

export default SwapWidget;
