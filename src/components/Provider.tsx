"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import type { ProviderProps } from "../";

// Default query client
const queryClient = new QueryClient();

export const Provider: React.FC<ProviderProps> = ({
  children,
  projectId,
  networks,
  metadata,
  features,
  ssr = true,
}) => {
  // Create Wagmi Adapter
  const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks,
    ssr,
  });

  // Initialize AppKit
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features,
  });

  return React.createElement(
    WagmiProvider,
    { config: wagmiAdapter.wagmiConfig },
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    )
  );
};
