import { ChainId } from "@brewlabs/sdk";
import { bsc, mainnet, arbitrum, polygon, avalanche, fantom, cronos, brise, bscTestnet, goerli } from "contexts/wagmi";

export const SupportedChains = [bsc, mainnet, arbitrum, polygon, avalanche, fantom, cronos, brise, bscTestnet, goerli];

export const SUPPORTED_CHAIN_IDS = SupportedChains.map((chain) => chain.id);
export const PAGE_SUPPORTED_CHAINS: { [key: string]: ChainId[] } = {
  farms: [
    ChainId.ETHEREUM,
    ChainId.BSC_MAINNET,
    ChainId.POLYGON,
    ChainId.FANTOM,
    ChainId.AVALANCHE,
    ChainId.CRONOS,
    ChainId.BRISE,
  ],
  staking: [
    ChainId.ETHEREUM,
    ChainId.BSC_MAINNET,
    ChainId.POLYGON,
    ChainId.FANTOM,
    ChainId.AVALANCHE,
    ChainId.CRONOS,
    ChainId.BRISE,
  ],
  indexes: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  deployer: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  swap: [ChainId.ETHEREUM, ChainId.BSC_MAINNET, ChainId.ARBITRUM, ChainId.POLYGON, ChainId.FANTOM],
  add: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  remove: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  constructor: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  zapper: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  bridge: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  nft: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  tradingPairs: [ChainId.ETHEREUM, ChainId.BSC_MAINNET, ChainId.ARBITRUM, ChainId.POLYGON, ChainId.FANTOM],
  "": [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
};

export const CHAIN_KEYS = {
  [ChainId.ETHEREUM]: "ethereum",
  [ChainId.ARBITRUM]: "arbitrum",
  [ChainId.GOERLI]: "goerli",
  [ChainId.BSC_MAINNET]: "smartchain",
  [ChainId.BSC_TESTNET]: "chapel",
  [ChainId.POLYGON]: "polygon",
  [ChainId.FANTOM]: "fantom",
  [ChainId.AVALANCHE]: "avalanchec",
  [ChainId.CRONOS]: "cronos",
  [ChainId.BRISE]: "brise",
};

export const EXPLORER_NAMES = {
  [ChainId.ETHEREUM]: "Etherscan",
  [ChainId.ARBITRUM]: "Arbiscan",
  [ChainId.GOERLI]: "Etherscan",
  [ChainId.BSC_MAINNET]: "BscScan",
  [ChainId.BSC_TESTNET]: "BscScan",
  [ChainId.POLYGON]: "Polygonscan",
  [ChainId.FANTOM]: "FTMScan",
  [ChainId.AVALANCHE]: "Snowtrace",
  [ChainId.CRONOS]: "CronoScan",
  [ChainId.BRISE]: "BriseScan",
};

export const EXPLORER_URLS = {
  [ChainId.ETHEREUM]: "https://etherscan.io",
  [ChainId.ARBITRUM]: "https://arbiscan.io",
  [ChainId.BSC_MAINNET]: "https://bscscan.com",
  [ChainId.POLYGON]: "https://polygonscan.com",
  [ChainId.FANTOM]: "https://ftmscan.com",
};

export const EXPLORER_API_URLS = {
  [ChainId.ETHEREUM]: "https://api.etherscan.io/api",
  [ChainId.BSC_MAINNET]: "https://api.bscscan.com/api",
  [ChainId.BSC_TESTNET]: "https://api.bscscan.com/api",
  [ChainId.POLYGON]: "https://api.polygonscan.com/api",
  [ChainId.FANTOM]: "https://api.ftmscan.com/api",
};

export const EXPLORER_API_KEYS = {
  [ChainId.ETHEREUM]: "47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX",
  [ChainId.BSC_MAINNET]: "HQ1F33DXXJGEF74NKMDNI7P8ASS4BHIJND",
  [ChainId.BSC_TESTNET]: "HQ1F33DXXJGEF74NKMDNI7P8ASS4BHIJND",
  [ChainId.POLYGON]: "F2KCC1VEPQC23GBVKATATP1V3ZQIC31D7Z",
  [ChainId.FANTOM]: "BFCVDJ6EW9GQHGNDEUMDSM3HU6KACMWPPC",
};

export const CHAIN_LABLES = {
  [ChainId.ETHEREUM]: "Ethereum",
  [ChainId.ARBITRUM]: "Arbitrum",
  [ChainId.BSC_MAINNET]: "BNB Smart Chain",
  [ChainId.POLYGON]: "Polygon Chain",
  [ChainId.FANTOM]: "Fantom Chain",
  [ChainId.AVALANCHE]: "Avalanche",
  [ChainId.CRONOS]: "Cronos Chain",
  [ChainId.BRISE]: "Brise Chain",

  [ChainId.GOERLI]: "Goerli",
  [ChainId.BSC_TESTNET]: "BSC Testnet",
};

export const CHAIN_ICONS = {
  [ChainId.ETHEREUM]: "/images/networks/eth.svg",
  [ChainId.ARBITRUM]: "/images/networks/arbitrum.svg",
  [ChainId.BSC_MAINNET]: "/images/networks/bsc.png",
  [ChainId.POLYGON]: "/images/networks/polygon.png",
  [ChainId.FANTOM]: "/images/networks/ftm.svg",
  [ChainId.AVALANCHE]: "/images/networks/avalanche.svg",
  [ChainId.CRONOS]: "/images/networks/cronos.png",
  [ChainId.BRISE]: "/images/networks/bitgert.png",

  [ChainId.GOERLI]: "/images/networks/eth.svg",
  [ChainId.BSC_TESTNET]: "/images/networks/bsc.png",
};

export const EXPLORER_LOGO = {
  [ChainId.ETHEREUM]: "/images/explorer/etherscan.png",
  [ChainId.ARBITRUM]: "/images/explorer/arbiscan.png",
  [ChainId.BSC_MAINNET]: "/images/explorer/bscscan.png",
  [ChainId.POLYGON]: "/images/networks/polygonscan.png",
  [ChainId.FANTOM]: "/images/networks/ftmscan.png",
  [ChainId.AVALANCHE]: "/images/networks/snowtrace.png",
  [ChainId.CRONOS]: "/images/networks/cronoscan.png",
  [ChainId.BRISE]: "/images/networks/brisescan.png",

  [ChainId.GOERLI]: "/images/explorer/etherscan.png",
  [ChainId.BSC_TESTNET]: "/images/explorer/bscscan.png",
};

export const NetworkOptions = SUPPORTED_CHAIN_IDS.map((chainId: ChainId) => ({
  id: chainId,
  name: CHAIN_LABLES[chainId],
  image: CHAIN_ICONS[chainId],
}));

export const MORALIS_CHAIN_NAME = {
  [ChainId.ETHEREUM]: "mainnet",
  [ChainId.ARBITRUM]: "arbitrum",
  [ChainId.BSC_MAINNET]: "bsc",
  [ChainId.POLYGON]: "polygon",
};

export const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.BSC_MAINNET,
  ChainId.POLYGON,
  ChainId.FANTOM,
  ChainId.AVALANCHE,
  ChainId.CRONOS,
];

