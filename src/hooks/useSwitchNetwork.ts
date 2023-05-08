/* eslint-disable consistent-return */
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAccount, useSwitchNetwork as useSwitchNetworkWallet } from "wagmi";

import { ConnectorNames } from "config/constants/wallets";
import replaceBrowserHistory from "utils/replaceBrowserHistory";
import { setGlobalState } from "state";

export function useSwitchNetworkLocal() {
  const { query } = useRouter();

  return useCallback((chainId: number) => {
    if (+(query?.chainId ?? 0) === chainId) return;
    setGlobalState("sessionChainId", chainId);
    replaceBrowserHistory("chainId", chainId);
    window.location.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useSwitchNetwork() {
  const [loading, setLoading] = useState(false);
  const {
    switchNetworkAsync: _switchNetworkAsync,
    isLoading: _isLoading,
    switchNetwork: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchNetworkWallet();

  const { isConnected, connector } = useAccount();

  const switchNetworkLocal = useSwitchNetworkLocal();
  const isLoading = _isLoading || loading;

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (isConnected && typeof _switchNetworkAsync === "function") {
        if (isLoading) return;
        setLoading(true);
        return _switchNetworkAsync(chainId)
          .then((c) => {
            // well token pocket
            if (window.ethereum?.isTokenPocket === true) {
              switchNetworkLocal(chainId);
              window.location.reload();
            }
            return c;
          })
          .catch(() => {
            // TODO: review the error
            toast.error("Error connecting, please retry and confirm in wallet!");
          })
          .finally(() => setLoading(false));
      }
      return new Promise(() => {
        switchNetworkLocal(chainId);
      });
    },
    [isConnected, _switchNetworkAsync, isLoading, setLoading, switchNetworkLocal]
  );

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected && typeof _switchNetwork === "function") {
        return _switchNetwork(chainId);
      }
      return switchNetworkLocal(chainId);
    },
    [_switchNetwork, isConnected, switchNetworkLocal]
  );

  const canSwitch = useMemo(
    () =>
      isConnected
        ? !!_switchNetworkAsync &&
          connector?.id !== ConnectorNames.WalletConnect &&
          !(
            typeof window !== "undefined" &&
            // @ts-ignore // TODO: add type later
            (window.ethereum?.isSafePal || window.ethereum?.isMathWallet)
          )
        : true,
    [_switchNetworkAsync, isConnected, connector]
  );

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  };
}
