import type { ExtendEthereum } from "global";
import { isFirefox } from "react-device-detect";
import { metaMaskConnector, walletConnectNoQrCodeConnector } from "utils/wagmi";
import { WalletConfig } from "./types";

export class WalletConnectorNotFoundError extends Error {}
export class WalletSwitchChainError extends Error {}

export enum ConnectorNames {
  MetaMask = "metaMask",
  Injected = "injected",
  WalletConnect = "walletConnect",
  BSC = "bsc",
  Blocto = "blocto",
  WalletLink = "coinbaseWallet",
}
const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const createQrCode = (chainId: number, connect: any) => async () => {
  connect({ connector: walletConnectNoQrCodeConnector, chainId });

  // wait for WalletConnect to setup in order to get the uri
  await delay(100);
  const { uri } = (await walletConnectNoQrCodeConnector.getProvider()).connector;

  return uri;
};

const walletsConfig = ({
  chainId,
  connect,
}: {
  chainId: number;
  connect: (connectorID: ConnectorNames) => void;
}): WalletConfig<ConnectorNames>[] => {
  const qrCode = createQrCode(chainId, connect);
  return [
    {
      id: "metamask",
      title: "Metamask",
      description: "Connect to your MetaMask Wallet",
      icon: "/images/wallets/metamask.png",
      installed: typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask) && metaMaskConnector.ready,
      connectorId: ConnectorNames.MetaMask,
      deepLink: "https://metamask.app.link/dapp/bridge.brewlabs.info/",
      qrCode,
      downloadLink: "https://metamask.app.link/dapp/bridge.brewlabs.info/",
    },
    {
      id: "binance",
      title: "Binance Wallet",
      description: "Connect to your Binance Wallet",
      icon: "/images/wallets/binance.png",
      installed: typeof window !== "undefined" && Boolean(window.BinanceChain),
      connectorId: ConnectorNames.BSC,
      guide: {
        desktop: "https://www.bnbchain.org/en/binance-wallet",
      },
      downloadLink: {
        desktop: isFirefox
          ? "https://addons.mozilla.org/en-US/firefox/addon/binance-chain/?src=search"
          : "https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp",
      },
    },
    {
      id: "coinbase",
      title: "Coinbase Wallet",
      description: "Connect to your Coinbase Wallet",
      icon: "/images/wallets/coinbase.png",
      connectorId: ConnectorNames.WalletLink,
    },
    {
      id: "trust",
      title: "Trust Wallet",
      description: "Connect to your Trust Wallet",
      icon: "/images/wallets/trust.png",
      connectorId: ConnectorNames.Injected,
      installed:
        typeof window !== "undefined" &&
        !(window.ethereum as ExtendEthereum)?.isSafePal && // SafePal has isTrust flag
        (Boolean(window.ethereum?.isTrust) ||
          // @ts-ignore
          Boolean(window.ethereum?.isTrustWallet)),
      deepLink: "https://link.trustwallet.com/open_url?coin_id=20000714&url=https://bridge.brewlabs.info/",
      downloadLink: {
        desktop: "https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/related",
      },
      qrCode,
    },
    {
      id: "walletconnect",
      title: "WalletConnect",
      description: "Scan with WalletConnect to connect",
      icon: "/images/wallets/walletconnect.png",
      connectorId: ConnectorNames.WalletConnect,
    },
  ];
};

export const createWallets = (chainId: number, connect: any) => {
  return walletsConfig({ chainId, connect });
};
