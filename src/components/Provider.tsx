"use client";

import React from "react";
import { base } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { CreateConnectorFn } from "wagmi";
import config from "../config/env";

export const projectId = config.projectId;

export const networks = [base];

// Explicitly disable all connectors
const connectors: CreateConnectorFn[] = [];

// Create adapter with minimal configuration
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  connectors,
  networks,
});

export const clientConfig = wagmiAdapter.wagmiConfig;

const metadata = {
  name: config.appName || "Uniswap Widget",
  description: config.appDescription || "Uniswap Widget Integration",
  url: "https://uniswap.org",
  icons: config.appIcon ? [config.appIcon] : [],
};

// Initialize AppKit with minimal features
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  debug: false,
  enableCoinbase: false,
  defaultNetwork: base,
  metadata: metadata,
  features: {
    analytics: false,
    email: false,
    socials: [],
    allWallets: false,
    emailShowWallets: false,
    swaps: false,
  },
  enableInjected: false,
  showWallets: false,
});

type ProviderProps = {
  children: React.ReactNode;
  config: {
    appName: string;
    projectId: string;
    chains: string[];
  };
};

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  return React.createElement(
    WagmiProvider,
    { config: wagmiAdapter.wagmiConfig as Config },
    React.createElement(
      QueryClientProvider,
      { client: new QueryClient() },
      children
    )
  );
};
