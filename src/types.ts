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
  inputDisabled: boolean;
  routeInfo?: {
    isDirectRoute: boolean;
    routeString?: string;
    routeType?: string;
  };
}

export interface ThemeConfig {
  // Color scheme
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  text: string;
  textSecondary: string;
  border: string;
  
  // Component specific
  tokenButton: {
    background: string;
    text: string;
    border: string;
  };
  swapButton: {
    background: string;
    text: string;
    hoverBackground: string;
    disabledBackground: string;
    disabledText: string;
  };
  connectButton: {
    background: string;
    text: string;
    hoverBackground: string;
  };
  inputField: {
    background: string;
    text: string;
    placeholder: string;
  };
  buySection: {
    background: string;
    border: string;
  };
}

export interface SwapProps {
  poolConfig?: PoolConfig;
  theme?: Partial<ThemeConfig>;
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

// Default themes
export const lightTheme: ThemeConfig = {
  primary: '#FF007A',
  secondary: '#FFE6F3',
  background: '#FCFAFE',
  foreground: '#FFFFFF',
  text: '#000000',
  textSecondary: '#7D7D7D',
  border: '#EBEBEB',
  
  tokenButton: {
    background: '#FFFFFF',
    text: '#000000',
    border: '#EBEBEB'
  },
  swapButton: {
    background: '#FF007A',
    text: '#FFFFFF',
    hoverBackground: '#FF1A8C',
    disabledBackground: '#E5E5E5',
    disabledText: '#A3A3A3'
  },
  connectButton: {
    background: '#FFE6F3',
    text: '#FF007A',
    hoverBackground: '#FFD6EC'
  },
  inputField: {
    background: 'transparent',
    text: '#000000',
    placeholder: '#A3A3A3'
  },
  buySection: {
    background: '#F5F5F5',
    border: '#EBEBEB'
  }
};

export const darkTheme: ThemeConfig = {
  primary: '#FF007A',
  secondary: '#2D0219',
  background: '#191919',
  foreground: '#232323',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  border: '#2D2D2D',
  
  tokenButton: {
    background: '#2D2D2D',
    text: '#FFFFFF',
    border: '#3D3D3D'
  },
  swapButton: {
    background: '#FF007A',
    text: '#FFFFFF',
    hoverBackground: '#FF1A8C',
    disabledBackground: '#2D2D2D',
    disabledText: '#666666'
  },
  connectButton: {
    background: '#2D0219',
    text: '#FF007A',
    hoverBackground: '#3D031F'
  },
  inputField: {
    background: 'transparent',
    text: '#FFFFFF',
    placeholder: '#666666'
  },
  buySection: {
    background: '#232323',
    border: '#2D2D2D'
  }
};
