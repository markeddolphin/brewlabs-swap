import { useMemo } from "react";
import { useBridgeContext } from "contexts/BridgeContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useBridgeDirection } from "./useBridgeDirection";

export const useNeedsClaiming = () => {
  const { chainId: providerChainId } = useActiveChainId();
  const { fromToken }: any = useBridgeContext();
  const { homeChainId, claimDisabled, tokensClaimDisabled } = useBridgeDirection();

  const isHome = providerChainId === homeChainId;

  return useMemo(
    () => isHome && !claimDisabled && !(tokensClaimDisabled ?? []).includes(fromToken?.address.toLowerCase()),
    [isHome, claimDisabled, tokensClaimDisabled, fromToken]
  );
};
