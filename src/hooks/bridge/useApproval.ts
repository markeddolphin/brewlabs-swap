import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { BridgeToken } from "config/constants/types";
import { approveToken, fetchAllowance } from "lib/bridge/token";
import { useActiveChainId } from "hooks/useActiveChainId";

export const useApproval = (fromToken: BridgeToken, fromAmount: BigNumber, txHash?: string) => {
  const { chainId: providerChainId } = useActiveChainId();
  const { address: account } = useAccount();
  const { data: signer } = useSigner();
  const [allowance, setAllowance] = useState(BigNumber.from(0));
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    if (fromToken && account && providerChainId === fromToken.chainId) {
      if (signer) fetchAllowance(fromToken, account, signer).then(setAllowance);
    } else {
      setAllowance(BigNumber.from(0));
    }
  }, [signer, account, fromToken, providerChainId, txHash]);

  useEffect(() => {
    if (!fromToken || !fromAmount) {
      setAllowed(false);
      return;
    }
    setAllowed(allowance.gte(fromAmount));
  }, [fromAmount, allowance, fromToken]);

  const [unlockLoading, setUnlockLoading] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState<string | undefined>();

  const approve = useCallback(async () => {
    setUnlockLoading(true);
    const approvalAmount = fromAmount;
    try {
      if (!signer) return;
      const tx = await approveToken(signer, fromToken, approvalAmount);
      setApprovalTxHash(tx.hash);
      await tx.wait();
      setAllowance(approvalAmount);
    } catch (approveError: any) {
      if (approveError?.code === "TRANSACTION_REPLACED") {
        if (approveError.cancelled) {
          throw new Error("transaction was replaced");
        } else {
          console.debug("TRANSACTION_REPLACED");
          setApprovalTxHash(approveError.replacement.hash);
          try {
            await approveError.replacement.wait();
            setAllowance(approvalAmount);
          } catch (secondApprovalError) {
            console.error({
              secondApprovalError,
              fromToken,
              approvalAmount: approvalAmount.toString(),
              account,
            });
            throw secondApprovalError;
          }
        }
      } else {
        console.error({
          approveError,
          fromToken,
          approvalAmount: approvalAmount.toString(),
          account,
        });
        throw approveError;
      }
    } finally {
      setApprovalTxHash(undefined);
      setUnlockLoading(false);
    }
  }, [fromAmount, fromToken, signer, account]);

  return { allowed, unlockLoading, approvalTxHash, approve };
};
