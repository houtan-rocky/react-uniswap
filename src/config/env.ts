// Environment configuration with fallback defaults
export const config = {
  // WalletConnect/AppKit Configuration
  projectId: import.meta.env.VITE_PROJECT_ID || '46709e61682756d28e52775aaec25fc8',
  
  // App Metadata
  appName: import.meta.env.VITE_APP_NAME || 'Uniswap Widget Package',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Clean Uniswap swap widget for easy integration',
  appUrl: import.meta.env.VITE_APP_URL || 'https://your-domain.com',
  appIcon: import.meta.env.VITE_APP_ICON || 'https://avatars.githubusercontent.com/u/179229932',
};

export default config; 