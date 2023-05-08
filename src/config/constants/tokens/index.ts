import { ChainId, Currency } from "@brewlabs/sdk";
import { serializeToken } from "state/user/hooks/helpers";
import { AppId, SerializedToken } from "../types";

import ethTokens from "./1";
import goerliTokens from "./5";
import bscTokens from "./56";
import bscTestTokens from "./97";
import polygonTokens from "./137";
import fantomTokens from "./250";
import avalancheTokens from "./43114";
import cronosTokens from "./25";
import briseTokens from "./32520";

interface SerializedTokenList {
  [symbol: string]: SerializedToken;
}

export const tokens = {
  [ChainId.GOERLI]: goerliTokens,
  [ChainId.BSC_TESTNET]: bscTestTokens,
  [ChainId.ETHEREUM]: ethTokens,
  [ChainId.BSC_MAINNET]: bscTokens,
  [ChainId.POLYGON]: polygonTokens,
  [ChainId.FANTOM]: fantomTokens,
  [ChainId.AVALANCHE]: avalancheTokens,
  [ChainId.CRONOS]: cronosTokens,
  [ChainId.BRISE]: briseTokens,
};

export const usdToken = {
  [ChainId.GOERLI]: tokens[ChainId.GOERLI].usdc,
  [ChainId.BSC_TESTNET]: tokens[ChainId.BSC_TESTNET].busd,
  [ChainId.ETHEREUM]: tokens[ChainId.ETHEREUM].usdt,
  [ChainId.BSC_MAINNET]: tokens[ChainId.BSC_MAINNET].busd,
  [ChainId.POLYGON]: tokens[ChainId.POLYGON].usdc,
  [ChainId.FANTOM]: tokens[ChainId.FANTOM].usdc,
  [ChainId.AVALANCHE]: tokens[ChainId.AVALANCHE].usdc,
  [ChainId.CRONOS]: tokens[ChainId.CRONOS].usdc,
  [ChainId.BRISE]: tokens[ChainId.BRISE].usdt,
};

export const brewsToken = {
  [ChainId.GOERLI]: tokens[ChainId.GOERLI].test,
  [ChainId.BSC_TESTNET]: tokens[ChainId.BSC_TESTNET].test,
  [ChainId.ETHEREUM]: tokens[ChainId.ETHEREUM].brews,
  [ChainId.BSC_MAINNET]: tokens[ChainId.BSC_MAINNET].brews,
  [ChainId.POLYGON]: tokens[ChainId.POLYGON].usdc,
  [ChainId.FANTOM]: tokens[ChainId.FANTOM].usdc,
  [ChainId.AVALANCHE]: tokens[ChainId.AVALANCHE].usdc,
  [ChainId.CRONOS]: tokens[ChainId.CRONOS].usdc,
  [ChainId.BRISE]: tokens[ChainId.BRISE].usdt,
};

export const earningTokens = {
  [AppId.PANCAKESWAP]: tokens[ChainId.BSC_MAINNET].cake,
  [AppId.APESWAP]: tokens[ChainId.BSC_MAINNET].banana,
  [AppId.SUSHISWAP]: tokens[ChainId.ETHEREUM].sushi,
};

export const quoteTokens = {
  [ChainId.ETHEREUM]: [tokens[ChainId.ETHEREUM].usdc, tokens[ChainId.ETHEREUM].usdt, tokens[ChainId.ETHEREUM].brews],
  [ChainId.BSC_MAINNET]: [
    tokens[ChainId.BSC_MAINNET].busd,
    tokens[ChainId.BSC_MAINNET].usdt,
    tokens[ChainId.BSC_MAINNET].brews,
  ],
};

export const serializeTokens = (chainId: ChainId): SerializedTokenList => {
  const unserializedTokens: { [key: string]: Currency } = tokens[chainId];
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) };
  }, {} as any);

  return serializedTokens;
};

export const factoryTokens = {
  [ChainId.ETHEREUM]: [ethTokens.brews],
  [ChainId.BSC_MAINNET]: [bscTokens.brews],
};

export const popularTokens = {
  [ChainId.ETHEREUM]: [ethTokens.brews, ethTokens.eth, ethTokens.usdc, ethTokens.usdt],
  [ChainId.BSC_MAINNET]: [bscTokens.brews, bscTokens.bnb, bscTokens.busd, bscTokens.usdt],
};
