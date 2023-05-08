import { ChainId } from "@brewlabs/sdk";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useSigner } from "wagmi";

import { useBridgeDirection } from "hooks/bridge/useBridgeDirection";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { executeSignatures, TOKENS_CLAIMED } from "lib/bridge/amb";
import { getNetworkLabel, handleWalletError } from "lib/bridge/helpers";
import { getMessage, getRemainingSignatures, messageCallStatus } from "lib/bridge/message";
import { provider } from "utils/wagmi";

const useExecution = () => {
  const { canSwitch, switchNetworkAsync } = useSwitchNetwork();
  const { data: signer } = useSigner();
  const { chainId: providerChainId } = useActiveChainId();
  const { foreignChainId, foreignAmbAddress, foreignAmbVersion } = useBridgeDirection();

  const [doRepeat, setDoRepeat] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [txHash, setTxHash] = useState();

  const showError = useCallback((msg: any) => {
    if (msg) toast.error(msg);
  }, []);

  const switchChain = useCallback(
    async (chainId: ChainId) => {
      const result = await switchNetworkAsync(chainId).catch((metamaskError) => {
        console.error({ metamaskError });
        handleWalletError(metamaskError, showError);
      });
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showError]
  );

  const isRightNetwork = providerChainId === foreignChainId;

  const executeCallback = useCallback(
    async (msgData: any) => {
      if (!signer) return;

      try {
        setExecuting(true);
        if (!isRightNetwork) {
          if (canSwitch) {
            const success = await switchNetworkAsync(foreignChainId);
            if (success) {
              setMessage(msgData);
              setDoRepeat(true);
              return;
            }
          }
          showError(`Wrong network. Please connect your wallet to ${getNetworkLabel(foreignChainId)}.`);
        } else {
          console.log("executeSignatures", msgData);
          const tx = await executeSignatures(signer, foreignAmbAddress, foreignAmbVersion ?? "", msgData);
          await tx.wait();
          setTxHash(tx.hash);
        }
      } catch (claimError: any) {
        if (claimError?.code === "TRANSACTION_REPLACED") {
          if (claimError.cancelled) {
            throw new Error("transaction was replaced");
          } else {
            console.debug("TRANSACTION_REPLACED");
            await claimError.replacement.wait();
            setTxHash(claimError.replacement.hash);
          }
        } else {
          throw claimError;
        }
      } finally {
        setExecuting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signer, foreignChainId, foreignAmbVersion, foreignAmbAddress, showError, switchChain, isRightNetwork]
  );

  useEffect(() => {
    if (isRightNetwork && doRepeat && !!message) {
      executeCallback(message);
      setDoRepeat(false);
      setMessage(undefined);
    }
  }, [executeCallback, doRepeat, message, isRightNetwork]);

  return { executeCallback, executing, executionTx: txHash };
};

export const useClaim = () => {
  const { chainId: providerChainId } = useActiveChainId();
  const { connector } = useAccount();
  const { executeCallback, executing, executionTx } = useExecution();
  const { homeChainId, homeAmbAddress, foreignChainId, foreignAmbAddress, requiredSignatures, validatorList } =
    useBridgeDirection();

  const claim = useCallback(
    async (txHash: string, txMessage: any) => {
      if (providerChainId !== foreignChainId && connector?.id !== "metamask") {
        throw Error(`Wrong network. Please connect your wallet to ${getNetworkLabel(foreignChainId)}.`);
      }
      let message = txMessage && txMessage.messageData && txMessage.signatures ? txMessage : null;
      if (!message) {
        const homeProvider = await provider({ chainId: homeChainId });
        message = await getMessage(true, homeProvider, homeAmbAddress, txHash);
      }
      message.signatures = getRemainingSignatures(
        message.messageData,
        message.signatures,
        requiredSignatures,
        validatorList
      );
      const foreignProvider = await provider({ chainId: foreignChainId });
      const claimed = await messageCallStatus(foreignAmbAddress, foreignProvider, message.messageId);
      if (claimed) {
        throw Error(TOKENS_CLAIMED);
      }
      return executeCallback(message);
    },
    [
      executeCallback,
      homeChainId,
      homeAmbAddress,
      foreignChainId,
      foreignAmbAddress,
      providerChainId,
      connector?.id,
      requiredSignatures,
      validatorList,
    ]
  );

  return { claim, executing, executionTx };
};
