import { ChainId, Currency, JSBI, Percent, Token } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";

import { BIG_TEN } from "utils/bigNumber";
import { tokens } from "./tokens";

export const FAST_INTERVAL = 10000;
export const MEDIUM_INTERVAL = 30000;
export const SLOW_INTERVAL = 60000;
export const BIGSLOW_INTERVAL = 60000 * 2;
export const DAY_INTERVAL = 60000 * 24 * 60;

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const MULTICALL_FETCH_LIMIT = 120;

export const ETH_ADDRESSES = [
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0x0000000000000000000000000000000000000000",
];
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ROUTER_ADDRESS = {
  [ChainId.ETHEREUM]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  [ChainId.BSC_MAINNET]: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  [ChainId.POLYGON]: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
  [ChainId.FANTOM]: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
  [ChainId.AVALANCHE]: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
  [ChainId.CRONOS]: "0x145677FC4d9b8F19B5D56d1820c48e0443049a30",
  [ChainId.BRISE]: "0xBb5e1777A331ED93E07cF043363e48d320eb96c4",

  [ChainId.GOERLI]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  [ChainId.BSC_TESTNET]: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
};

export const AggregationRouterV4 = {
  [ChainId.ETHEREUM]: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
  [ChainId.BSC_MAINNET]: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
  [ChainId.POLYGON]: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
  [ChainId.FANTOM]: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
  [ChainId.AVALANCHE]: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
};

export const AggregationRouterV5 = {
  [ChainId.ETHEREUM]: "0x1111111254eeb25477b68fb85ed929f73a960582",
  [ChainId.BSC_MAINNET]: "0x1111111254eeb25477b68fb85ed929f73a960582",
  [ChainId.POLYGON]: "0x1111111254eeb25477b68fb85ed929f73a960582",
  [ChainId.FANTOM]: "0x1111111254eeb25477b68fb85ed929f73a960582",
  [ChainId.AVALANCHE]: "0x1111111254eeb25477b68fb85ed929f73a960582",
};

export const EXCHANGE_URLS = {
  [ChainId.ETHEREUM]: "https://app.uniswap.org/#",
  [ChainId.GOERLI]: "https://app.uniswap.org/#",
  [ChainId.BSC_MAINNET]: "https://pancakeswap.finance",
  [ChainId.BSC_TESTNET]: "https://pancakeswap.finance",
  [ChainId.POLYGON]: "https://quickswap.exchange",
  [ChainId.FANTOM]: "https://spookyswap.finance",
  [ChainId.AVALANCHE]: "https://traderjoexyz.com/trade",
  [ChainId.CRONOS]: "https://mm.finance",
  [ChainId.BRISE]: "https://app.icecreamswap.com/#",

  externals: {
    [ChainId.BSC_MAINNET]: {
      apeswap: "https://apeswap.finance",
    },
  },
};

export const ADD_LIQUIDITY_URLS = {
  [ChainId.ETHEREUM]: "https://app.uniswap.org/#/add/v2",
  [ChainId.GOERLI]: "https://app.uniswap.org/#/add/v2",
  [ChainId.BSC_MAINNET]: "https://pancakeswap.finance/add",
  [ChainId.BSC_TESTNET]: "https://pancakeswap.finance/add",
  [ChainId.POLYGON]: "https://quickswap.exchange/#/add",
  [ChainId.FANTOM]: "https://spookyswap.finance/add",
  [ChainId.AVALANCHE]: "https://traderjoexyz.com/pool",
  [ChainId.CRONOS]: "https://mm.finance/add",
  [ChainId.BRISE]: "https://app.icecreamswap.com/#/add",

  externals: {
    [ChainId.BSC_MAINNET]: {
      apeswap: "https://apeswap.finance/add",
    },
  },
};

