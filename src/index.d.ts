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
import { Config } from 'wagmi';

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
  config: Config;
}>; 