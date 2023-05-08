import BigNumber from "bignumber.js";
import { SerializedDeposit } from "state/types";
import { deserializeToken } from "state/user/hooks/helpers";
import { BIG_ZERO } from "utils/bigNumber";
import { DeserializedPool, SerializedPool } from "./types";

type UserData =
  | DeserializedPool["userData"]
  | {
      allowance: number | string;
      stakingTokenBalance: number | string;
      stakedBalance: number | string;
      lockedBalance: number | string;
      earnings: number | string;
      reflections: number[] | string[];
      deposits: SerializedDeposit[];
    };

export const transformUserData = (userData: UserData) => {
  const reflections = [];
  for (let i = 0; i < userData?.reflections?.length; i++) {
    reflections.push(userData?.reflections?.[i] ? new BigNumber(userData.reflections[i]) : BIG_ZERO);
  }
  const deposits = [];
  for (let i = 0; i < userData?.deposits?.length; i++) {
    deposits.push({
      ...userData.deposits[i],
      amount: new BigNumber(userData.deposits[i].amount),
    });
  }

  return {
    allowance: userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    lockedBalance: userData?.lockedBalance ? new BigNumber(userData.lockedBalance) : BIG_ZERO,
    earnings: userData?.earnings ? new BigNumber(userData.earnings) : BIG_ZERO,
    reflections,
    deposits,
  };
};

export const transformPool = (pool: SerializedPool): DeserializedPool => {
  const { totalStaked, stakingLimit, userData, stakingToken, earningToken, reflection, reflectionTokens, ...rest } =
    pool;

  const _reflectionTokens = [];
  for (let i = 0; i < reflectionTokens.length; i++) {
    _reflectionTokens.push(deserializeToken(reflectionTokens[i]));
  }

  return {
    ...rest,
    reflection,
    stakingToken: deserializeToken(stakingToken),
    earningToken: deserializeToken(earningToken),
    reflectionTokens: _reflectionTokens,
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
    performanceFee: pool.performanceFee,
  };
};
