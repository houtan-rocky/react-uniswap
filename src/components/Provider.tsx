"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import type { ProviderProps, AppKitFeatures } from "../";

export const Provider: React.FC<ProviderProps> = ({
  children,
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

  // Get the wagmi config from the adapter
  const config = wagmiAdapter.wagmiConfig;

  // Initialize AppKit with provided configuration
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    debug: appKitConfig.debug,
    enableCoinbase: appKitConfig.enableCoinbase,
    defaultNetwork: appKitConfig.defaultNetwork || networks[0],
    metadata,
    features: appKitConfig.features as AppKitFeatures,
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
