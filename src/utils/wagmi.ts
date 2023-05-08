import { configureChains, createClient } from "wagmi";
import memoize from "lodash/memoize";

import { SafeConnector } from "@gnosis.pm/safe-apps-wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { mainnet, BinanceWalletConnector } from "../contexts/wagmi";
import { SupportedChains } from "config/constants/networks";

export const { provider, webSocketProvider, chains } = configureChains(SupportedChains, [
  jsonRpcProvider({
    rpc: (chain) => {
      switch (chain.id) {
        case mainnet.id:
          return { http: "https://cloudflare-eth.com" };
        default:
          return { http: chain.rpcUrls.default };
      }
    },
  }),
]);

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    // shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
});

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: "Brewlabs Earn",
    appLogoUrl: "https://bridge.brewlabs.info/logo.png",
  },
});

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
});

export const walletConnectNoQrCodeConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: false,
  },
});

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    // shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
});

export const bscConnector = new BinanceWalletConnector({ chains });

export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new SafeConnector({ chains }),
    metaMaskConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    bscConnector,
  ],
});

export const CHAIN_IDS = chains.map((c) => c.id);

export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId));
export const isChainTestnet = memoize((chainId: number) => chains.find((c) => c.id === chainId)?.testnet);
