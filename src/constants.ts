import { Token } from "@uniswap/sdk-core";
import { TokenInfo } from "./types";

export const USDT_TOKEN = new Token(
  137,
  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  6,
  "USDT",
  "Tether USD"
);

export const UsdcTokenInfo: TokenInfo = {
  chainId: 137,
  name: "USD Coin",
  address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  symbol: "USDC",
  decimals: 6,
  logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
};

export const UsdtTokenInfo: TokenInfo = {
  chainId: 137,
  name: "USDT",
  address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  symbol: "USDT",
  decimals: 6,
  logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png",
};

export const PolTokenInfo: TokenInfo = {
  chainId: 137,
  name: "Matic",
  address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  symbol: "WMATIC",
  decimals: 18,
  logoURI: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

export const lrtTokenInfo: TokenInfo = {
  chainId: 137,
  name: "",
  address: "0xfb7f8a2c0526d01bfb00192781b7a7761841b16c",
  symbol: "LRT",
  decimals: 18,
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/31463.png",
};

export const MiddleToken: TokenInfo = {
  name: "Wrapped Matic",
  address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  symbol: "WMATIC",
  decimals: 18,
  chainId: 137,
  logoURI: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

export const LRT_TOKEN = new Token(
  lrtTokenInfo.chainId,
  lrtTokenInfo.address,
  lrtTokenInfo.decimals,
  lrtTokenInfo.symbol,
  lrtTokenInfo.name
);

export const SWAP_ROUTER_ADDRESS = "0xec7BE89e9d109e7e3Fec59c222CF297125FEFda2";
export const QUOTER_CONTRACT_ADDRESS =
  "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const DEFAULT_SLIPPAGE = 0.5;
export const DEFAULT_DEADLINE_MINUTES = 20;

export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address _spender, uint256 _value) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

export const ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
];
