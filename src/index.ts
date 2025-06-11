import { type CreateConnectorFn } from 'wagmi';
import { base } from '@reown/appkit/networks';
import { Features } from '@reown/appkit/react';


// Export the main SwapWidget component
export { default as SwapWidget } from './components/SwapWidget';

// Export the Provider component for wallet management
export { Provider } from './components/Provider';

// Export configuration
export { default as config } from "./config/env";

// Export types for TypeScript users
export * from "./types";

// Export commonly used constants
export {
  VIRTUAL_PROTOCOL_TOKEN,
  DEFAULT_SLIPPAGE,
  DEFAULT_DEADLINE_MINUTES,
  VritualProtocolTokenInfo,
  SolaceTokenInfo,
} from "./constants";

// Re-export commonly used types
export type {
  SwapProps,
  ThemeConfig,
  TokenInfo,
  PoolConfig,
  SwapState,
} from "./types";

export { lightTheme, darkTheme } from "./types";

// Re-export types
export type AppKitNetwork = typeof base;
export type AppKitFeatures = Features;

export interface AppKitMetadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

export interface AppKitConfig {
  debug?: boolean;
  enableCoinbase?: boolean;
  defaultNetwork?: AppKitNetwork;
  features?: AppKitFeatures;
  enableInjected?: boolean;
  showWallets?: boolean;
}

export interface ProviderProps {
  children: React.ReactNode;
  projectId: string;
  networks: [AppKitNetwork, ...AppKitNetwork[]];
  connectors?: CreateConnectorFn[];
  metadata?: AppKitMetadata;
  appKitConfig?: AppKitConfig;
}

// Re-export necessary wagmi types for convenience
export type { CreateConnectorFn };
