import BigNumber from "bignumber.js";
import masterchefABI from "config/abi/externalMasterchef.json";
import { AppId } from "config/constants/types";
import { Farm } from "state/types";
import { getExternalMasterChefAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";

export const fetchApeFarmUserStakedBalances = async (chainId: number, account: string, farmsConfig: Farm[]) => {
  const masterChefAddress = getExternalMasterChefAddress(AppId.APESWAP);
  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAddress,
      name: "userInfo",
      params: [farm.pid, account],
    };
  });

  const rawStakedBalances = await multicall(masterchefABI, calls, chainId);
  const parsedStatedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  const parsedTotalRewards = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[2]._hex).toJSON();
  });
  return [parsedStatedBalances, parsedTotalRewards];
};

export const fetchApeFarmUserEarnings = async (chainId: number, account: string, farmsConfig: Farm[]) => {
  const masterChefAddress = getExternalMasterChefAddress(AppId.APESWAP);
  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAddress,
      name: "pendingCake",
      params: [farm.pid, account],
    };
  });

  const rawEarnings = await multicall(masterchefABI, calls, chainId);
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};
