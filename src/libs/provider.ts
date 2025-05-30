import { ethers } from "ethers";

const mainnetProvider = new ethers.providers.JsonRpcProvider(
  "https://polygon-rpc.com"
);

export function getProvider() {
  return mainnetProvider;
}
