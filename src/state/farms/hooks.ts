import BigNumber from "bignumber.js";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useSWRImmutable from "swr/immutable";

import { SLOW_INTERVAL } from "config/constants";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useTokenPrice from "hooks/useTokenPrice";
import { useAppDispatch } from "state";
import { deserializeToken } from "state/user/hooks/helpers";
import { BIG_ZERO } from "utils/bigNumber";

import {
  fetchFarmsPublicDataFromApiAsync,
  fetchFarmsTotalStakesAsync,
  fetchFarmsUserDepositDataAsync,
  fetchFarmUserDataAsync,
} from ".";
import { DeserializedFarm, DeserializedFarmUserData, SerializedFarm } from "./types";
import { DeserializedDeposit, DeserializedFarmsState, SerializedDeposit, State } from "../types";

export const usePollFarmsPublicDataFromApi = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchFarmsPublicDataFromApiAsync());
  }, [dispatch]);
};

export const usePollFarmsPublicData = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWeb3React();

  useEffect(() => {
    dispatch(fetchFarmsTotalStakesAsync(chainId));
  }, [dispatch, chainId]);
};

export const usePollFarmsWithUserData = () => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { data: farms } = useFarms();

  useSWRImmutable(
    chainId ? ["publicFarmData", chainId] : null,
    async () => {
      dispatch(fetchFarmsTotalStakesAsync(chainId));
    },
    {
      refreshInterval: SLOW_INTERVAL,
    }
  );

  useSWRImmutable(
    account && chainId ? ["farmsWithUserData", account, chainId, farms.length] : null,
    async () => {
      const pids = farms
        .filter((farmToFetch) => farmToFetch.pid && farmToFetch.chainId === chainId)
        .map((farm) => farm.pid);
      const params = { account, pids, chainId };

      dispatch(fetchFarmUserDataAsync(params));
    },
    {
      refreshInterval: SLOW_INTERVAL,
    }
  );

  useSWRImmutable(
    account ? ["farmsWithUserDepositData", account] : null,
    async () => {
      const pids = farms.map((farmToFetch) => farmToFetch.pid);
      const params = { account, pids };

      dispatch(fetchFarmsUserDepositDataAsync(params));
    },
    {
      refreshInterval: SLOW_INTERVAL,
    }
  );
};

const deserializedDeposit = (deposit: SerializedDeposit): DeserializedDeposit => {
  return {
    ...deposit,
    amount: new BigNumber(deposit.amount),
  };
};

const deserializeFarmUserData = (farm: SerializedFarm): DeserializedFarmUserData => {
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
    reflections: farm.userData ? new BigNumber(farm.userData.reflections) : BIG_ZERO,
    deposits: farm.userData.deposits.map(deserializedDeposit),
  };
};

export const deserializeFarm = (farm: SerializedFarm): DeserializedFarm => {
  const { token, quoteToken, earningToken, reflectionToken, totalStaked, poolWeight, rewardPerBlock, ...rest } = farm;

  return {
    ...rest,
    token: deserializeToken(token),
    quoteToken: deserializeToken(quoteToken),
    earningToken: earningToken ? deserializeToken(earningToken) : undefined,
    reflectionToken: reflectionToken ? deserializeToken(reflectionToken) : undefined,
    userData: deserializeFarmUserData(farm),
    totalStaked: totalStaked ? new BigNumber(totalStaked) : BIG_ZERO,
    poolWeight: poolWeight ? new BigNumber(poolWeight) : BIG_ZERO,
    rewardPerBlock: rewardPerBlock ? new BigNumber(rewardPerBlock) : BIG_ZERO,
  };
};

export const useFarms = (): DeserializedFarmsState => {
  const farms: any = useSelector((state: State) => state.farms);
  const deserializedFarmsData = farms.data.map(deserializeFarm);
  const { userDataLoaded } = farms;

  return {
    userDataLoaded,
    data: deserializedFarmsData,
  };
};

export const useFarmFromPid = (pid: number): DeserializedFarm => {
  const farm: any = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid));
  return deserializeFarm(farm);
};

export const useFarmFromFarmIdAndPoolId = (farmId: number, poolId: number): DeserializedFarm => {
  const farm: any = useSelector((state: State) =>
    state.farms.data.find((f) => f.farmId === farmId && f.poolId === poolId)
  );
  return deserializeFarm(farm);
};

export const useFarmFromLpSymbol = (lpSymbol: string): DeserializedFarm => {
  const farm: any = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol));
  return deserializeFarm(farm);
};

export const useLpTokenPrice = (lpSymbol: string) => {
  const farm = useFarmFromLpSymbol(lpSymbol);
  const lpPrice = useTokenPrice(farm.chainId, farm.lpAddress, true);
  return lpPrice;
};
