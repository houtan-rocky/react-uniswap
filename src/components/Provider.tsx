"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config } from "wagmi";

type ProviderProps = {
  children: React.ReactNode;
  config: Config;
};

export const Provider: React.FC<ProviderProps> = ({ children, config }) => {
  return React.createElement(
    WagmiProvider,
    { config: config },
    React.createElement(
      QueryClientProvider,
      { client: new QueryClient() },
      children
    )
  );
};
