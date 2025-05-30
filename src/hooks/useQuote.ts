import { Token } from "@uniswap/sdk-core";
import QuoterABI from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { FeeAmount } from "@uniswap/v3-sdk";
import { readContract } from "@wagmi/core";
import { useEffect } from "react";
import { Address, encodePacked, formatUnits } from "viem";
import { clientConfig } from "../components/Provider";
import { QUOTER_CONTRACT_ADDRESS, VIRTUAL_PROTOCOL_TOKEN } from "../constants";
import { SwapState } from "../types";
import { fromReadableAmount } from "../utils/conversion";

/**
 * Custom hook to update the token swap quote.
 * 
 * This function builds the swap path based on the input and output tokens.
 * It uses a direct two-token route if either token is USDT.
 * Otherwise, it routes via USDT as an intermediary.
 * 
 * Note: With the recent liquidity pool update for LRT, WMATIC is no longer used as the middle token.
 * Instead, USDT is the only available intermediary liquidity source.
 */
export default function useQuote({ state, setState }: { state: SwapState; setState: React.Dispatch<React.SetStateAction<SwapState>> }) {
  useEffect(() => {
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
        // Use USDT as the intermediary liquidity token.
        const INTERMEDIARY_TOKEN = new Token(
          VIRTUAL_PROTOCOL_TOKEN.chainId,
          VIRTUAL_PROTOCOL_TOKEN.address as Address,
          VIRTUAL_PROTOCOL_TOKEN.decimals,
          VIRTUAL_PROTOCOL_TOKEN.symbol,
          VIRTUAL_PROTOCOL_TOKEN.name
        );
        const OUT_TOKEN = new Token(
          state.outputToken.chainId,
          state.outputToken.address,
          state.outputToken.decimals,
          state.outputToken.symbol,
          state.outputToken.name
        );

        // Use direct route if either token is USDT.
        const isDirectRoute = state.inputToken.symbol === "USDT" || state.outputToken.symbol === "USDT";
        let path;
        if (isDirectRoute) {
          // Direct route: token0 -> token1 (e.g., USDT to LRT or LRT to USDT)
          path = encodePacked(
            ["address", "uint24", "address"],
            [
              IN_TOKEN.address as Address,
              FeeAmount.HIGH,
              OUT_TOKEN.address as Address,
            ]
          );
        } else {
          // Two-hop route: input -> USDT -> output
          path = encodePacked(
            ["address", "uint24", "address", "uint24", "address"],
            [
              IN_TOKEN.address as Address,
              FeeAmount.MEDIUM,
              INTERMEDIARY_TOKEN.address as Address,
              FeeAmount.HIGH,
              OUT_TOKEN.address as Address,
            ]
          );
        }

        // Convert input amount to appropriate format
        const amountIn = fromReadableAmount(
          Number(state.inputAmount),
          state.inputToken.decimals
        ).toString();

        // Fetch quoted output amount using the Uniswap Quoter contract
        const quotedAmountOut = formatUnits(
          (await readContract(clientConfig, {
            address: QUOTER_CONTRACT_ADDRESS,
            abi: QuoterABI.abi,
            functionName: "quoteExactInput",
            args: [path, amountIn],
          })) as bigint,
          state.outputToken.decimals
        );

        // Update state with the quoted amount
        setState((prev) => ({
          ...prev,
          outputAmount: quotedAmountOut as string,
        }));
      } catch (err) {
        console.error("Error getting quote:", err);
        setState((prev) => ({ ...prev, outputAmount: "", error: "Failed to get quote" }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    }

    updateQuote();
  }, [state.inputToken, state.outputToken, state.inputAmount]);
}
