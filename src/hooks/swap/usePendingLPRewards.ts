import { useEffect, useState } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBrewlabsFeeManager } from "hooks/useContract";
import { Address } from "wagmi";
import { useSingleContractMultipleData } from "state/multicall/hooks";

export const usePendingLPRewards = (pairs) => {
  const { chainId, account } = useActiveWeb3React();
  const contract = useBrewlabsFeeManager(chainId);

  const outputOfRewards = useSingleContractMultipleData(
    contract,
    "pendingLPRewards",
    pairs.map((pair) => [pair.id, account])
  );

  return outputOfRewards.map((data) => data.result);
};
