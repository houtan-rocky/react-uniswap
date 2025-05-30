'use client';

import { polygon, base, arbitrum, optimism, avalanche, gnosis, zora, celo } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, type Config } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { CreateConnectorFn } from 'wagmi';
import config from '../config/env';

export const projectId = config.projectId;
export const connectors: CreateConnectorFn[] = [];
export const networks = [
   polygon,
   base,
   arbitrum,
   optimism,
   avalanche,
   gnosis,
   zora,
   celo,
];
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
   networks: [polygon],
   defaultNetwork: polygon,
   metadata: metadata,
   features: {
      analytics: true,
      email: false,
      socials: [],
      allWallets: true,
      emailShowWallets: true,
      swaps: false,
   },
   enableInjected: true,
   showWallets: true,
   featuredWalletIds: [
      'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
      'aba1f652e61fd536e8a7a5cd5e0319c9047c435ef8f7e907717361ff33bb3588',
   ],
});

export default function Providers({ children }: { children: React.ReactNode }) {
   return (
      <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
         <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
   );
}