export const INFO_URLS = {
  [ChainId.ETHEREUM]: {
    token: "https://v2.info.uniswap.org/token",
    pool: "https://v2.info.uniswap.org/pair",
  },
  [ChainId.GOERLI]: {
    token: "https://v2.info.uniswap.org/token",
    pool: "https://v2.info.uniswap.org/pair",
  },
  [ChainId.BSC_MAINNET]: {
    token: "https://pancakeswap.finance/info/tokens",
    pool: "https://pancakeswap.finance/info/pools",
  },
  [ChainId.BSC_TESTNET]: {
    token: "https://pancakeswap.finance/info/tokens",
    pool: "https://pancakeswap.finance/info/pools",
  },
  [ChainId.POLYGON]: {
    token: "https://info.quickswap.exchange/#/token",
    pool: "https://info.quickswap.exchange/#/pair",
  },
  [ChainId.FANTOM]: {
    token: "https://info.spookyswap.finance/tokens",
    pool: "https://info.spookyswap.finance/pairs",
  },
  [ChainId.AVALANCHE]: {
    token: "https://dexscreener.com/avalanche",
    pool: "https://dexscreener.com/avalanche",
  },
  [ChainId.CRONOS]: {
    token: "https://dexscreener.com/cronos",
    pool: "https://dexscreener.com/cronos",
  },
  [ChainId.BRISE]: {
    token: "https://info.icecreamswap.com/token",
    pool: "https://info.icecreamswap.com/pair",
  },

  externals: {
    [ChainId.ETHEREUM]: {
      sushiswap: {
        token: "https://app.sushi.com/analytics/tokens",
        pool: "https://app.sushi.com/analytics/pools",
      },
    },
    [ChainId.BSC_MAINNET]: {
      pancakeswap: {
        token: "https://pancakeswap.finance/info/tokens",
        pool: "https://pancakeswap.finance/info/pools",
      },
      apeswap: {
        token: "https://info.apeswap.finance/token",
        pool: "https://info.apeswap.finance/pair",
      },
    },
  },
};

export const BLOCK_TIMES = {
  [ChainId.ETHEREUM]: 13.25,
  [ChainId.GOERLI]: 13.25,
  [ChainId.BSC_MAINNET]: 3,
  [ChainId.BSC_TESTNET]: 3,
  [ChainId.POLYGON]: 2.3,
  [ChainId.FANTOM]: 1, //  will be used as per second in fantom
  [ChainId.AVALANCHE]: 3,
  [ChainId.CRONOS]: 6,
  [ChainId.BRISE]: 15,
};

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]?: Currency[];
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    tokens[ChainId.ETHEREUM].weth,
    // tokens[ChainId.ETHEREUM].usdt,
  ],
  [ChainId.BSC_MAINNET]: [
    tokens[ChainId.BSC_MAINNET].wbnb,
    tokens[ChainId.BSC_MAINNET].brews,
    tokens[ChainId.BSC_MAINNET].busd,
    tokens[ChainId.BSC_MAINNET].usdt,
    tokens[ChainId.BSC_MAINNET].btcb,
    tokens[ChainId.BSC_MAINNET].ust,
    tokens[ChainId.BSC_MAINNET].eth,
    tokens[ChainId.BSC_MAINNET].usdc,
  ],
  [ChainId.BSC_TESTNET]: [
    tokens[ChainId.BSC_TESTNET].wbnb,
    tokens[ChainId.BSC_TESTNET].busd,
    tokens[ChainId.BSC_TESTNET].tokenA,
  ],
  [ChainId.POLYGON]: [tokens[ChainId.POLYGON].wmatic, tokens[ChainId.POLYGON].usdc],
  [ChainId.FANTOM]: [tokens[ChainId.FANTOM].wftm, tokens[ChainId.FANTOM].eth, tokens[ChainId.FANTOM].usdc],
  [ChainId.AVALANCHE]: [tokens[ChainId.AVALANCHE].wavax, tokens[ChainId.AVALANCHE].usdc],
  [ChainId.CRONOS]: [tokens[ChainId.CRONOS].wcro, tokens[ChainId.CRONOS].usdc],
  [ChainId.BRISE]: [tokens[ChainId.BRISE].wbrise, tokens[ChainId.BRISE].usdt, tokens[ChainId.BRISE].usdc],
};

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.ETHEREUM]: {},
  [ChainId.BSC_MAINNET]: {},
  [ChainId.POLYGON]: {},
  [ChainId.FANTOM]: {},
  [ChainId.AVALANCHE]: {},
  [ChainId.CRONOS]: {},
  [ChainId.BRISE]: {},
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.BSC_MAINNET]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.ETHEREUM]: {},
  [ChainId.BSC_MAINNET]: {},
  [ChainId.POLYGON]: {},
  [ChainId.FANTOM]: {},
  [ChainId.AVALANCHE]: {},
  [ChainId.CRONOS]: {},
  [ChainId.BRISE]: {},
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [tokens[ChainId.ETHEREUM].weth, tokens[ChainId.ETHEREUM].usdt],
  [ChainId.BSC_MAINNET]: [
    tokens[ChainId.BSC_MAINNET].wbnb,
    tokens[ChainId.BSC_MAINNET].brews,
    tokens[ChainId.BSC_MAINNET].dai,
    tokens[ChainId.BSC_MAINNET].busd,
    tokens[ChainId.BSC_MAINNET].usdt,
  ],
  [ChainId.BSC_TESTNET]: [tokens[ChainId.BSC_TESTNET].wbnb, tokens[ChainId.BSC_TESTNET].busd],
  [ChainId.POLYGON]: [tokens[ChainId.POLYGON].wmatic, tokens[ChainId.POLYGON].usdc],
  [ChainId.FANTOM]: [tokens[ChainId.FANTOM].wftm, tokens[ChainId.FANTOM].usdc],
  [ChainId.AVALANCHE]: [tokens[ChainId.AVALANCHE].wavax, tokens[ChainId.AVALANCHE].usdc],
  [ChainId.CRONOS]: [tokens[ChainId.CRONOS].wcro, tokens[ChainId.CRONOS].usdc],
  [ChainId.BRISE]: [tokens[ChainId.BRISE].wbrise, tokens[ChainId.BRISE].usdt, tokens[ChainId.BRISE].usdc],
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BSC_MAINNET]: [
    [tokens[ChainId.BSC_MAINNET].brews, tokens[ChainId.BSC_MAINNET].wbnb],
    [tokens[ChainId.BSC_MAINNET].busd, tokens[ChainId.BSC_MAINNET].usdt],
    [tokens[ChainId.BSC_MAINNET].dai, tokens[ChainId.BSC_MAINNET].usdt],
  ],
};

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export const SECONDS_PER_YEAR = 365 * 86400; // 10512000

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);
export const DEFAULT_GAS_LIMIT = 200000;

