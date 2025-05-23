import { Currency, NATIVE_CURRENCIES, Token } from "@brewlabs/sdk";
import { SerializedToken } from "config/constants/types";
import { parseUnits } from "ethers/lib/utils";

export function serializeToken(token: Currency | any): SerializedToken {
  return {
    chainId: token.chainId,
    isNative: token.isNative,
    isToken: token.isToken,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    projectLink: token.projectLink,
    logo: token.logo
  };
}

export function deserializeToken(serializedToken: SerializedToken): Currency {
  if (serializedToken?.isNative || !serializedToken?.address) {
    return NATIVE_CURRENCIES[serializedToken.chainId];
  }

  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name,
    serializedToken.projectLink,
    serializedToken.logo
  );
}

export enum GAS_PRICE {
  default = "5",
  fast = "6",
  instant = "7",
  testnet = "10",
}

export const GAS_PRICE_GWEI = {
  default: parseUnits(GAS_PRICE.default, "gwei").toString(),
  fast: parseUnits(GAS_PRICE.fast, "gwei").toString(),
  instant: parseUnits(GAS_PRICE.instant, "gwei").toString(),
  testnet: parseUnits(GAS_PRICE.testnet, "gwei").toString(),
};
