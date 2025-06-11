"use client";

import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { injected } from "wagmi/connectors";
import type { ProviderProps } from "../";

// Default query client
const queryClient = new QueryClient();

export const Provider: React.FC<ProviderProps> = ({
  children,
  config,
  projectId,
  networks,
  defaultNetwork,
  metadata = {
    name: "Uniswap Widget",
    description: "Uniswap Widget Integration",
    url:
      typeof window !== "undefined"
        ? window.location.origin
        : "https://uniswap.org",
    icons: [],
  },
}) => {
  // Initialize AppKit
  useMemo(() => {
    if (typeof window !== "undefined") {
      // Create injected connector with specific configuration
      const injectedConnector = injected({
        shimDisconnect: true,
      });

      const adapter = new WagmiAdapter({
        projectId,
        networks,
        connectors: [injectedConnector],
        ssr: false,
      });

      createAppKit({
        adapters: [adapter],
        networks,
        projectId,
        metadata: metadata,
        features: {
          analytics: true,
          email: false,
          socials: false,
          allWallets: true,
          emailShowWallets: false,
          swaps: true,
        },
        enableInjected: true,
        showWallets: true,
        defaultNetwork: defaultNetwork,
        themeMode: "light",
      });
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
