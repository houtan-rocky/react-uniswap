import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { useAccount } from "wagmi";
import {
  DEFAULT_DEADLINE_MINUTES,
  DEFAULT_SLIPPAGE,
  SOLACE_TOKEN,
  VIRTUAL_PROTOCOL_TOKEN,
  SolaceTokenInfo,
  VritualProtocolTokenInfo,
} from "../constants";
import {
  getSellTokens,
  getBuyTokens,
  canChangeSellToken,
  canChangeBuyToken,
} from "../config/appConfig";
import useBalances from "../hooks/useBalances";
import useQuote from "../hooks/useQuote";
import useSwap from "../hooks/useSwap";
import { formatFeeDisplay } from "../libs/dynamicFees";
import { SwapState, TokenWithInfo } from "../types";
import { TokenList } from "./TokenList";
import { IoMdArrowDown } from "react-icons/io";
import { useAppKit } from "@reown/appkit/react";

const SwapWidget: React.FC = () => {
  const { open } = useAppKit();
  const { isConnected } = useAccount();
  const [state, setState] = useState<SwapState>({
    inputAmount: "",
    outputAmount: "",
    inputToken: SOLACE_TOKEN,
    outputToken: VIRTUAL_PROTOCOL_TOKEN,
    inputTokenInfo: SolaceTokenInfo,
    outputTokenInfo: VritualProtocolTokenInfo,
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

  // Get token lists from configuration
  const sellTokens = getSellTokens();
  const buyTokens = getBuyTokens();
  const allowSellChange = canChangeSellToken();
  const allowBuyChange = canChangeBuyToken();

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

  // Handle input amount changes
  const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, valid numbers, and partial numbers (like "0.", ".")
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setState((prev) => ({ ...prev, inputAmount: value }));
    }
  };

  // Handle input token selection with smart swapping
  const handleInputTokenSelect = (tokenWithInfo: TokenWithInfo) => {
    const selectedToken = tokenWithInfo.token;
    const selectedTokenInfo = tokenWithInfo.info;

    console.log("Input token selected:", {
      token: selectedToken,
      info: selectedTokenInfo,
      logoUrl: selectedTokenInfo.logoUrl,
      logoURI: selectedTokenInfo.logoURI
    });

    // Check if the selected token is already the output token
    if (
      state.outputToken &&
      selectedToken.address.toLowerCase() ===
        state.outputToken.address.toLowerCase()
    ) {
      // Swap the tokens: move current input to output, selected token to input
      setState((prev) => ({
        ...prev,
        inputToken: selectedToken,
        inputTokenInfo: selectedTokenInfo,
        outputToken: prev.inputToken,
        outputTokenInfo: prev.inputTokenInfo,
      }));
    } else {
      // Normal selection
      setState((prev) => ({
        ...prev,
        inputToken: selectedToken,
        inputTokenInfo: selectedTokenInfo,
      }));
    }
  };

  // Handle output token selection with smart swapping
  const handleOutputTokenSelect = (tokenWithInfo: TokenWithInfo) => {
    const selectedToken = tokenWithInfo.token;
    const selectedTokenInfo = tokenWithInfo.info;

    console.log("Output token selected:", {
      token: selectedToken,
      info: selectedTokenInfo,
      logoUrl: selectedTokenInfo.logoUrl,
      logoURI: selectedTokenInfo.logoURI
    });

    // Check if the selected token is already the input token
    if (
      state.inputToken &&
      selectedToken.address.toLowerCase() ===
        state.inputToken.address.toLowerCase()
    ) {
      // Swap the tokens: move current output to input, selected token to output
      setState((prev) => ({
        ...prev,
        outputToken: selectedToken,
        outputTokenInfo: selectedTokenInfo,
        inputToken: prev.outputToken,
        inputTokenInfo: prev.outputTokenInfo,
      }));
    } else {
      // Normal selection
      setState((prev) => ({
        ...prev,
        outputToken: selectedToken,
        outputTokenInfo: selectedTokenInfo,
      }));
    }
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
            <button
              onClick={() => allowSellChange && setShowTokenList("input")}
              disabled={!allowSellChange}
              className={`ml-2 p-3 py-2 border border-gray-200 bg-white rounded-full flex items-center justify-center gap-2 min-w-[140px] ${
                !allowSellChange
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              {state.inputToken?.symbol && (
                <img
                  src={state.inputTokenInfo?.logoUrl || state.inputTokenInfo?.logoURI || ""}
                  alt={state.inputToken?.symbol}
                  className="h-[20px] w-[20px] flex-shrink-0 rounded-full"
                  onError={(e) => {
                    console.log("Input token logo failed to load:", state.inputTokenInfo?.logoUrl);
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  onLoad={() => {
                    console.log("Input token logo loaded successfully:", state.inputTokenInfo?.logoUrl);
                  }}
                />
              )}
              <span className="font-bold text-sm">
                {state.inputToken?.symbol === "WMATIC"
                  ? "POL"
                  : state.inputToken?.symbol || "Select"}
              </span>
              {allowSellChange && (
                <FaChevronDown className="text-xs flex-shrink-0" />
              )}
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
        {showTokenList === "input" && allowSellChange && (
          <TokenList
            tokens={sellTokens}
            listType="sell"
            onSelect={handleInputTokenSelect}
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
                : Number(state.outputAmount).toFixed(12)
            }
            readOnly
            disabled={state.loading}
            className="w-full bg-transparent text-2xl outline-none opacity-80 disabled:opacity-30 disabled:text-lg"
            placeholder="0"
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={() => allowBuyChange && setShowTokenList("output")}
              disabled={!allowBuyChange}
              className={`ml-2 p-3 py-2 border border-gray-200 bg-white rounded-full flex items-center justify-center gap-2 min-w-[140px] ${
                !allowBuyChange
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              {state.outputToken?.symbol && (
                <img
                  src={state.outputTokenInfo?.logoUrl || state.outputTokenInfo?.logoURI || ""}
                  alt={state.outputToken?.symbol}
                  className="h-[20px] w-[20px] flex-shrink-0 rounded-full"
                  onError={(e) => {
                    console.log("Output token logo failed to load:", state.outputTokenInfo?.logoUrl);
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  onLoad={() => {
                    console.log("Output token logo loaded successfully:", state.outputTokenInfo?.logoUrl);
                  }}
                />
              )}
              <span className="font-bold text-sm">
                {state.outputToken?.symbol === "WMATIC"
                  ? "POL"
                  : state.outputToken?.symbol || "Select"}
              </span>
              {allowBuyChange && (
                <FaChevronDown className="text-xs flex-shrink-0" />
              )}
            </button>
            {isConnected && (
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
            )}
          </div>
        </div>
        {showTokenList === "output" && allowBuyChange && (
          <TokenList
            tokens={buyTokens}
            listType="buy"
            onSelect={handleOutputTokenSelect}
            onClose={() => setShowTokenList(null)}
          />
        )}
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
            <div className="flex justify-between items-center text-sm text-[#7d7d7d] mb-2">
              1{" "}
              {state.inputToken.symbol === "WMATIC"
                ? "POL"
                : state.inputToken.symbol}{" "}
              ={" "}
              {(Number(state.outputAmount) / Number(state.inputAmount)).toFixed(
                12
              )}{" "}
              {state.outputToken.symbol}
            </div>
            
            {/* Fee Information */}
            {state.routeInfo && (
              <div className="mt-2 text-xs text-gray-500">
                {state.routeInfo.isDirectRoute ? (
                  <div className="flex justify-between">
                    <span>Direct swap fee:</span>
                    <span className="font-medium">
                      {state.routeInfo.directFee ? formatFeeDisplay(state.routeInfo.directFee) : "0.3%"}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Route: {state.inputToken.symbol} → {state.routeInfo.intermediaryToken} → {state.outputToken.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>First leg fee:</span>
                      <span className="font-medium">
                        {state.routeInfo.firstLegFee ? formatFeeDisplay(state.routeInfo.firstLegFee) : "0.3%"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Second leg fee:</span>
                      <span className="font-medium">
                        {state.routeInfo.secondLegFee ? formatFeeDisplay(state.routeInfo.secondLegFee) : "0.3%"}
                      </span>
                    </div>
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
