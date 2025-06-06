# Uniswap Widget Package

A React component package for easily integrating Uniswap swap functionality into your dApp.

## Installation

```bash
npm install uniswap-widget-package
# or
yarn add uniswap-widget-package
# or
pnpm add uniswap-widget-package
```

## Configuration

### 1. Environment Variables
Create a `.env.local` file in your Next.js project root with these variables:

```env
# Required: WalletConnect Project ID
# Get yours at: https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Required: App Metadata (shown in wallet connection prompts)
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_DESCRIPTION=Your app description
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_ICON=https://your-icon-url.com/icon.png
```

### 2. Provider Setup

Wrap your app with the Provider component:

```tsx
// pages/_app.tsx or similar
import { Provider } from 'uniswap-widget-package';

export default function App({ Component, pageProps }) {
  return (
    <Provider
      // Optional: Override default config
      config={{
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
        // Optional: Supported chains (defaults to all major EVM chains)
        chains: ['ethereum', 'base', 'arbitrum'],
      }}
    >
      <Component {...pageProps} />
    </Provider>
  );
}
```

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

- Easy integration with Next.js
- Built-in wallet connection
- Customizable UI
- TypeScript support
- Multi-chain support
- Dark/Light theme
- Customizable token lists

## License

MIT
