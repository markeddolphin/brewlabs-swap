import React, { useEffect, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { AnimatePresence } from "framer-motion";
import { useNetwork } from "wagmi";

import { useBridgeContext } from "contexts/BridgeContext";
import { useBridgeDirection } from "hooks/bridge/useBridgeDirection";
import { useTransactionStatus } from "hooks/bridge/useTransactionStatus";
import { getExplorerLink } from "lib/bridge/helpers";
import { truncateHash } from "utils";

import { ProgressRing } from "./ProgressRing";
import ClaimTransferModal from "./ClaimTransferModal";
import ClaimTokensModal from "./ClaimTokensModal";
import NeedsConfirmationModal from "./NeedsConfirmationModal";

type BridgeLoaderProps = {
  loading: boolean;
  loadingText?: string;
  txHash?: string;
  confirmations: number;
  totalConfirms: number;
  chainId?: ChainId;
};

export const BridgeLoader = ({
  loading,
  loadingText,
  txHash,
  confirmations,
  totalConfirms,
  chainId,
}: BridgeLoaderProps) => {
  const showConfirmations = confirmations < totalConfirms;
  const displayConfirms = showConfirmations ? confirmations : totalConfirms;

  if (!loadingText) return <></>;

  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog open={loading ?? false} className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0 overflow-y-auto bg-gray-300 bg-opacity-90 dark:bg-zinc-900 dark:bg-opacity-80">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative max-w-[500px] sm:w-7/12 md:w-2/6 md:min-w-[400px]">
              <Dialog.Panel>
                <div className="m-2 overflow-hidden rounded-full border-2 border-amber-300 bg-white dark:bg-zinc-900">
                  <div className="p-2 px-4 font-brand">
                    {loadingText ? (
                      <div className="flex items-center p-1">
                        {showConfirmations ? (
                          <div className="flex items-center">
                            <ProgressRing
                              radius={33.5}
                              stroke={6}
                              progress={displayConfirms}
                              totalProgress={totalConfirms}
                            />
                            <span className="absolute ml-4 text-2xl dark:text-gray-500">
                              {displayConfirms}/{totalConfirms}
                            </span>
                          </div>
                        ) : (
                          <>
                            <ProgressRing
                              radius={33.5}
                              stroke={6}
                              progress={totalConfirms}
                              totalProgress={totalConfirms}
                            />
                            <CheckIcon className="absolute ml-4 text-green-500" width={35} />
                          </>
                        )}
                        <div className="ml-3 text-left">
                          <p className="text-xl font-medium  text-gray-900">
                            {`${loadingText || "Waiting for Block Confirmations"}...`}
                          </p>
                          <p className="text-sm">
                            {"Monitor at explorer "}
                            <a
                              href={getExplorerLink(chainId!, "transaction", txHash!)}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="underline outline-none"
                            >
                              {truncateHash(txHash!)}
                            </a>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-2xl dark:text-slate-400">Loading...</p>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
};

const BridgeLoadingModal = () => {
  const { chain } = useNetwork();
  const { homeChainId, foreignChainId, getTotalConfirms } = useBridgeDirection();
  const { fromToken, loading, txHash } = useBridgeContext();

  const [message, setMessage] = useState<any>();

  const totalConfirms = getTotalConfirms(chain?.id!);
  const { loadingText, needsConfirmation, setNeedsConfirmation, confirmations } = useTransactionStatus(setMessage);

  useEffect(() => {
    if (chain?.id === homeChainId) {
      setMessage(undefined);
    }
  }, [chain, homeChainId]);

  const txNeedsClaiming = !!message && !!txHash && !loading && chain?.id === foreignChainId;

  const claimTransfer = () =>
    txNeedsClaiming ? <ClaimTransferModal message={message} setMessage={setMessage} /> : null;

  const claimAllTokens = () => (txNeedsClaiming || loading || needsConfirmation ? null : <ClaimTokensModal />);

  const loader = () =>
    needsConfirmation ? (
      <NeedsConfirmationModal setNeedsConfirmation={setNeedsConfirmation} setMessage={setMessage} />
    ) : (
      <BridgeLoader
        loadingText={loadingText}
        loading={loading || !fromToken}
        confirmations={confirmations}
        totalConfirms={totalConfirms}
        chainId={chain?.id}
        txHash={txHash}
      />
    );

  return (
    <>
      {claimTransfer()}
      {claimAllTokens()}
      {loader()}
    </>
  );
};

export default BridgeLoadingModal;
