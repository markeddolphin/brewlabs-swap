import { ChainId } from "@brewlabs/sdk";

export const SUBGRAPH_NAMES = {
  [ChainId.ETHEREUM]: "brewlabs-aggregator-mainnet",
  [ChainId.BSC_MAINNET]: "brewlabs-aggregator-bsc",
  [ChainId.ARBITRUM]: "brewlabs-aggregator-arbitrum",
  [ChainId.POLYGON]: "brewlabs-aggregator-polygon"
};

export const SUPPORTED_DEXES = {
  [ChainId.ETHEREUM]: ["uniswap-v2"],
  [ChainId.BSC_MAINNET]: ["pcs-v2"],
};

export const DEX_LOGOS = {
  "uniswap-v2": "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
  "pcs-v2": "https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png",
  quickswap: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/4098.png",
  spookyswap: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/1455.png",
  tradejoe: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/6799.png",
  mmfinance: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/1572.png",
};
