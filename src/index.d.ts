import { FC } from 'react';
import { 
  SwapProps, 
  ThemeConfig, 
  TokenInfo, 
  PoolConfig,
  SwapState,
  darkTheme,
  lightTheme
} from './types';

export { 
  SwapProps,
  ThemeConfig,
  TokenInfo,
  PoolConfig,
  SwapState,
  lightTheme,
  darkTheme
};

export const SwapWidget: FC<SwapProps>;
export const Provider: FC<{
  children: React.ReactNode;
  config?: {
    appName?: string;
    projectId?: string;
    chains?: string[];
  };
}>; 