/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber, ethers } from "ethers";
import { SwapAggregatorAbi } from "../contracts/SwapAggregatorAbi";

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

const ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const LRT_AGGREGATOR_ADDRESS = "0xBeeF78C2971144C88E4537c079e732E7EEEB2D23";

export class TokenSwapper {
  private signer: ethers.providers.JsonRpcSigner;
  private router: ethers.Contract;
  private tokenIn: ethers.Contract;
  private tokenOut: ethers.Contract;
  private isNativeToken: boolean = false;

  constructor(tokenInAddress: string, tokenOutAddress: string, isNativeToken: boolean) {
    this.isNativeToken = isNativeToken;
    this.signer = (new ethers.providers.Web3Provider(window?.ethereum as any)).getSigner();
    this.router = new ethers.Contract(
      LRT_AGGREGATOR_ADDRESS,
      SwapAggregatorAbi,
      this.signer
    );
    this.tokenIn = new ethers.Contract(tokenInAddress, ERC20_ABI, this.signer);
    this.tokenOut = new ethers.Contract(
      tokenOutAddress,
      ERC20_ABI,
      this.signer
    );
  }

  parseCustomError(error: any): string {
    if (error.data) {
      const errorSignature = error.data.slice(0, 10); // First 4 bytes of the error data
      const errorName = Object.keys(this.router.interface.errors).find(
        (key) => this.router.interface.getSighash(key) === errorSignature
      );
      if (errorName) {
        const parsedError = this.router.interface.parseError(error.data);
        return `Custom Error: ${errorName}(${parsedError.args.join(', ')})`;
      }
    }
    return error.message;
  }

  async simulateTransaction(functionName: string, functionArgs: any[], value: BigNumber): Promise<string> {
    const overrides = {
      value: value,
    };
    try {
      await this.router.callStatic[functionName](...functionArgs, overrides);
      return "Ok";
    } catch (error) {
      return this.parseCustomError(error);
    }

  }

  async executeSwap(
    amountIn: BigNumber,
    amountOut: BigNumber
  ): Promise<void> {
    try {
      const recipient = await this.signer.getAddress();
      if (this.isNativeToken) {
        const overrides = {
          value: amountIn,
        };
        const estimatedGasLimit = await this.router.estimateGas['swapExactETHForTokensV3'](
          ROUTER_ADDRESS,
          ethers.utils.formatBytes32String("POL/LRT"),
          amountOut,
          recipient,
          {
            value: overrides.value
          }
        );

        const tx = await this.router.swapExactETHForTokensV3(
          ROUTER_ADDRESS,
          ethers.utils.formatBytes32String("POL/LRT"),
          amountOut,
          recipient,
          {
            value: overrides.value,
            gasLimit: estimatedGasLimit.mul(2),
          }
        );

        await tx.wait();
      } else {
        const approveTx = await this.tokenIn.approve(LRT_AGGREGATOR_ADDRESS, amountIn);
        await approveTx.wait();
        const estimatedGasLimit = await this.router.estimateGas['swapExactTokensForTokensV3'](
          ROUTER_ADDRESS,
          ethers.utils.formatBytes32String(`${await this.tokenIn.symbol()}/LRT`),
          amountIn,
          amountOut,
          recipient
        );
        const tx = await this.router.swapExactTokensForTokensV3(
          ROUTER_ADDRESS,
          ethers.utils.formatBytes32String(`${await this.tokenIn.symbol()}/LRT`),
          amountIn,
          amountOut,
          recipient,
          {
            gasLimit: estimatedGasLimit.mul(2),
          }
        );

        await tx.wait();
      }
    } catch (error) {
      console.error("Swap execution failed:", error);
      throw error;
    }
  }

  async getTokenInBalance(): Promise<string> {
    const balance = await this.tokenIn.balanceOf(
      await this.signer.getAddress()
    );
    const decimals = await this.tokenIn.decimals();
    return ethers.utils.formatUnits(balance, decimals);
  }

  async getTokenOutBalance(): Promise<string> {
    const balance = await this.tokenOut.balanceOf(
      await this.signer.getAddress()
    );
    const decimals = await this.tokenOut.decimals();
    return ethers.utils.formatUnits(balance, decimals);
  }
}
