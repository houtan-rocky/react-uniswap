import { TokenSwapper } from "../libs/trading";
import { SwapState } from "../types";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function useSwap({ 
  state, 
  setState,
  onSwap 
}: { 
  state: SwapState; 
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
  onSwap?: (inputAmount: string, outputAmount: string) => Promise<void>;
}) {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  async function swap() {
    if (!walletClient || !publicClient || !address) {
      throw new Error("Wallet not connected");
    }

    setState((prev) => ({ ...prev, txLoading: true }));
    
    try {
      const swapper = new TokenSwapper(
        state.inputToken?.address as string,
        state.outputToken?.address as string,
        undefined, // default router address
        publicClient,
        walletClient
      );

      console.log("Initial Token in balance:", await swapper.getTokenInBalance());
      console.log("Initial Token Out balance:", await swapper.getTokenOutBalance());

      const txHash = await swapper.executeSwap(
        state.inputAmount,
        state.outputAmount,
        address
      );

      // Wait for transaction to be mined
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      // Call onSwap callback if provided
      if (onSwap) {
        await onSwap(state.inputAmount, state.outputAmount);
      }

    } catch (error) {
      console.error("Error in swap:", error);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, txLoading: false }));
    }
  }

  return {
    swap
  }
}
