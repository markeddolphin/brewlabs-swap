import React from "react";
import { ChainId } from "@brewlabs/sdk";
import { Dialog } from "@headlessui/react";
import { AnimatePresence } from "framer-motion";
import { useNetwork } from "wagmi";

import { getExplorerLink } from "lib/bridge/helpers";
import { truncateHash } from "utils";

type LoadingModalProps = {
  loadingText?: string;
  txHash?: string;
  chainId?: ChainId;
};
const LoadingModal = ({ loadingText, txHash, chainId }: LoadingModalProps) => {
  const { chain } = useNetwork();

  if (!loadingText) return <></>;

  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog open className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0 overflow-y-auto bg-gray-300 bg-opacity-90 dark:bg-zinc-900 dark:bg-opacity-80">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative max-w-[500px] sm:w-7/12 md:w-2/6 md:min-w-[400px]">
              <Dialog.Panel>
                <div className="m-2 overflow-hidden rounded-full border-2 border-amber-300 bg-white dark:bg-zinc-900">
                  <div className="p-2 px-2 font-brand">
                    {loadingText ? (
                      <div>
                        <p className="text-2xl dark:text-slate-400">{`${loadingText}...`}</p>
                        <p className="text-sm">
                          {"Monitor at explorer "}
                          <a
                            href={getExplorerLink((chainId || chain?.id)!, "transaction", txHash!)}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="underline outline-none"
                          >
                            {truncateHash(txHash!)}
                          </a>
                        </p>
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

export default LoadingModal;
