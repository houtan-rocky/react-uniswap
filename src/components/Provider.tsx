"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import type { ProviderProps } from "../";

// Default query client
const queryClient = new QueryClient();

export const Provider: React.FC<ProviderProps> = ({
  children,
  config,
}) => {
  return React.createElement(
    WagmiProvider,
    { config },
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    )
  );
};
