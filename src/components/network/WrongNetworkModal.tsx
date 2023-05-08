import React, { useEffect } from "react";
import { ChainId } from "@brewlabs/sdk";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { useNetwork } from "wagmi";

import { NetworkOptions } from "config/constants/networks";
import { NetworkConfig } from "config/constants/types";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";

import Modal from "components/Modal";
import Button from "components/Button";

type WrongNetworkModalProps = {
  open: boolean;
  currentChain?: NetworkConfig;
};

const WrongNetworkModal = ({ open, currentChain }: WrongNetworkModalProps) => {
  const { canSwitch, switchNetwork, isLoading, error } = useSwitchNetwork();
  const { chain } = useNetwork();

  useEffect(() => {
    if (error) {
      toast.error(error?.message ?? "");
    }
  }, [error]);

  return (
    <Modal open={open} onClose={() => {}}>
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div
            className="-mr-6 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('${
                NetworkOptions.find((n) => n.id === chain?.id)?.image ?? "/images/networks/unkown.png"
              }')`,
            }}
          />

          <ArrowRightCircleIcon className="z-10 h-6 w-6 overflow-hidden rounded-full bg-white text-gray-900" />

          <div
            className="-ml-6 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('${currentChain?.image ?? "/images/networks/unkown.png"}')`,
            }}
          />
        </div>

        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-xl font-medium leading-6 text-gray-900">You are in wrong network</h3>
          <div className="mx-auto my-3 max-w-sm">
            <p className="text-sm text-gray-500">
              This page is located for <span className="font-bolder text-brand">{currentChain?.name}.</span>
            </p>
            <p className="text-sm text-gray-500">
              You are on <span className="font-bolder text-brand">{chain?.name ?? ""}</span> now, please switch the
              network to continue.
            </p>
          </div>
        </div>

        <div className="mt-5 text-center sm:mt-6 sm:grid">
          <div className="flex justify-center">
            {canSwitch ? (
              <Button disabled={isLoading} onClick={() => switchNetwork(currentChain?.id || ChainId.BSC_MAINNET)}>
                <div>Switch to {currentChain?.name}</div>
                <div className="ml-2">
                  {isLoading && (
                    <div role="status">
                      <svg
                        className="mr-2 inline h-5 w-5 animate-spin fill-yellow-500 text-gray-200 dark:text-gray-600"
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
              </Button>
            ) : (
              <div
                className="relative mt-2 rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-red-600"
                role="alert"
              >
                <strong className="font-bold">Unable to switch network. Please try it on your wallet</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WrongNetworkModal;
