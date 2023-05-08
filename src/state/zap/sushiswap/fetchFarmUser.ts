import { ChainId } from "@brewlabs/sdk";
import { AppId, Chef } from "config/constants/types";
import masterchefABI from "config/abi/externalMasterchef.json";
import { getExternalMasterChefAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";
import BigNumber from "bignumber.js";

export const fetchSushiFarmUserStakedBalances = async (account: string, farms) => {
  const masterChefAddress = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF);
  const masterChefV2Address = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF_V2);

  const calls = farms.map((farm) => {
    return {
      address: farm.chef === Chef.MASTERCHEF ? masterChefAddress : masterChefV2Address,
      name: "userInfo",
      params: [farm.pid, account],
    };
  });

  const rawStakedBalances = await multicall(masterchefABI, calls, ChainId.ETHEREUM);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  const parsedTotalRewards = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[2]._hex).toJSON();
  });
  return [parsedStakedBalances, parsedTotalRewards];
};

export const fetchSushiFarmUserEarnings = async (account: string, farms) => {
  const masterChefAddress = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF);
  const masterChefV2Address = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF_V2);

  const calls = farms.map((farm) => {
    return {
      address: farm.chef === Chef.MASTERCHEF ? masterChefAddress : masterChefV2Address,
      name: "pendingCake",
      params: [farm.pid, account],
    };
  });

  const rawEarnings = await multicall(masterchefABI, calls, ChainId.ETHEREUM);
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};
