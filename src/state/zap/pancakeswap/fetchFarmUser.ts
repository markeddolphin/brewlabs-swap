import { ChainId } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import masterchefABI from "config/abi/externalMasterchef.json";
import multicall from "utils/multicall";
import { getExternalMasterChefAddress as getMasterChefAddress } from "utils/addressHelpers";
import { AppId } from "config/constants/types";

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch) => {
  const masterChefAddress = getMasterChefAddress(AppId.PANCAKESWAP);

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: "userInfo",
      params: [farm.pid, account],
    };
  });

  const rawStakedBalances = await multicall(masterchefABI, calls, ChainId.BSC_MAINNET);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  const parsedTotalRewards = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[2]._hex).toJSON();
  });
  return [parsedStakedBalances, parsedTotalRewards];
};

export const fetchFarmUserEarnings = async (account: string, farmsToFetch) => {
  const masterChefAddress = getMasterChefAddress(AppId.PANCAKESWAP);

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: "pendingCake",
      params: [farm.pid, account],
    };
  });

  const rawEarnings = await multicall(masterchefABI, calls, ChainId.BSC_MAINNET);
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};
