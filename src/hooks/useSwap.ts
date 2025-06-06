import { TokenSwapper } from "../libs/trading";
import { SwapState } from "../types";

export default function useSwap({ state, setState }: { state: SwapState; setState: React.Dispatch<React.SetStateAction<SwapState>> }) {

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
      await swapper.executeSwap(
        state.inputAmount,
        state.outputAmount,
        signer,
      );
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
