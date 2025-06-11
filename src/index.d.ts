import { FC } from "react";
import { CreateConnectorFn } from "wagmi";
import { ProviderProps } from "./components/Provider";
import type { Features } from "@reown/appkit/react";

// Components
export const Provider: FC<ProviderProps>;
export { default as SwapWidget } from "./components/SwapWidget";

// Networks
export {
  base,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  avalanche,
  fantom,
  moonbeam,
  solana,
} from "@reown/appkit/networks";

// Constants
export {
  VIRTUAL_PROTOCOL_TOKEN,
  DEFAULT_SLIPPAGE,
  DEFAULT_DEADLINE_MINUTES,
  VritualProtocolTokenInfo,
  SolaceTokenInfo,
} from "./constants";

// Configuration
export { default as config } from "./config/env";

// Types from ./types
export type {
  SwapProps,
  ThemeConfig,
  TokenInfo,
  PoolConfig,
  SwapState,
} from "./types";

// Constants from ./types
export { lightTheme, darkTheme } from "./types";

// AppKit types
export type AppKitFeatures = Features;

export interface AppKitMetadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

export type { ProviderProps } from "./components/Provider";

// Wagmi types
export type { CreateConnectorFn };
