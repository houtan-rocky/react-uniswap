/* eslint-disable @typescript-eslint/no-explicit-any */
import { type PublicClient, type WalletClient, type Hash, parseEther, formatEther } from "viem";
import { PoolConfig } from "../types";
import { toChecksumAddress } from "../utils/addresses";

const ERC20_ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }]
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }]
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;

const V2_ROUTER_ABI = [
  {
    name: "swapExactTokensForTokens",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" }
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }]
  },
  {
    name: "getAmountsOut",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" }
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }]
  }
] as const;

interface SwapResult {
  amountIn: string;
  totalAmountOut: string;
  userAmount: string;
  portionAmount: string;
  error?: string;
}

export class TokenSwapper {
  private publicClient: PublicClient;
  private walletClient: WalletClient;
  private tokenInAddress: `0x${string}`;
  private tokenOutAddress: `0x${string}`;
  private poolConfig: PoolConfig | null = null;
  private routerAddress: `0x${string}`;
  private account: `0x${string}`;

  constructor(
    tokenInAddressOrConfig: string | PoolConfig,
    tokenOutAddress?: string,
    routerAddress?: string,
    publicClient?: PublicClient,
    walletClient?: WalletClient
  ) {
    if (!publicClient || !walletClient) {
      throw new Error("PublicClient and WalletClient are required");
    }

    if (!walletClient.account) {
      throw new Error("WalletClient must have an account");
    }

    this.publicClient = publicClient;
    this.walletClient = walletClient;
    this.account = walletClient.account.address;

    if (typeof tokenInAddressOrConfig === "string" && tokenOutAddress) {
      this.tokenInAddress = toChecksumAddress(tokenInAddressOrConfig) as `0x${string}`;
      this.tokenOutAddress = toChecksumAddress(tokenOutAddress) as `0x${string}`;
    } else if (typeof tokenInAddressOrConfig === "object") {
      const config = tokenInAddressOrConfig as PoolConfig;
      this.tokenInAddress = toChecksumAddress(config.tokenIn.address) as `0x${string}`;
      this.tokenOutAddress = toChecksumAddress(config.tokenOut.address) as `0x${string}`;
      this.poolConfig = config;
    } else {
      throw new Error("Invalid constructor arguments");
    }

    this.routerAddress = routerAddress 
      ? toChecksumAddress(routerAddress) as `0x${string}`
      : "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24" as `0x${string}`;
  }

  async getQuote(amountIn: string, portionBips = 0): Promise<SwapResult> {
    try {
      const amountInWei = parseEther(amountIn);
      const path = [this.tokenInAddress, this.tokenOutAddress];

      const amounts = await this.publicClient.readContract({
        address: this.routerAddress,
        abi: V2_ROUTER_ABI,
        functionName: "getAmountsOut",
        args: [amountInWei, path]
      });

      const amountOut = amounts[1];
      const portionAmount = portionBips > 0
        ? (amountOut * BigInt(portionBips)) / BigInt(10000)
        : BigInt(0);
      const userAmount = amountOut - portionAmount;

      if (userAmount === BigInt(0)) {
        throw new Error("Zero output amount");
      }

      return {
        amountIn: formatEther(amounts[0]),
        totalAmountOut: formatEther(amountOut),
        userAmount: formatEther(userAmount),
        portionAmount: formatEther(portionAmount)
      };
    } catch (error: any) {
      return {
        amountIn: "0",
        totalAmountOut: "0",
        userAmount: "0",
        portionAmount: "0",
        error: error.message || "Failed to get quote"
      };
    }
  }

  async executeSwap(
    amountIn: string,
    minAmountOut: string,
    recipient: string,
    deadline = Math.floor(Date.now() / 1000) + 1200 // 20 minutes
  ): Promise<Hash> {
    const amountInWei = parseEther(amountIn);
    const minAmountOutWei = parseEther(minAmountOut);
    const path = [this.tokenInAddress, this.tokenOutAddress];

    // Check allowance
    const allowance = await this.publicClient.readContract({
      address: this.tokenInAddress,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [this.account, this.routerAddress]
    });

    // Approve if needed
    if (allowance < amountInWei) {
      const { request } = await this.publicClient.simulateContract({
        address: this.tokenInAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [this.routerAddress, BigInt(2) ** BigInt(256) - BigInt(1)],
        account: this.account
      });
      await this.walletClient.writeContract(request);
    }

    // Execute swap
    const { request } = await this.publicClient.simulateContract({
      address: this.routerAddress,
      abi: V2_ROUTER_ABI,
      functionName: "swapExactTokensForTokens",
      args: [amountInWei, minAmountOutWei, path, recipient as `0x${string}`, BigInt(deadline)],
      account: this.account
    });

    return this.walletClient.writeContract(request);
  }

  async getTokenInBalance(): Promise<string> {
    const balance = await this.publicClient.readContract({
      address: this.tokenInAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [this.account]
    });
    return formatEther(balance);
  }

  async getTokenOutBalance(): Promise<string> {
    const balance = await this.publicClient.readContract({
      address: this.tokenOutAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [this.account]
    });
    return formatEther(balance);
  }

  async getTokenInSymbol(): Promise<string> {
    return this.publicClient.readContract({
      address: this.tokenInAddress,
      abi: ERC20_ABI,
      functionName: "symbol"
    });
  }

  async getTokenOutDecimals(): Promise<number> {
    return this.publicClient.readContract({
      address: this.tokenOutAddress,
      abi: ERC20_ABI,
      functionName: "decimals"
    });
  }

  getRouterAddress(): string {
    return this.routerAddress;
  }
}
