import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useProvider } from "wagmi";

import Button from "components/Button";
import Modal from "components/Modal";
import { useBridgeContext } from "contexts/BridgeContext";
import { useBridgeDirection } from "hooks/bridge/useBridgeDirection";
import { useClaim } from "hooks/bridge/useClaim";
import { isRevertedError, TOKENS_CLAIMED } from "lib/bridge/amb";
import { getNativeSybmol, getNetworkLabel, handleWalletError } from "lib/bridge/helpers";
import { messageCallStatus } from "lib/bridge/message";
import LoadingModal from "./LoadingModal";

type ClaimTransferModalProps = {
  message: any;
  setMessage: React.Dispatch<React.SetStateAction<any>>;
};
const ClaimTransferModal = ({ message, setMessage }: ClaimTransferModalProps) => {
  const ethersProvider = useProvider();
  const { homeChainId, foreignChainId, foreignAmbAddress } = useBridgeDirection();
  const { txHash, setTxHash } = useBridgeContext();

  const [isOpen, setOpen] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [executed, setExecuted] = useState(false);

  const onClose = useCallback(() => {
    setTxHash(undefined);
    setMessage(undefined);
    setOpen(false);
  }, [setTxHash, setMessage]);

  const showError = useCallback((errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  }, []);

  useEffect(() => {
    if (message && message.messageId) {
      const { messageId } = message;
      messageCallStatus(foreignAmbAddress, ethersProvider, messageId).then((status) => {
        if (status) {
          setExecuted(true);
        }
      });
    }
  }, [message, foreignAmbAddress, ethersProvider]);

  const { claim, executing, executionTx } = useClaim();

  const claimTokens = useCallback(async () => {
    try {
      setClaiming(true);
      await claim(txHash!, message);
    } catch (claimError: any) {
      console.error({ claimError });
      if (claimError.message === TOKENS_CLAIMED || isRevertedError(claimError)) {
        setExecuted(true);
      } else {
        handleWalletError(claimError, showError, getNativeSybmol(foreignChainId));
      }
    } finally {
      setClaiming(false);
    }
  }, [claim, showError, foreignChainId, txHash, message]);

  useEffect(() => {
    if (!executing && !claiming && executionTx) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executing, claiming, executionTx]);

  if (claiming || executing)
    return <LoadingModal loadingText="Waiting for Execution" chainId={homeChainId} txHash={txHash} />;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="p-4 font-brand">
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Claim Your Tokens</h3>
          <div className="mx-auto mt-2 max-w-sm">
            <p className="text-sm text-gray-500">
              {`The claim process may take a variable period of time on ${getNetworkLabel(foreignChainId)}${" "}
                    depending on network congestion. Your token balance will increase to reflect${" "}
                    the completed transfer after the claim is processed`}
            </p>
          </div>

          {executed && (
            <div
              className="border-danger-400 bg-danger-100 relative mt-2 rounded border px-4 py-3 text-red-700"
              role="alert"
            >
              <strong className="font-bold">
                The tokens were already claimed. Check your token balance in{" "}
                <strong>{getNetworkLabel(foreignChainId)}</strong>.
              </strong>
            </div>
          )}
        </div>
        <div className="mt-3 text-center">
          <Button onClick={onClose}>Cancel</Button>

          <Button onClick={claimTokens} disabled={claiming || executing || executed}>
            <div className="flex items-center">
              <div className="mr-2">{claiming ? `Claiming` : `Claim`}</div>
              {claiming && (
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
        </div>
      </div>
    </Modal>
  );
};

export default ClaimTransferModal;
