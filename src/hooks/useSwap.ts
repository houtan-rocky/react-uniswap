import { ethers } from "ethers";
import { TokenSwapper } from "../libs/trading";
import { SwapState } from "../types";

export default function useSwap({ state, setState }: { state: SwapState; setState: React.Dispatch<React.SetStateAction<SwapState>> }) {

  async function swap() {
    setState((prev) => ({ ...prev, txLoading: true }));
    const swapper = new TokenSwapper(
      state.inputToken?.address as string,
      state.outputToken?.address as string,
      state.inputToken?.symbol === "WMATIC"
    );
    try {
      console.log("Initial Token in balance:", await swapper.getTokenInBalance());
      console.log("Initial Token Out balance:", await swapper.getTokenOutBalance());

      await swapper.executeSwap(
        ethers.utils.parseUnits(state.inputAmount.toString(), state.inputToken?.decimals as number),
        ethers.utils.parseUnits(state.outputAmount.toString(), state.outputToken?.decimals as number),
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
