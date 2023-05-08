import axios from "axios";
import BigNumber from "bignumber.js";

import erc20ABI from "config/abi/erc20.json";
import lockupStakingABI from "config/abi/staking/brewlabsLockup.json";
import lockupStakingV2ABI from "config/abi/staking/brewlabsLockupV2.json";
import brewlabsStakingMultiABI from "config/abi/staking/brewlabsStakingMulti.json";
import singleStakingABI from "config/abi/staking/singlestaking.json";

import { API_URL, MULTICALL_FETCH_LIMIT } from "config/constants";
import { PoolCategory } from "config/constants/types";
import { BIG_ZERO } from "utils/bigNumber";
import multicall from "utils/multicall";
import { simpleRpcProvider } from "utils/providers";

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
export const fetchPoolsAllowance = async (account, chainId, pools) => {
  const nonBnbPools = pools.filter((pool) => !pool.stakingToken.isNative && pool.chainId === chainId);
  const filters = [];
  for (let i = 0; i < nonBnbPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = nonBnbPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = {};
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const calls = batch.map((pool) => ({
          address: pool.stakingToken.address,
          name: "allowance",
          params: [account, pool.contractAddress],
        }));

        const allowances = await multicall(erc20ABI, calls, chainId);
        nonBnbPools.forEach((pool, index) => {
          data[pool.sousId] = new BigNumber(allowances[index]).toJSON();
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchUserBalances = async (account, chainId, pools) => {
  // Non BNB pools
  const nonBnbPools = pools.filter((pool) => !pool.stakingToken.isNative && pool.chainId === chainId);
  const filters = [];
  for (let i = 0; i < nonBnbPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = nonBnbPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = {};
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const calls = batch.map((pool) => ({
          address: pool.stakingToken.address,
          name: "balanceOf",
          params: [account],
        }));
        const tokenBalancesRaw = await multicall(erc20ABI, calls, chainId);

        nonBnbPools.forEach((pool, index) => {
          data[pool.sousId] = new BigNumber(tokenBalancesRaw[index]).toJSON();
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  // BNB pools
  const bnbBalance = await simpleRpcProvider(chainId).getBalance(account);
  const bnbPools = pools.filter((pool) => pool.stakingToken.isNative);
  const bnbBalances = bnbPools
    .filter((p) => p.chainId === chainId)
    .reduce((acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance.toString()).toJSON() }), {});

  return { ...data, ...bnbBalances };
};

export const fetchUserStakeBalances = async (account, chainId, pools) => {
  const selectedPools = pools.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = { stakedBalances: {}, lockedBalances: {} };
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupPools = batch.filter((p) => !p.stakingToken.isNative && p.poolCategory.indexOf("Lockup") === -1);
        const calls = nonLockupPools.map((p) => ({
          address: p.contractAddress,
          name: "userInfo",
          params: [account],
        }));

        const lockupPools = batch.filter((p) => !p.stakingToken.isNative && p.poolCategory === PoolCategory.LOCKUP);
        const lockupCalls = lockupPools.map((p) => ({
          address: p.contractAddress,
          name: "userInfo",
          params: [p.lockup, account],
        }));

        const lockupV2Pools = batch.filter(
          (p) =>
            !p.stakingToken.isNative && p.poolCategory !== PoolCategory.LOCKUP && p.poolCategory.indexOf("Lockup") > -1
        );
        const lockupV2Calls = lockupV2Pools.map((p) => ({
          address: p.contractAddress,
          name: "userInfo",
          params: [account],
        }));

        const nonLockupPoolsUserInfo = await multicall(singleStakingABI, calls, chainId);
        const lockupPoolsUserInfo = await multicall(lockupStakingABI, lockupCalls, chainId);
        const lockupV2PoolsUserInfo = await multicall(lockupStakingV2ABI, lockupV2Calls, chainId);

        nonLockupPools.forEach((pool, index) => {
          data.stakedBalances[pool.sousId] = new BigNumber(nonLockupPoolsUserInfo[index].amount._hex).toJSON();
          data.lockedBalances[pool.sousId] = nonLockupPoolsUserInfo[index].locked
            ? new BigNumber(nonLockupPoolsUserInfo[index].locked._hex).toJSON()
            : BIG_ZERO.toJSON();
        });
        lockupPools.forEach((pool, index) => {
          data.stakedBalances[pool.sousId] = new BigNumber(lockupPoolsUserInfo[index].amount._hex).toJSON();
          data.lockedBalances[pool.sousId] = new BigNumber(lockupPoolsUserInfo[index].locked._hex).toJSON();
        });
        lockupV2Pools.forEach((pool, index) => {
          data.stakedBalances[pool.sousId] = new BigNumber(lockupV2PoolsUserInfo[index].amount._hex).toJSON();
          data.lockedBalances[pool.sousId] = new BigNumber(lockupV2PoolsUserInfo[index].locked._hex).toJSON();
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchUserPendingRewards = async (account, chainId, pools) => {
  const selectedPools = pools.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = {};
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupPools = batch.filter(
          (p) => !p.stakingToken.isNative && p.chainId === chainId && p.poolCategory !== PoolCategory.LOCKUP
        );
        const calls = nonLockupPools
          .filter((p) => p.chainId === chainId)
          .map((p) => ({
            address: p.contractAddress,
            name: "pendingReward",
            params: [account],
          }));

        const lockupPools = batch.filter(
          (p) => !p.stakingToken.isNative && p.chainId === chainId && p.poolCategory === PoolCategory.LOCKUP
        );
        const lockupCalls = lockupPools
          .filter((p) => p.chainId === chainId)
          .map((p) => ({
            address: p.contractAddress,
            name: "pendingReward",
            params: [account, p.lockup],
          }));

        const nonLockupsRes = await multicall(singleStakingABI, calls, chainId);
        const lockupsRes = await multicall(lockupStakingABI, lockupCalls, chainId);

        nonLockupPools.forEach((pool, index) => {
          data[pool.sousId] = new BigNumber(nonLockupsRes[index]).toJSON();
        });
        lockupPools.forEach((pool, index) => {
          data[pool.sousId] = new BigNumber(lockupsRes[index]).toJSON();
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchUserPendingReflections = async (account, chainId, pools) => {
  const selectedPools = pools.filter(
    (p) => p.sousId > 1 && (p.sousId < 10 || p.sousId > 12) && p.reflection && p.chainId === chainId
  );
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = {};
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupReflectionPools = batch.filter((p) => p.poolCategory.indexOf("Lockup") === -1);
        const lockupReflectionPools = batch.filter(
          (p) => p.poolCategory === PoolCategory.LOCKUP && ![13, 14, 33, 34].includes(p.sousId)
        );
        const multiReflectionPools = batch.filter(
          (p) => p.poolCategory === PoolCategory.MULTI || p.poolCategory === PoolCategory.MULTI_LOCKUP
        );

        const calls = nonLockupReflectionPools.map((p) => ({
          address: p.contractAddress,
          name: "pendingDividends",
          params: [account],
        }));
        const lockupCalls = lockupReflectionPools.map((p) => ({
          address: p.contractAddress,
          name: "pendingDividends",
          params: [account, p.lockup],
        }));

        const nonLockupRes = await multicall(singleStakingABI, calls, chainId);
        const lockupRes = await multicall(lockupStakingABI, lockupCalls, chainId);

        nonLockupReflectionPools.forEach((pool, index) => {
          data[pool.sousId] = [new BigNumber(nonLockupRes[index]).toJSON()];
        });
        lockupReflectionPools.forEach((pool, index) => {
          data[pool.sousId] = [new BigNumber(lockupRes[index]).toJSON()];
        });

        await Promise.all(
          multiReflectionPools.map(async (p) => {
            const multiCalls = [
              {
                address: p.contractAddress,
                name: "pendingDividends",
                params: [account],
              },
            ];

            try {
              const multiRes = await multicall(brewlabsStakingMultiABI, multiCalls, chainId);
              const pendings = [];
              for (let i = 0; i < p.reflectionTokens.length; i++) {
                pendings.push(new BigNumber(multiRes[0][0][i]._hex).toJSON());
              }
              data[p.sousId] = pendings;
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log("no staked");
            }
          })
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchPoolAllowance = async (pool, account, chainId) => {
  const calls = [
    {
      address: pool.stakingToken.address,
      name: "allowance",
      params: [account, pool.contractAddress],
    },
  ];

  const allowances = await multicall(erc20ABI, calls, chainId);
  return new BigNumber(allowances[0]).toJSON();
};

export const fetchUserBalance = async (pool, account, chainId) => {
  if (pool.stakingToken.isNative) {
    const bnbBalance = await simpleRpcProvider(chainId).getBalance(account);
    return bnbBalance;
  }

  const calls = [
    {
      address: pool.stakingToken.address,
      name: "balanceOf",
      params: [account],
    },
  ];
  const tokenBalancesRaw = await multicall(erc20ABI, calls, chainId);
  return new BigNumber(tokenBalancesRaw[0]).toJSON();
};

export const fetchUserStakeBalance = async (pool, account, chainId) => {
  const calls = [
    {
      address: pool.contractAddress,
      name: "userInfo",
      params: pool.poolCategory === PoolCategory.LOCKUP ? [pool.lockup, account] : [account],
    },
  ];

  const userInfo = await multicall(
    pool.poolCategory === PoolCategory.LOCKUP
      ? lockupStakingABI
      : pool.poolCategory.indexOf("Lockup") > -1
      ? lockupStakingV2ABI
      : singleStakingABI,
    calls,
    chainId
  );

  return {
    stakedBalance: new BigNumber(userInfo[0].amount._hex).toJSON(),
    lockedBalance: userInfo[0].locked ? new BigNumber(userInfo[0].locked._hex).toJSON() : BIG_ZERO.toJSON(),
  };
};

export const fetchUserPendingReward = async (pool, account, chainId) => {
  const calls = [
    {
      address: pool.contractAddress,
      name: "pendingReward",
      params: pool.poolCategory === PoolCategory.LOCKUP ? [account, pool.lockup] : [account],
    },
  ];

  const rewards = await multicall(
    pool.poolCategory === PoolCategory.LOCKUP ? lockupStakingABI : singleStakingABI,
    calls,
    chainId
  );
  return new BigNumber(rewards[0]).toJSON();
};

export const fetchUserPendingReflection = async (pool, account, chainId) => {
  const calls = [
    {
      address: pool.contractAddress,
      name: "pendingDividends",
      params: pool.poolCategory === PoolCategory.LOCKUP ? [account, pool.lockup] : [account],
    },
  ];

  if (pool.poolCategory === PoolCategory.LOCKUP) {
    const lockupRes = await multicall(lockupStakingABI, calls, chainId);
    return [new BigNumber(lockupRes[0]).toJSON()];
  }

  if (pool.poolCategory === PoolCategory.MULTI || pool.poolCategory === PoolCategory.MULTI_LOCKUP) {
    const multiRes = await multicall(brewlabsStakingMultiABI, calls, chainId);
    const pendings = [];
    for (let i = 0; i < pool.reflectionTokens.length; i++) {
      pendings.push(new BigNumber(multiRes[0][0][i]._hex).toJSON());
    }

    return pendings;
  }

  const nonLockupRes = await multicall(singleStakingABI, calls, chainId);
  return [new BigNumber(nonLockupRes[0]).toJSON()];
};

export const fetchUserDepositData = async (pool, account) => {
  const res = await axios.post(`${API_URL}/deposit/${account}/single`, { type: "pool", id: pool.sousId });

  const ret = res?.data ?? [];

  let record = { sousId: pool.sousId, deposits: [] };
  record.deposits = ret.filter((d) => d.sousId === pool.sousId);

  return record;
};
