import { useEffect, useState } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBrewlabsFeeManager } from "hooks/useContract";
import { useSingleContractMultipleData } from "state/multicall/hooks";

export const usePendingRewards = (pairs) => {
  const { chainId, account } = useActiveWeb3React();
  const contract = useBrewlabsFeeManager(chainId);

  const outputOfRewards = useSingleContractMultipleData(
    contract,
    "pendingRewards",
    pairs.map((pair) => [pair.id, account])
  );

  return Object.fromEntries(outputOfRewards.map((data, index) => [pairs[index].id, data.result]));
};
