import { Chain } from "wagmi";
import { bsc as bscMainnet } from "wagmi/chains";
export { mainnet, arbitrum, polygon, avalanche, fantom, cronos, bscTestnet, goerli } from "wagmi/chains";

export const brise: Chain = {
  id: 32520,
  name: "Brise Chain Mainnet",
  network: "cronos",
  nativeCurrency: { name: "Brise", symbol: "BRISE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet-rpc.brisescan.com/"] },
    public: { http: ["https://mainnet-rpc.brisescan.com/"] },
  },
  blockExplorers: {
    default: {
      name: "Bitgert",
      url: "https://brisescan.com",
    },
  },
};

export const bsc = {
  ...bscMainnet,
  rpcUrls: {
    default: {
      http: [
        "https://bsc-dataseed1.defibit.io",
        "https://bsc-dataseed1.ninicoin.io",
        "https://bsc-dataseed.binance.org",
      ],
    },
    public: {
      http: [
        "https://bsc-dataseed1.defibit.io",
        "https://bsc-dataseed1.ninicoin.io",
        "https://bsc-dataseed.binance.org",
      ],
    },
  },
};
