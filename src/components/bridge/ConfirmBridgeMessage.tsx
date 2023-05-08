import { ReactElement, useCallback } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";

import { useBridgeContext } from "contexts/BridgeContext";
import { useApproval } from "hooks/bridge/useApproval";
import { useTokenLimits } from "hooks/bridge/useTokenLimits";
import { isRevertedError } from "lib/bridge/amb";
import { formatValue, getNativeSybmol, getNetworkLabel, handleWalletError } from "lib/bridge/helpers";

import { useGlobalState } from "../../state";
import Button from "../Button";
import CrossChainIcons from "../CrossChainIcons";

const ConfirmBridgeMessage = ({ onClose }: { onClose: () => void }): ReactElement => {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { amountInput, fromAmount, fromToken, fromBalance, receiver, txHash, toAmountLoading, loading, transfer } =
    useBridgeContext();
  const { tokenLimits } = useTokenLimits();
  const { allowed, approve, unlockLoading } = useApproval(fromToken!, fromAmount, txHash);

  const unlockButtonDisabled =
    !fromToken || allowed || toAmountLoading || !(isConnected && chain?.id === fromToken?.chainId);
  const transferButtonEnabled = !!fromToken && allowed && !loading && isConnected && chain?.id === fromToken?.chainId;

  const [networkTo] = useGlobalState("userBridgeTo");
  const [networkFrom] = useGlobalState("userBridgeFrom");
  const [, setLocked] = useGlobalState("userBridgeLocked");

  const showError = useCallback((msg: any) => {
    if (msg) toast.error(msg);
  }, []);

  const approveValid = useCallback(() => {
    if (!chain?.id) {
      showError("Please connect wallet");
      return false;
    }
    if (chain?.id !== fromToken?.chainId) {
      showError(`Please switch to ${getNetworkLabel(fromToken?.chainId!)}`);
      return false;
    }
    if (fromAmount.lte(0)) {
      showError("Please specify amount");
      return false;
    }
    if (fromBalance.lt(fromAmount)) {
      showError("Not enough balance");
      return false;
    }
    return true;
  }, [chain, fromToken?.chainId, fromAmount, fromBalance, showError]);

  const onApprove = useCallback(() => {
    if (!unlockLoading && !unlockButtonDisabled && approveValid()) {
      approve().catch((error) => {
        console.log(error);
        if (error && error.message) {
          if (
            isRevertedError(error) ||
            (error.data && (error.data.includes("Bad instruction fee") || error.data.includes("Reverted")))
          ) {
            showError(
              <div>
                There is problem with the token unlock. Try to revoke previous approval if any on{" "}
                <a href="https://revoke.cash" className="text-underline">
                  https://revoke.cash/
                </a>{" "}
                and try again.
              </div>
            );
          } else {
            handleWalletError(error, showError);
          }
        } else {
          showError("Impossible to perform the operation. Reload the application and try again.");
        }
      });
    }
  }, [unlockLoading, unlockButtonDisabled, approveValid, showError, approve]);

  const transferValid = useCallback(() => {
    if (!chain?.id) {
      showError("Please connect wallet");
    } else if (chain?.id !== fromToken?.chainId) {
      showError(`Please switch to ${getNetworkLabel(fromToken?.chainId!)}`);
    } else if (
      tokenLimits &&
      (fromAmount.gt(tokenLimits.remainingLimit) || tokenLimits.remainingLimit.lt(tokenLimits.minPerTx))
    ) {
      showError("Daily limit reached. Please try again tomorrow or with a lower amount");
    } else if (tokenLimits && fromAmount.lt(tokenLimits.minPerTx)) {
      showError(`Please specify amount more than ${formatValue(tokenLimits.minPerTx, fromToken.decimals)}`);
    } else if (tokenLimits && fromAmount.gt(tokenLimits.maxPerTx)) {
      showError(`Please specify amount less than ${formatValue(tokenLimits.maxPerTx, fromToken.decimals)}`);
    } else if (fromBalance.lt(fromAmount)) {
      showError("Not enough balance");
    } else if (receiver && !ethers.utils.isAddress(receiver)) {
      showError(`Please specify a valid recipient address`);
    } else {
      return true;
    }
    return false;
  }, [chain, tokenLimits, fromToken, fromAmount, fromBalance, receiver, showError]);

  const onTransfer = useCallback(() => {
    if (transferButtonEnabled && transferValid()) {
      transfer()
        .then(() => {
          setLocked(false);
          onClose();
        })
        .catch((error: any) => handleWalletError(error, showError, getNativeSybmol(fromToken?.chainId)));
    }
  }, [transferButtonEnabled, transferValid, transfer, setLocked, onClose, showError, fromToken?.chainId]);

  const renderActions = () => {
    if (!allowed) {
      return (
        <Button onClick={onApprove} disabled={unlockLoading || toAmountLoading}>
          <div className="flex items-center">
            <div className="mr-2">{unlockLoading ? "Approving" : "Approve"}</div>
            {unlockLoading && (
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
      );
    }

    return (
      <Button onClick={onTransfer} disabled={!transferButtonEnabled}>
        <div className="flex items-center">
          <div className="mr-2">{loading ? "Confirming" : "Confirm"}</div>
          {loading && (
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
    );
  };

  return (
    <div className="p-8">
      <div className="mx-auto w-fit">
        <CrossChainIcons chainOne={networkFrom.image} chainTwo={networkTo.image} />
      </div>

      <div className="mt-3 text-center sm:mt-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Please confirm swap</h3>
        <div className="mx-auto mt-2 max-w-sm">
          <p className="text-sm text-gray-500">
            You are about to send{" "}
            <span className="font-bolder text-brand">
              {amountInput} {fromToken?.symbol} from the {networkFrom.name}
            </span>{" "}
            network to the <span className="font-bolder text-brand">{networkTo.name}</span> network.
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-flow-row-dense grid-cols-2 gap-3 sm:mt-6">
        {renderActions()}
        <Button
          onClick={() => {
            setLocked(false);
            onClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ConfirmBridgeMessage;