export const NETWORKS = {
  [ChainId.ETHEREUM]: {
    chainId: `0x${Number(ChainId.ETHEREUM).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://api.nodes-brewlabs.info/rpc/eth"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  [ChainId.ARBITRUM]: {
    chainId: `0x${Number(ChainId.ARBITRUM).toString(16)}`,
    chainName: "Arbitrum One Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  [ChainId.BSC_MAINNET]: {
    chainId: `0x${Number(ChainId.BSC_MAINNET).toString(16)}`,
    chainName: "BNB Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed.binance.org",
    ],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  [ChainId.BSC_TESTNET]: {
    chainId: `0x${Number(ChainId.BSC_MAINNET).toString(16)}`,
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
  [ChainId.POLYGON]: {
    chainId: `0x${Number(ChainId.POLYGON).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  [ChainId.FANTOM]: {
    chainId: `0x${Number(ChainId.FANTOM).toString(16)}`,
    chainName: "Fantom Opera Mainnet",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ftm.tools/"],
    blockExplorerUrls: ["https://ftmscan.com"],
  },
  [ChainId.AVALANCHE]: {
    chainId: `0x${Number(ChainId.AVALANCHE).toString(16)}`,
    chainName: "Avalanche C-Chain",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
  },
  [ChainId.CRONOS]: {
    chainId: `0x${Number(ChainId.CRONOS).toString(16)}`,
    chainName: "Cronos Mainnet",
    nativeCurrency: {
      name: "Cronos",
      symbol: "CRO",
      decimals: 18,
    },
    rpcUrls: ["https://evm.cronos.org"],
    blockExplorerUrls: ["https://cronoscan.com"],
  },
};
