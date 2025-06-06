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

const connectors: CreateConnectorFn[] = [];

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  connectors,
  networks,
});

export const clientConfig = wagmiAdapter.wagmiConfig;

const queryClient = new QueryClient();

const metadata = {
  name: config.appName,
  description: config.appDescription,
  url: config.appUrl,
  icons: [config.appIcon],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
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
  enableInjected: true,
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
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
};
