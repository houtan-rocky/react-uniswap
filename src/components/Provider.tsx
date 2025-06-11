"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { CreateConnectorFn } from "wagmi";
import { createAppKit, Features } from "@reown/appkit/react";
import { base } from "@reown/appkit/networks";

type AppKitNetwork = typeof base;

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

export const Provider: React.FC<ProviderProps> = ({
  children,
  config,
  projectId,
  networks,
  connectors = [],
  metadata = {
    name: "Uniswap Widget",
    description: "Uniswap Widget Integration",
    url: "https://uniswap.org",
    icons: [],
  },
  appKitConfig = {
    debug: false,
    enableCoinbase: false,
    features: {
      analytics: false,
      email: false,
      socials: false,
      allWallets: false,
      emailShowWallets: false,
      swaps: false,
    },
    enableInjected: false,
    showWallets: false,
  },
}) => {
  // Create adapter with provided configuration
  const wagmiAdapter = new WagmiAdapter({
    projectId,
    connectors,
    networks,
  });

  // Initialize AppKit with provided configuration
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    debug: appKitConfig.debug,
    enableCoinbase: appKitConfig.enableCoinbase,
    defaultNetwork: appKitConfig.defaultNetwork || networks[0],
    metadata,
    features: appKitConfig.features as Features,
    enableInjected: appKitConfig.enableInjected,
    showWallets: appKitConfig.showWallets,
  });

  return React.createElement(
    WagmiProvider,
    { config },
    React.createElement(
      QueryClientProvider,
      { client: new QueryClient() },
      children
    )
  );
};
