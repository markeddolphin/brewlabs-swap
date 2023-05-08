import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { WalletConfig } from "config/constants/types";
import { createWallets } from "config/constants/wallets";
import { useActiveChainId } from "hooks/useActiveChainId";
import { setGlobalState } from "state";

interface WalletSelectorProps {
  onDismiss?: () => void;
}

function WalletSelector({ onDismiss }: WalletSelectorProps) {
  const { connectAsync, connect, connectors, isLoading, error, pendingConnector } = useConnect();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const { chainId } = useActiveChainId();

  const [errorMsg, setErrorMsg] = useState("");
  const wallets = useMemo(() => createWallets(chainId, connectAsync), [chainId, connectAsync]);

  const walletsToShow: WalletConfig[] = wallets.filter((w) => {
    return w.installed !== false || w.deepLink;
  });

  useEffect(() => {
    if (isConnected && onDismiss) {
      setGlobalState("sessionChainId", chain?.unsupported ? chainId : chain?.id);
      onDismiss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, chain, chainId]);

  useEffect(() => {
    if (error) {
      setErrorMsg(error?.message ?? "");
    } else setErrorMsg("");
  }, [error]);

  return (
    <div className="p-4 font-brand">
      <h5 className="mb-2 text-2xl dark:text-slate-400">Connect Wallet</h5>
      <p className="dark:text-gray-500">Connect your wallet to interact</p>
      {errorMsg && (
        <div className="relative mt-2 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
          <strong className="font-bold">{errorMsg}</strong>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMsg("")}>
            <svg
              className="h-6 w-6 fill-current text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
      <ul role="list" className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
        {walletsToShow.map((wallet) => (
          <li key={wallet.id}>
            <button
              disabled={isLoading}
              onClick={() => {
                const selectedConnector = connectors.find((c) => c.id === wallet.connectorId);
                connect({ connector: selectedConnector });
              }}
              className="flex w-full items-center py-4 hover:bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
            >
              <img className="h-10 w-10 rounded-full" src={wallet.icon} alt="" />
              <div className="ml-4 flex-col text-left">
                <p className="text-sm font-medium text-gray-900">{wallet.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-500">{wallet.description}</p>
              </div>
              <div className="ml-auto">
                {isLoading && wallet.connectorId === pendingConnector?.id && (
                  <div role="status">
                    <svg
                      className="fill-yellow-500 mr-2 inline h-8 w-8 animate-spin text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WalletSelector;
