import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";

declare global {
  interface Window {
    ethereum?: Record<string, unknown>;
  }
}

export interface TokenInfo {
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logoURI: string;
  logoUrl?: string;
  tokenId?: string;
  standard?: string;
  projectName?: string;
  isSpam?: string;
  safetyLevel?: string;
  feeData?: {
    sellFeeBps: string;
    buyFeeBps: string;
  };
  protectionInfo?: {
    result: string;
    tokenId: string;
    chainId: number;
    address: string;
    blockaidFees: {
      buy?: number;
      sell?: number;
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

export interface SwapRouteInfo {
  isDirectRoute: boolean;
  directFee?: FeeAmount;
  firstLegFee?: FeeAmount;
  secondLegFee?: FeeAmount;
  intermediaryToken?: string;
}

export interface PoolConfig {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  poolAddress: string;
  version: 'V2' | 'V3';
  fee?: number; // Fee tier for V3 pools (e.g., 500, 3000, 10000)
}

export interface SwapState {
  inputAmount: string;
  outputAmount: string;
  inputToken: TokenInfo | null;
  outputToken: TokenInfo | null;
  loading: boolean;
  error: null | string;
  routeInfo?: {
    isDirectRoute: boolean;
    routeString?: string;
    routeType?: string;
  };
}

export interface SwapProps {
  poolConfig: PoolConfig;
  allowTokenChange?: boolean;
  onTokenSelect?: (tokenType: 'input' | 'output', token: TokenInfo) => void;
  onAmountChange?: (amount: string, tokenType: 'input' | 'output') => void;
  onSwap?: (inputAmount: string, outputAmount: string) => Promise<void>;
  customTokenList?: TokenInfo[];
  searchConfig?: {
    enabled: boolean;
    chainIds?: number[];
  };
}
