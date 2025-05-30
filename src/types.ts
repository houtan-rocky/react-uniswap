import { Token } from '@uniswap/sdk-core';

declare global {
  interface Window {
    ethereum?: Record<string, unknown>;
  }
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
}

export interface SwapState {
  inputAmount: string;
  outputAmount: string;
  inputToken: Token | null;
  outputToken: Token | null;
  slippage: number;
  deadline: number;
  loading: boolean;
  txLoading: boolean;
  error: string | null;
  success: boolean;
  balanceIn: string;
  balanceOut: string;
  balancesLoading: boolean;
}