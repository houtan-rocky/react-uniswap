import { Currency } from "@uniswap/sdk-core";
import { readContract } from "@wagmi/core";
import { ethers, providers } from "ethers";
import { useEffect } from "react";
import { Address, formatUnits } from "viem";
import { useAccount } from "wagmi";
import { config } from "../components/Provider";
import { ERC20_ABI } from "../constants";
import { LRTContractAbi } from "../contracts/LRTContractAbi";
import { getProvider } from "../libs/provider";
import { toReadableAmount } from "../libs/utils";
import { SwapState } from "../types";

export default function useBalances({
  state,
  setState,
}: {
  state: SwapState;
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
}) {
  const { address } = useAccount();

  async function getCurrencyBalance(
    provider: providers.Provider,
    address: string,
    currency: Currency
  ): Promise<string> {
    setState((prev) => ({ ...prev, balancesLoading: true }));
    if (currency.isNative || currency.symbol === "WMATIC") {
      return Number(
        ethers.utils.formatEther(await provider.getBalance(address))
      ).toFixed(3);
    }
    const ERC20Contract = new ethers.Contract(
      currency.address,
      ERC20_ABI,
      provider
    );
    const balance: number = await ERC20Contract.balanceOf(address);
    const decimals: number = await ERC20Contract.decimals();

    return toReadableAmount(balance, decimals);
  }

  const refreshBalances = async () => {
    const provider = getProvider();
    if (!address || !provider) {
      return;
    }
    if (!state.inputToken || !state.outputToken) {
      return;
    }
    const balanceIn = await getCurrencyBalance(
      provider,
      address,
      state.inputToken
    );
    const balanceOut = await readContract(config, {
      address: state.outputToken.address as Address,
      abi: LRTContractAbi,
      functionName: "balanceOf",
      args: [address],
    })
      .then((res: bigint) => formatUnits(res, 18))
      .then((res: string) => Number(res).toFixed(3));
    setState((prev) => ({
      ...prev,
      balanceIn,
    }));
    setState((prev) => ({
      ...prev,
      balanceOut,
    }));
    setState((prev) => ({ ...prev, balancesLoading: false }));
  };
  useEffect(() => {
    if (address) {
      refreshBalances();
    }
  }, [address, state.inputToken, state.outputToken]);

  return { refreshBalances };
}
