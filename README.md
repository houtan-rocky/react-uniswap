# Uniswap Widget Package

A React component package for easily integrating Uniswap swap functionality into your dApp.

## Installation

```bash
npm install uniswap-widget-package @reown/appkit @reown/appkit-adapter-wagmi wagmi @tanstack/react-query
# or
yarn add uniswap-widget-package @reown/appkit @reown/appkit-adapter-wagmi wagmi @tanstack/react-query
# or
pnpm add uniswap-widget-package @reown/appkit @reown/appkit-adapter-wagmi wagmi @tanstack/react-query
```

## Configuration

### 1. WalletConnect Project ID
Get your WalletConnect v2 Project ID at: https://cloud.walletconnect.com/

### 2. Provider Setup

Wrap your app with the Provider component:

```tsx
// pages/_app.tsx or similar
import { Provider } from 'uniswap-widget-package';
import { base } from '@reown/appkit/networks';
import { createConfig } from 'wagmi';

// Create your wagmi config
const wagmiConfig = createConfig({
  // Your wagmi configuration here
});

export default function App({ Component, pageProps }) {
  return (
    <Provider
      projectId="your_wallet_connect_project_id"
      networks={[base]} // Must provide at least one network
      config={wagmiConfig}
      metadata={{
        name: "Your App Name",
        description: "Your app description",
        url: "https://your-domain.com",
        icons: ["https://your-icon-url.com/icon.png"]
      }}
      appKitConfig={{
        debug: false,
        enableCoinbase: false,
        defaultNetwork: base,
        features: {
          analytics: false,
          email: false,
          socials: false,
          allWallets: false,
          emailShowWallets: false,
          swaps: false
        },
        enableInjected: false,
        showWallets: false
      }}
    >
      <Component {...pageProps} />
    </Provider>
  );
}
```

## Provider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | Your WalletConnect v2 Project ID |
| networks | Network[] | Yes | Array of supported networks (must have at least one) |
| config | WagmiConfig | Yes | Wagmi configuration object |
| connectors | CreateConnectorFn[] | No | Custom wallet connectors |
| metadata | Metadata | No | App metadata for wallet connections |
| appKitConfig | AppKitConfig | No | Configuration for AppKit features |

## Usage

```tsx
import { SwapWidget } from 'uniswap-widget-package';

export default function SwapPage() {
  return (
    <SwapWidget 
      // Optional: Configure widget
      config={{
        defaultInputToken: 'ETH',
        defaultOutputToken: 'USDC',
        theme: 'dark', // or 'light'
        slippageTolerance: 0.5, // 0.5%
        deadlineMinutes: 20,
      }}
    />
  );
}
```

## Requirements

- React 18 or higher
- Next.js 13 or higher
- Valid WalletConnect v2 Project ID

## Features

- Easy integration with Next.js and React
- Built-in wallet connection via WalletConnect v2
- Customizable UI
- TypeScript support
- Multi-chain support
- Dark/Light theme
- Customizable token lists
- Configurable AppKit features

## License

MIT
