// Export the main SwapWidget component
export { default as SwapWidget } from './components/SwapWidget';

// Export the Provider component for wallet management
export { default as Provider } from './components/Provider';

// Export configuration
export { default as config } from './config/env';

// Export types for TypeScript users
export * from './types';

// Export commonly used constants
export {
  VIRTUAL_PROTOCOL_TOKEN,
  DEFAULT_SLIPPAGE,
  DEFAULT_DEADLINE_MINUTES,
  VritualProtocolTokenInfo,
  SolaceTokenInfo,
} from "./constants";