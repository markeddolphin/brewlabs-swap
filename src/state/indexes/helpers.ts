import { BigNumber, ethers } from "ethers";
import { deserializeToken } from "state/user/hooks/helpers";
import { DeserializedIndex, SerializedIndex } from "./types";

export const transformUserData = (userData: any) => {
  return {
    allowance: userData?.allowance ?? false,
    ethBalance: userData?.ethBalance ? BigNumber.from(userData.ethBalance) : ethers.constants.Zero,
    indexNftItems: userData?.indexNftItems ?? [],
    deployerNftItem: userData?.deployerNftItem,
    stakedBalances: userData?.stakedBalances ? userData.stakedBalances.map((amount) => BigNumber.from(amount)) : [],
    stakedUsdAmount: userData?.stakedUsdAmount ?? "0",
    histories: userData?.histories ?? [],
  };
};
export const transformIndex = (pool: SerializedIndex): DeserializedIndex => {
  const { tokens, userData, ...rest } = pool;

  const _tokens = [];
  for (let i = 0; i < tokens.length; i++) {
    _tokens.push(deserializeToken(tokens[i]));
  }

  return {
    ...rest,
    tokens: _tokens,
    userData: transformUserData(userData),
  };
};
