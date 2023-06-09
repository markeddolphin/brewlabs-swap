import { BrewlabsPair } from "config/constants/types";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBrewlabsFeeManager } from "hooks/useContract";
import { useCallback } from "react";

export const useClaim = () => {
  const { chainId } = useActiveWeb3React();

  const feeManagerContract = useBrewlabsFeeManager(chainId);

  const claimAll = useCallback(
    (pairs) => {
      if (feeManagerContract) {
        const pairAddresses = pairs.map((pair) => pair.id);
        feeManagerContract.claimAll(pairAddresses);
      }
    },
    [feeManagerContract]
  );

  const claim = useCallback(
    (pair) => {
      if (feeManagerContract) {
        const pairAddress = pair.id;
        feeManagerContract.claim(pairAddress);
      }
    },
    [feeManagerContract]
  );

  return { claimAll, claim };
};