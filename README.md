# Uniswap Widget Package

A clean, ready-to-use Uniswap swap widget package that can be easily integrated into any React application.

## Features

- 🔄 Complete swap functionality using Uniswap Protocol
- 🔗 Built-in wallet connection support
- 🎨 Clean, customizable UI
- 📱 Responsive design
- ⚡ Fast and lightweight
- 🔧 Environment-based configuration

## Installation

```bash
npm install
```

## Setup

1. Copy the environment example file:
```bash
cp env.example .env
```

2. Update the `.env` file with your configuration:
```bash
# WalletConnect/AppKit Configuration
VITE_REOWN_PROJECT_ID=your_walletconnect_project_id_here

# App Metadata
VITE_APP_NAME=Your App Name
VITE_APP_DESCRIPTION=Your app description
VITE_APP_URL=https://your-domain.com
VITE_APP_ICON=https://your-icon-url.com/icon.png
```

3. Get a WalletConnect Project ID:
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy the Project ID to your `.env` file

## Usage

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Integration

This package provides a simple SwapWidget component that can be easily integrated into your React application. The widget handles all the complexity of interacting with the Uniswap protocol, including:

- Token selection
- Price quotation
- Wallet connection
- Transaction execution
- Balance management

### Basic Usage

```tsx
import { SwapWidget, Provider } from 'uniswap-widget-package';

function App() {
  return (
    <Provider>
      <SwapWidget />
    </Provider>
  );
}
```

## Configuration

### Environment Variables

The widget supports configuration through environment variables:

- `VITE_REOWN_PROJECT_ID`: WalletConnect project ID (required)
- `VITE_APP_NAME`: Your application name
- `VITE_APP_DESCRIPTION`: Description shown in wallet prompts
- `VITE_APP_URL`: Your application URL
- `VITE_APP_ICON`: Icon URL for wallet displays

### Widget Options

The widget supports configuration for:
- Custom token lists
- Network settings
- Slippage tolerance
- Transaction deadlines

## License

This project is open source and available under the [MIT License](LICENSE).
