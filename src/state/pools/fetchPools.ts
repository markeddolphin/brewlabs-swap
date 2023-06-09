import axios from "axios";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { ChainId } from "@brewlabs/sdk";

import singleStakingABI from "config/abi/staking/singlestaking.json";
import lockupStakingABI from "config/abi/staking/brewlabsLockup.json";
import lockupV2StakingABI from "config/abi/staking/brewlabsLockupV2.json";
import lockupMultiStakingABI from "config/abi/staking/brewlabsStakingMulti.json";

import { API_URL, MULTICALL_FETCH_LIMIT } from "config/constants";
import { EXPLORER_API_KEYS, EXPLORER_API_URLS } from "config/constants/networks";
import { PoolCategory } from "config/constants/types";
import { getAddress } from "utils/addressHelpers";
import { BIG_ZERO } from "utils/bigNumber";
import { getSingleStakingContract } from "utils/contractHelpers";
import { getBalanceNumber } from "utils/formatBalance";
import { sumOfArray } from "utils/functions";
import multicall from "utils/multicall";

export const fetchPoolsBlockLimits = async (chainId, pools) => {
  const poolsWithEnd = pools.filter((p) => p.sousId !== 0 && p.chainId === chainId);

  const filters = [];
  for (let i = 0; i < poolsWithEnd.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = poolsWithEnd.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const callsStartBlock = batch.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "startBlock",
          };
        });
        const callsEndBlock = batch.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "bonusEndBlock",
          };
        });

        const starts = await multicall(singleStakingABI, callsStartBlock, chainId);
        const ends = await multicall(singleStakingABI, callsEndBlock, chainId);

        batch.forEach((pool, index) => {
          data.push({
            sousId: pool.sousId,
            startBlock: starts[index][0].toNumber(),
            endBlock: pool.forceEndblock ? pool.forceEndblock : ends[index][0].toNumber(),
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchRewardPerBlocks = async (chainId, pools) => {
  const selectedPools = pools.filter((p) => p.sousId !== 0 && p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupPools = batch.filter((p) => p.poolCategory.indexOf("Lockup") === -1);
        const lockupPools = batch.filter((p) => p.poolCategory === PoolCategory.LOCKUP);
        const lockupV2Pools = batch.filter(
          (p) => p.poolCategory === PoolCategory.LOCKUP_V2 || p.poolCategory === PoolCategory.MULTI_LOCKUP
        );

        const callsNonLockupPools = nonLockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "rewardPerBlock",
          };
        });

        const callsLockupPools = lockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "rewardPerBlock",
            params: [poolConfig.lockup],
          };
        });

        const callsLockupV2Pools = lockupV2Pools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "rewardPerBlock",
            params: [],
          };
        });

        const nonLockupPoolsRewards = await multicall(singleStakingABI, callsNonLockupPools, chainId);
        const lockupPoolsRewards = await multicall(lockupStakingABI, callsLockupPools, chainId);
        const lockupV2PoolsRewards = await multicall(lockupV2StakingABI, callsLockupV2Pools, chainId);

        const callsForDepositFeesNonLockupPools = nonLockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "depositFee",
            params: [],
          };
        });
        const callsForWithdrawFeesNonLockupPools = nonLockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "withdrawFee",
            params: [],
          };
        });
        const callsFeesLockupPools = lockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "lockups",
            params: [poolConfig.lockup],
          };
        });

        const callsFeesLockupV2Pools = lockupV2Pools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "lockupInfo",
            params: [],
          };
        });

        const nonLockupPoolsDFee = await multicall(singleStakingABI, callsForDepositFeesNonLockupPools, chainId);
        const nonLockupPoolsWFee = await multicall(singleStakingABI, callsForWithdrawFeesNonLockupPools, chainId);
        const lockupPoolsFees = await multicall(lockupStakingABI, callsFeesLockupPools, chainId);
        const lockupV2PoolsFees = await multicall(lockupV2StakingABI, callsFeesLockupV2Pools, chainId);

        nonLockupPools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            tokenPerBlock: nonLockupPoolsRewards[index][0].toString(),
            depositFee: nonLockupPoolsDFee[index][0].div(100).toNumber(),
            withdrawFee: nonLockupPoolsWFee[index][0].div(100).toNumber(),
            duration: 0,
          });
        });
        lockupPools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            tokenPerBlock: lockupPoolsRewards[index][0].toString(),
            depositFee: lockupPoolsFees[index].depositFee.div(100).toNumber(),
            withdrawFee: lockupPoolsFees[index].withdrawFee.div(100).toNumber(),
            duration: lockupPoolsFees[index].duration.toNumber(),
          });
        });
        lockupV2Pools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            tokenPerBlock: lockupV2PoolsRewards[index][0].toString(),
            depositFee: lockupV2PoolsFees[index].depositFee.div(100).toNumber(),
            withdrawFee: lockupV2PoolsFees[index].withdrawFee.div(100).toNumber(),
            duration: lockupV2PoolsFees[index].duration.toNumber(),
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchPoolsTotalStaking = async (chainId, pools) => {
  const selectedPools = pools.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupPools = batch.filter((p) => !p.stakingToken.isNative && p.poolCategory !== PoolCategory.LOCKUP);
        const lockupPools = batch.filter((p) => !p.stakingToken.isNative && p.poolCategory === PoolCategory.LOCKUP);

        const callsNonLockupPools = nonLockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "totalStaked",
            params: [],
          };
        });

        const callsLockupPools = lockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            name: "lockups",
            params: [poolConfig.lockup],
          };
        });

        const nonLockupPoolsTotalStaked = await multicall(singleStakingABI, callsNonLockupPools, chainId);
        const lockupPoolsTotalStaked = await multicall(lockupStakingABI, callsLockupPools, chainId);

        nonLockupPools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            totalStaked: ethers.utils
              .formatUnits(nonLockupPoolsTotalStaked[index][0], p.stakingToken.decimals)
              .toString(),
          });
        });

        lockupPools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            totalStaked: ethers.utils
              .formatUnits(lockupPoolsTotalStaked[index].totalStaked._hex, p.stakingToken.decimals)
              .toString(),
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchPerformanceFees = async (chainId, pools) => {
  const selectedPools = pools.filter((p) => p.isServiceFee && p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const callsPools = batch.map((pool) => {
          return {
            address: pool.contractAddress,
            name: "performanceFee",
          };
        });

        const performanceFees = await multicall(singleStakingABI, callsPools, chainId);

        pools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            performanceFee: new BigNumber(performanceFees[index]).toJSON(),
            duration: 0,
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchPoolStakingLimit = async (chainId: ChainId, address: string): Promise<BigNumber> => {
  try {
    const sousContract = getSingleStakingContract(chainId, address);
    const stakingLimit = await sousContract.poolLimitPerUser();
    return new BigNumber(stakingLimit.toString());
  } catch (error) {
    return BIG_ZERO;
  }
};

export const fetchPoolsStakingLimits = async (pools: any[]): Promise<{ [key: string]: BigNumber }> => {
  const validPools = pools.filter((p) => !p.stakingToken.isNative && !p.isFinished);

  // Get the staking limit for each valid pool
  // Note: We cannot batch the calls via multicall because V1 pools do not have "poolLimitPerUser" and will throw an error
  const stakingLimitPromises = validPools.map((validPool) =>
    fetchPoolStakingLimit(validPool.chainId, getAddress(validPool.contractAddress, validPool.chainId))
  );
  const stakingLimits = await Promise.all(stakingLimitPromises);

  return stakingLimits.reduce((accum, stakingLimit, index) => {
    return {
      ...accum,
      [validPools[index].sousId]: stakingLimit,
    };
  }, {});
};

export const fetchPoolTotalRewards = async (pool) => {
  let calls = [
    {
      address: pool.contractAddress,
      name: "availableRewardTokens",
      params: [],
    },
  ];

  let abi = lockupStakingABI;
  if (pool.poolCategory === PoolCategory.MULTI_LOCKUP) {
    for (let i = 0; i < pool.reflectionTokens.length; i++) {
      calls.push({
        address: pool.contractAddress,
        name: "availableDividendTokens",
        params: [i],
      });
    }
    abi = lockupMultiStakingABI;
  } else {
    if (
      (pool.poolCategory === PoolCategory.CORE && pool.sousId <= 20) ||
      (pool.poolCategory === PoolCategory.LOCKUP && pool.sousId <= 48) ||
      (pool.poolCategory === PoolCategory.LOCKUP_V2 && pool.sousId <= 65)
    ) {
      calls.push({
        address: pool.contractAddress,
        name: "availabledividendTokens",
        params: [],
      });
      abi = singleStakingABI;
    } else {
      calls.push({
        address: pool.contractAddress,
        name: "availableDividendTokens",
        params: [],
      });
    }
  }

  const res = await multicall(abi, calls, pool.chainId);
  let availableReflections = [];
  if (pool.reflection) {
    for (let i = 0; i < pool.reflectionTokens.length; i++) {
      availableReflections.push(getBalanceNumber(res[i + 1], pool.reflectionTokens[i].decimals));
    }
  }

  return { availableRewards: getBalanceNumber(res[0], pool.earningToken.decimals), availableReflections };
};

export const fetchPoolDepositBalance = async (pool) => {
  const url = `${EXPLORER_API_URLS[pool.chainId]}?module=account&action=tokentx&contractaddress=${
    pool.earningToken.address
  }&address=${pool.contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${EXPLORER_API_KEYS[pool.chainId]}`;

  let sHistoryResult: any = await axios.get(url);
  sHistoryResult = sHistoryResult.data.result;

  let depositBalance = 0;

  if (sHistoryResult && sHistoryResult !== "Max rate limit reached"  && sHistoryResult !== "Error! Invalid contract address format") {
    sHistoryResult.map((history: any) => {
      if (history.to.toLowerCase() === pool.contractAddress.toLowerCase()) {
        depositBalance += history.value / Math.pow(10, pool.earningToken.decimals);
      }
    });
  }
  return depositBalance;
};

export const fetchPoolFeeHistories = async (pool) => {
  let res;
  try {
    res = await axios.post(`${API_URL}/fee/single`, { type: "pool", id: pool.sousId });
  } catch (e) {}
  if (!res.data) {
    return { performanceFees: [], tokenFees: [], stakedAddresses: [] };
  }
  const { performanceFees, tokenFees, stakedAddresses } = res.data;

  let _performanceFees = [],
    _tokenFees = [],
    _stakedAddresses = [];
  const timeBefore24Hrs = Math.floor(new Date().setHours(new Date().getHours() - 24) / 1000);
  const curTime = Math.floor(new Date().getTime() / 1000);

  for (let t = timeBefore24Hrs; t <= curTime; t += 3600) {
    _performanceFees.push(sumOfArray(performanceFees.filter((v) => v.timestamp <= t).map((v) => v.value)));
    _tokenFees.push(sumOfArray(tokenFees.filter((v) => v.timestamp <= t).map((v) => +v.value)));
    _stakedAddresses.push(sumOfArray(stakedAddresses.filter((v) => v.timestamp <= t).map((v) => v.value)));
  }

  return { performanceFees: _performanceFees, tokenFees: _tokenFees, stakedAddresses: _stakedAddresses };
};
