import { ChainId } from "@brewlabs/sdk";
import axios from "axios";
import BigNumber from "bignumber.js";

import erc20ABI from "config/abi/erc20.json";
import masterchefABI from "config/abi/farm/masterchef.json";
import farmImplAbi from "config/abi/farm/farmImpl.json";

import { API_URL } from "config/constants";
import { SerializedFarmConfig } from "config/constants/types";
import { getMasterChefAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";

export const fetchFarmUserAllowances = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);

  const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.lpAddress,
      name: "allowance",
      params: [account, farm.contractAddress ?? masterChefAddress],
    };
  });

  const rawLpAllowances = await multicall(erc20ABI, calls, chainId);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchFarmUserTokenBalances = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  try {
    const calls = farmsToFetch.map((farm) => {
      return {
        address: farm.lpAddress,
        name: "balanceOf",
        params: [account],
      };
    });

    const rawTokenBalances = await multicall(erc20ABI, calls, chainId);
    const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
      return new BigNumber(tokenBalance).toJSON();
    });
    return parsedTokenBalances;
  } catch (e) {
    return [];
  }
};

export const fetchFarmUserStakedBalances = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);

  let data = [];

  // fetch normal farms
  let rawStakedBalances = await multicall(
    masterchefABI,
    farmsToFetch
      .filter((f) => !f.category)
      .map((farm) => ({
        address: farm.contractAddress ?? masterChefAddress,
        name: "userInfo",
        params: [farm.poolId, account],
      })),
    chainId
  );

  farmsToFetch
    .filter((f) => !f.category)
    .forEach((farm, index) => {
      data.push({
        pid: farm.pid,
        farmId: farm.farmId,
        poolId: farm.poolId,
        chainId: farm.chainId,
        stakedBalance: rawStakedBalances[index][0].toString(),
      });
    });

  // fetch factroy-created farms
  rawStakedBalances = await multicall(
    farmImplAbi,
    farmsToFetch
      .filter((f) => f.category)
      .map((farm) => ({
        address: farm.contractAddress,
        name: "userInfo",
        params: [account],
      })),
    chainId
  );

  farmsToFetch
    .filter((f) => f.category)
    .forEach((farm, index) => {
      data.push({
        pid: farm.pid,
        farmId: farm.farmId,
        poolId: farm.poolId,
        chainId: farm.chainId,
        stakedBalance: rawStakedBalances[index][0].toString(),
      });
    });

  return data;
};

export const fetchFarmUserEarnings = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  try {
    const masterChefAddress = getMasterChefAddress(chainId);

    let data = [];

    // fetch normal farms
    let rawEarnings = await multicall(
      masterchefABI,
      farmsToFetch
        .filter((f) => !f.enableEmergencyWithdraw)
        .filter((f) => !f.category)
        .map((farm) => ({
          address: farm.contractAddress ?? masterChefAddress,
          name: "pendingRewards",
          params: [farm.poolId, account],
        })),
      chainId
    );

    farmsToFetch
      .filter((f) => !f.enableEmergencyWithdraw)
      .filter((f) => !f.category)
      .forEach((farm, index) => {
        data.push({
          pid: farm.pid,
          farmId: farm.farmId,
          poolId: farm.poolId,
          chainId: farm.chainId,
          earnings: rawEarnings[index][0].toString(),
        });
      });

    // fetch factroy-created farms
    rawEarnings = await multicall(
      farmImplAbi,
      farmsToFetch
        .filter((f) => !f.enableEmergencyWithdraw)
        .filter((f) => f.category)
        .map((farm) => ({
          address: farm.contractAddress,
          name: "pendingRewards",
          params: [account],
        })),
      chainId
    );

    farmsToFetch
      .filter((f) => !f.enableEmergencyWithdraw)
      .filter((f) => f.category)
      .forEach((farm, index) => {
        data.push({
          pid: farm.pid,
          farmId: farm.farmId,
          poolId: farm.poolId,
          chainId: farm.chainId,
          earnings: rawEarnings[index][0].toString(),
        });
      });

    return data;
  } catch (e) {
    return [];
  }
};

export const fetchFarmUserReflections = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);

  let data = [];

  // fetch normal farms
  let rawReflections = await multicall(
    masterchefABI,
    farmsToFetch
      .filter((f) => !f.enableEmergencyWithdraw)
      .filter((f) => !f.category)
      .map((farm) => ({
        address: farm.contractAddress ?? masterChefAddress,
        name: "pendingReflections",
        params: [farm.poolId, account],
      })),
    chainId
  );

  farmsToFetch
    .filter((f) => !f.enableEmergencyWithdraw)
    .filter((f) => !f.category)
    .map((farm, index) => {
      data.push({
        pid: farm.pid,
        farmId: farm.farmId,
        poolId: farm.poolId,
        chainId: farm.chainId,
        reflections: rawReflections[index][0].toString(),
      });
    });

  // fetch factroy-created farms
  rawReflections = await multicall(
    farmImplAbi,
    farmsToFetch
      .filter((f) => !f.enableEmergencyWithdraw)
      .filter((f) => f.category)
      .map((farm) => ({
        address: farm.contractAddress,
        name: "pendingReflections",
        params: [account],
      })),
    chainId
  );

  farmsToFetch
    .filter((f) => !f.enableEmergencyWithdraw)
    .filter((f) => f.category)
    .forEach((farm, index) => {
      data.push({
        pid: farm.pid,
        farmId: farm.farmId,
        poolId: farm.poolId,
        chainId: farm.chainId,
        reflections: rawReflections[index][0].toString(),
      });
    });

  return data;
};

export const fetchFarmUserDeposits = async (farm, account) => {
  const res = await axios.post(`${API_URL}/deposit/${account}/single`, { type: "farm", id: farm.pid });

  const ret = res?.data ?? [];

  let record = { pid: farm.pid, deposits: [] };
  record.deposits = ret.filter((d) => d.farmId === farm.pid);

  return record;
};
