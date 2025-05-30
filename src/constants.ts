import { Token } from "@uniswap/sdk-core";
import { TokenInfo } from "./types";

export const SOLACE_TOKEN = new Token(
  8453,
  "0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1",
  18,
  "SOLACE",
  "Solace by Virtuals",
);

export const VIRTUAL_PROTOCOL_TOKEN = new Token(
  8453,
  "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
  18,
  "VIRTUAL",
  "Virtual Protocol"
);

export const VritualProtocolTokenInfo: TokenInfo = {
  tokenId: "8453_0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
  chainId: 8453,
  address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
  decimals: 18,
  symbol: "VIRTUAL",
  name: "Virtual Protocol",
  standard: "ERC20",
  projectName: "Virtuals Protocol",
  logoUrl:
    "https://coin-images.coingecko.com/coins/images/34057/large/LOGOMARK.png?1708356054",
  isSpam: "FALSE",
  safetyLevel: "STRONG_WARNING",
  feeData: {
    sellFeeBps: "0",
    buyFeeBps: "0",
  },
  protectionInfo: {
    result: "Benign",
    tokenId: "8453_0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
    chainId: 8453,
    address: "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
    blockaidFees: null,
    updatedAt: 1748582268,
  },
};
// read from json all.json
export const SolaceTokenInfo: TokenInfo = {
  tokenId: "8453_0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1",
  chainId: 8453,
  address: "0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1",
  decimals: 18,
  symbol: "SOLACE",
  name: "Solace by Virtuals",
  standard: "ERC20",
  projectName: "Solace",
  logoUrl:
    "https://coin-images.coingecko.com/coins/images/66174/large/solace_logo.jpg?1748565484",
  isSpam: "FALSE",
  safetyLevel: "STRONG_WARNING",
  feeData: {
    sellFeeBps: "0",
    buyFeeBps: "0",
  },
  protectionInfo: {
    result: "Benign",
    tokenId: "8453_0x7d6fcb3327d7e17095fa8b0e3513ac7a3564f5e1",
    chainId: 8453,
    address: "0x7d6fcb3327d7e17095fa8b0e3513ac7a3564f5e1",
    blockaidFees: {
      buy: 0.01,
      sell: 0.01,
    },
    updatedAt: 1748577080,
  },
};

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
