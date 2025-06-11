import { FC } from "react";
import { CreateConnectorFn } from "wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import type { Features } from "@reown/appkit/react";

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

export const Provider: FC<ProviderProps>;

// Re-export types from the types module
export type {
  SwapProps,
  ThemeConfig,
  TokenInfo,
  PoolConfig,
  SwapState,
} from "./types";

// Re-export constants from the types module
export { lightTheme, darkTheme } from "./types";

// Export the SwapWidget component
export { default as SwapWidget } from "./components/SwapWidget";
