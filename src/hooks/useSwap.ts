import { TokenSwapper } from "../libs/trading";
import { SwapState } from "../types";
import { ethers } from "ethers";

export default function useSwap({ 
  state, 
  setState,
  onSwap 
}: { 
  state: SwapState; 
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
  onSwap?: (inputAmount: string, outputAmount: string) => Promise<void>;
}) {

  async function swap() {
    setState((prev) => ({ ...prev, txLoading: true }));
    const swapper = new TokenSwapper(
      state.inputToken?.address as string,
      state.outputToken?.address as string
    );
    try {
      console.log("Initial Token in balance:", await swapper.getTokenInBalance());
      console.log("Initial Token Out balance:", await swapper.getTokenOutBalance());

      const signer = await swapper.getSignerAddress();
      const txHash = await swapper.executeSwap(
        state.inputAmount,
        state.outputAmount,
        signer,
      );

      // Wait for transaction to be mined
      if (!window.ethereum) throw new Error("No Web3 Provider found");
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as ethers.providers.ExternalProvider
      );
      await provider.waitForTransaction(txHash);

      // Call onSwap callback if provided
      if (onSwap) {
        await onSwap(state.inputAmount, state.outputAmount);
      }

    } catch (error) {
      console.error("Error in main:", error);
    } finally {
      setState((prev) => ({ ...prev, txLoading: false }));
    }
  }

  return {
    swap
  }
}
