import { TokenSwapper } from "../libs/trading";
import { SwapState } from "../types";
import { ethers } from "ethers";

export default function useSwap({ 
  state, 
  setState,
  onSwap,
  signer
}: { 
  state: SwapState; 
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
  onSwap?: (inputAmount: string, outputAmount: string) => Promise<void>;
  signer: ethers.Signer;
}) {

  async function swap() {
    setState((prev) => ({ ...prev, txLoading: true }));
    const swapper = new TokenSwapper(
      signer,
      state.inputToken?.address as string,
      state.outputToken?.address as string,
    );
    try {
      console.log("Initial Token in balance:", await swapper.getTokenInBalance());
      console.log("Initial Token Out balance:", await swapper.getTokenOutBalance());

      const signerAddress = await swapper.getSignerAddress();
      const txHash = await swapper.executeSwap(
        state.inputAmount,
        state.outputAmount,
        signerAddress,
      );

      // Wait for transaction to be mined
      const provider = signer.provider;
      if (!provider) throw new Error("Provider not found");
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
