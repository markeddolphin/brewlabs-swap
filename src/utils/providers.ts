import { SupportedChains } from "config/constants/networks";
import { ethers } from "ethers";
import { sample } from "lodash";

export const simpleRpcProvider = (chainId: number) =>
  new ethers.providers.JsonRpcProvider(
    chainId === 1
      ? "https://cloudflare-eth.com"
      : sample(SupportedChains.find((chain) => chain.id === chainId)?.rpcUrls.default.http)
  );
// eslint-disable-next-line import/no-anonymous-default-export
export default null;