export const BLOCKS_PER_DAY = {
  [ChainId.ETHEREUM]: 6426,
  [ChainId.BSC_MAINNET]: 28800,
  [ChainId.POLYGON]: 40000,
};

export const BANANA_PER_BLOCK = new BigNumber(10);
export const BLOCKS_PER_YEAR = new BigNumber(10512000);
export const BANANA_PER_YEAR = BANANA_PER_BLOCK.times(BLOCKS_PER_YEAR);

export const DEFAULT_CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || "56", 10);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.02
export const MIN_BNB: JSBI = JSBI.multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)), JSBI.BigInt(2)); // .02 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000));

export const ZERO_PERCENT = new Percent("0");
export const ONE_HUNDRED_PERCENT = new Percent("1");

export const slippageWithTVL = 200;
export const slippageDefault = 5000;

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const FREEZER_CHAINS = {
  1: "ethereum",
  56: "smartchain",
};

export const LIVECOIN_APIS = [
  "82fc55c0-9833-4d12-82bb-48ae9748bead",
  "10760947-8c9a-4a18-b20f-2be694baf496",
  "4853da0a-f79f-4714-a915-d683b8168e1e",
  "4f616412-ca6d-4876-9a94-dac14e142b12",
];

export const TOKENLIST_URI = {
  1: "https://tokens.coingecko.com/ethereum/all.json",
  56: "https://tokens.coingecko.com/binance-smart-chain/all.json",
  137: "https://tokens.coingecko.com/polygon-pos/all.json",
  250: "https://tokens.coingecko.com/fantom/all.json",
  43114: "https://tokens.coingecko.com/avalanche/all.json",
  42161: "https://tokens.coingecko.com/arbitrum-one/all.json",
  25: "https://tokens.coingecko.com/cronos/all.json",
};

export const CHART_PERIOD_RESOLUTION = {
  0: {
    period: 86400,
    resolution: 10,
  },
  1: {
    period: 86400 * 7,
    resolution: 60,
  },
  2: {
    period: 86400 * 30,
    resolution: 240,
  },
  3: {
    period: 86400 * 365,
    resolution: 1440,
  },
  4: {
    period: 86400 * 10000,
    resolution: 1440,
  },
};

export const DEX_GURU_WETH_ADDR = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
