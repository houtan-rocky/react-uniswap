import { FC } from "react";
import {
  SwapProps,
  ThemeConfig,
  TokenInfo,
  PoolConfig,
  SwapState,
  darkTheme,
  lightTheme,
} from "./types";
import { Config } from "wagmi";
import { AppKitNetwork } from "@reown/appkit/networks";
import { CreateConnectorFn } from "wagmi";

export {
  SwapProps,
  ThemeConfig,
  TokenInfo,
  PoolConfig,
  SwapState,
  lightTheme,
  darkTheme,
};

export const SwapWidget: FC<SwapProps>;

export interface ProviderProps {
  children: React.ReactNode;
  config: Config;
  projectId: string;
  networks: [AppKitNetwork, ...AppKitNetwork[]]; // Ensure at least one network
  connectors?: CreateConnectorFn[];
  metadata?: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
  appKitConfig?: {
    debug?: boolean;
    enableCoinbase?: boolean;
    defaultNetwork?: AppKitNetwork;
    features?: {
      analytics?: boolean;
      email?: boolean;
      socials?: false | AppKitNetwork[];
      allWallets?: boolean;
      emailShowWallets?: boolean;
      swaps?: boolean;
    };
    enableInjected?: boolean;
    showWallets?: boolean;
  };
}
export const Provider: FC<ProviderProps>;
