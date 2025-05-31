import { Token } from "@uniswap/sdk-core";
import { useEffect, useRef } from "react";
import { formatUnits } from "viem";
import { RATE_LIMIT_CONFIG } from "../config/rateLimit";
import { SwapState } from "../types";
import { fromReadableAmount } from "../utils/conversion";

/**
 * Call Uniswap's quote API to get optimal routing
 */
async function getUniswapQuote(
  inputToken: Token,
  outputToken: Token,
  amountIn: string
): Promise<{
  amountOut: string;
  routeInfo: {
    isDirectRoute: boolean;
    routeString?: string;
    routeType?: string;
  };
}> {
  console.log(`🔍 Getting Uniswap quote: ${inputToken.symbol} → ${outputToken.symbol}`);
  
  const quoteRequest = {
    amount: amountIn,
    generatePermitAsTransaction: false,
    gasStrategies: [
      {
        limitInflationFactor: 1.15,
        displayLimitInflationFactor: 1,
        priceInflationFactor: 1.5,
        percentileThresholdFor1559Fee: 75,
        thresholdToInflateLastBlockBaseFee: 0,
        baseFeeMultiplier: 1.05,
        baseFeeHistoryWindow: 100,
        minPriorityFeeGwei: 2,
        maxPriorityFeeGwei: 9
      }
    ],
    swapper: "0x42437bd8629D3ABB0ae7b16A8D6dc9E6e51B00B2",
    tokenIn: inputToken.address,
    tokenInChainId: inputToken.chainId,
    tokenOut: outputToken.address,
    tokenOutChainId: outputToken.chainId,
    type: "EXACT_INPUT",
    urgency: "normal",
    protocols: ["UNISWAPX_V2", "V4", "V3", "V2"],
    hooksOptions: "V4_HOOKS_INCLUSIVE",
    slippageTolerance: 2.5
  };

  console.log("Quote request:", quoteRequest);

  const response = await fetch('/api/uniswap/v1/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteRequest)
  });

  if (!response.ok) {
    throw new Error(`Uniswap API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Uniswap quote response:", data);

  if (!data.quote) {
    throw new Error("No quote available from Uniswap API");
  }

  let amountOut: string;
  let routeInfo: {
    isDirectRoute: boolean;
    routeString?: string;
    routeType?: string;
  };

  // Handle different response formats based on routing type
  if (data.routing === "PRIORITY") {
    // UniswapX response format
    if (!data.quote.expectedAmountOut) {
      throw new Error("Invalid UniswapX quote response");
    }
    amountOut = formatUnits(BigInt(data.quote.expectedAmountOut), outputToken.decimals);
    routeInfo = {
      isDirectRoute: true,
      routeString: "UniswapX",
      routeType: "UniswapX"
    };
  } else if (data.routing === "CLASSIC") {
    // Classic V2/V3 response format
    if (!data.quote.output?.amount) {
      throw new Error("Invalid Classic quote response");
    }
    amountOut = formatUnits(BigInt(data.quote.output.amount), outputToken.decimals);
    routeInfo = {
      isDirectRoute: data.quote.route?.[0]?.length === 1,
      routeString: data.quote.routeString,
      routeType: "Classic"
    };
  } else {
    throw new Error(`Unsupported routing type: ${data.routing}`);
  }

  console.log("Processed quote:", { amountOut, routeInfo });
  
  return {
    amountOut,
    routeInfo
  };
}

/**
 * Custom hook to update the token swap quote using Uniswap's official API.
 */
export default function useQuote({
  state,
  setState,
}: {
  state: SwapState;
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
}) {
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const lastQuoteParams = useRef<string>("");
  const abortController = useRef<AbortController>();

  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Abort previous request
    if (abortController.current) {
      abortController.current.abort();
    }

    async function updateQuote() {
      if (
        !state.inputToken ||
        !state.outputToken ||
        !state.inputAmount ||
        Number(state.inputAmount) === 0
      ) {
        setState((prev) => ({ ...prev, outputAmount: "" }));
        return;
      }

      // Create a unique key for this quote request to avoid duplicates
      const quoteKey = `${state.inputToken.address}-${state.outputToken.address}-${state.inputAmount}`;
      if (lastQuoteParams.current === quoteKey) {
        return; // Skip if we just fetched the same quote
      }
      lastQuoteParams.current = quoteKey;

      // Create new abort controller for this request
      abortController.current = new AbortController();

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Create Token instances using Uniswap SDK
        const IN_TOKEN = new Token(
          state.inputToken.chainId,
          state.inputToken.address,
          state.inputToken.decimals,
          state.inputToken.symbol,
          state.inputToken.name
        );

        const OUT_TOKEN = new Token(
          state.outputToken.chainId,
          state.outputToken.address,
          state.outputToken.decimals,
          state.outputToken.symbol,
          state.outputToken.name
        );

        // Convert input amount to wei
        const amountInWei = fromReadableAmount(
          Number(state.inputAmount),
          state.inputToken.decimals
        ).toString();

        // Check if request was aborted before making the call
        if (abortController.current?.signal.aborted) {
          return;
        }

        console.log("🎯 Getting quote from Uniswap API:", `${IN_TOKEN.symbol} → ${OUT_TOKEN.symbol}`);

        // Get quote from Uniswap API (no fallback needed - it's very reliable)
        const { amountOut, routeInfo } = await getUniswapQuote(
          IN_TOKEN,
          OUT_TOKEN,
          amountInWei
        );

        // Check if request was aborted before updating state
        if (abortController.current?.signal.aborted) {
          return;
        }

        console.log("✅ Quote successful:", { amountOut, routeInfo });

        // Update state with the quoted amount and route info
        setState((prev) => ({
          ...prev,
          outputAmount: amountOut,
          routeInfo,
        }));
      } catch (err) {
        // Don't show error if request was aborted
        if (abortController.current?.signal.aborted) {
          return;
        }
        
        console.error("Error getting quote:", err);
        
        let errorMessage = "Failed to get quote";
        
        if (err instanceof Error) {
          if (err.message.includes('API error')) {
            errorMessage = `Uniswap API unavailable: ${err.message}`;
          } else if (err.message.includes('No quote available')) {
            errorMessage = `No liquidity available for ${state.inputToken?.symbol} → ${state.outputToken?.symbol}`;
          } else {
            errorMessage = err.message;
          }
        }
        
        setState((prev) => ({
          ...prev,
          outputAmount: "",
          error: errorMessage,
        }));
      } finally {
        // Don't update loading state if request was aborted
        if (!abortController.current?.signal.aborted) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    // Use centralized debounce configuration
    debounceTimeout.current = setTimeout(
      updateQuote,
      RATE_LIMIT_CONFIG.QUOTE_DEBOUNCE
    );

    // Cleanup function
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [state.inputToken, state.outputToken, state.inputAmount]);
}
