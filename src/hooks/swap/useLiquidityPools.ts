import { useEffect, useState } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBrewlabsFeeManager } from "hooks/useContract";
import { Address } from "wagmi";
import { useSingleContractMultipleData } from "state/multicall/hooks";

type FeeDistribution = {
  lpFee: number;
  brewlabsFee: number;
  tokenOwnerFee: number;
  stakingFee: number;
  referralFEe: number;
};

type PoolFeInfoOutput = {
  token0: Address;
  token1: Address;
  tokenOwner: Address;
  referrer: Address;
  feeDistribution: FeeDistribution;
  timeToOpen: number;
};

export const useLiquidityPools = () => {
  const { chainId } = useActiveWeb3React();
  const contract = useBrewlabsFeeManager(chainId);
  const [pairsLength, setPairsLength] = useState<number>(0);

  useEffect(() => {
    if (contract) {
      (async () => {
        const value = await contract.pairsLength();
        setPairsLength(value.toNumber());
      })();
    }
  }, [contract]);

  const outputOfPairs = useSingleContractMultipleData(
    contract,
    "pairs",
    [...Array(pairsLength).keys()].map((i) => [i])
  );

  const pairs = outputOfPairs.filter((data) => data.result).map((data) => data.result[0]);

  const outputOfPools = useSingleContractMultipleData(
    contract,
    "getPoolFeInfo",
    pairs.map((pair) => [pair])
  );

  const pools: PoolFeInfoOutput[] = outputOfPools.map((data) => data.result?.[0]);

  return pools
    .map((pool, index) => ({ value: pool, key: index }))
    .filter(({ value, key }) => value)
    .map(({ value, key }) => ({ ...value, id: pairs[key] }));
};
