import { Token } from "@uniswap/sdk-core";

declare global {
  interface Window {
    ethereum?: Record<string, unknown>;
  }
}

export interface TokenInfo {
  tokenId: string;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
  logoUrl?: string;
  isSpam: string;
  safetyLevel: string;
  standard: string;
  projectName: string;
  feeData: {
    sellFeeBps: string;
    buyFeeBps: string;
  };
  protectionInfo: {
    result: string;
    tokenId: string;
    chainId: number;
    address: string;
    blockaidFees: {
      buy: number;
      sell: number;
    } | null;
    updatedAt: number;
  };
}

// Types for Uniswap Search API
export interface UniswapSearchTokenResponse {
  tokenId: string;
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  standard: string;
  projectName: string;
  logoUrl?: string;
  isSpam: string;
  safetyLevel: string;
  feeData: {
    sellFeeBps: string;
    buyFeeBps: string;
  };
  protectionInfo: {
    result: string;
    tokenId: string;
    chainId: number;
    address: string;
    blockaidFees: {
      buy: number;
      sell: number;
    };
    updatedAt: number;
  };
}

export interface UniswapSearchResponse {
  tokens?: UniswapSearchTokenResponse[];
}

export interface TokenWithInfo {
  token: Token;
  info: TokenInfo;
}

export type TokenListType = 'sell' | 'buy';

export interface AppConfig {
  allowSellTokenChange: boolean;
  allowBuyTokenChange: boolean;
  sellTokens: TokenInfo[];
  buyTokens: TokenInfo[];
}

export interface SwapState {
  inputAmount: string;
  outputAmount: string;
  inputToken: Token | null;
  outputToken: Token | null;
  inputTokenInfo: TokenInfo | null;
  outputTokenInfo: TokenInfo | null;
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
