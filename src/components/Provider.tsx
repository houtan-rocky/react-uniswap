"use client";

import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { ProviderProps } from "../";

// Default query client
const queryClient = new QueryClient();

export const Provider: React.FC<ProviderProps> = ({
  children,
  projectId,
  networks,
  metadata,
}) => {
  // Initialize AppKit and WagmiAdapter
  const wagmiAdapter = useMemo(() => {
    if (typeof window !== "undefined") {
      // Create Wagmi Adapter
      const adapter = new WagmiAdapter({
        networks,
        projectId,
        ssr: true
      });

      // Create modal
      createAppKit({
        adapters: [adapter],
        networks,
        projectId,
        metadata,
        features: {
          analytics: true // Optional - defaults to your Cloud configuration
        }
      });

      return adapter;
    }
    return null;
  }, [networks, projectId, metadata]);

  // Don't render anything on the server
  if (!wagmiAdapter) {
    return null;
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
