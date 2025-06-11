"use client";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, CreateConnectorFn, WagmiProvider } from "wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import type { Features } from "@reown/appkit/react";

export interface ProviderProps {
  children: React.ReactNode;
  projectId: string;
  networks: [AppKitNetwork, ...AppKitNetwork[]]; // At least one network required
  defaultNetwork: AppKitNetwork;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
  features?: Features;
  connectors?: CreateConnectorFn[];
  debug?: boolean;
  enableInjected?: boolean;
  showWallets?: boolean;
  enableWalletConnect?: boolean;
  allowUnsupportedChain?: boolean;
  featuredWalletIds?: string[];
}

const queryClient = new QueryClient();

export default function Provider({
  children,
  projectId,
  networks,
  defaultNetwork,
  metadata,
  features,
  connectors = [],
  debug = false,
  enableInjected = true,
  showWallets = true,
  enableWalletConnect = true,
  allowUnsupportedChain = false,
  featuredWalletIds,
}: ProviderProps) {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const wagmiAdapter = new WagmiAdapter({
    projectId,
    connectors,
    networks,
  });

  createAppKit({
    debug,
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork,
    metadata,
    features,
    enableInjected,
    showWallets,
    enableWalletConnect,
    allowUnsupportedChain,
    ...(featuredWalletIds && { featuredWalletIds }),
  });

  const config = wagmiAdapter.wagmiConfig as Config;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
