import axios from "axios";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";

import erc20 from "config/abi/erc20.json";
import masterchefABI from "config/abi/farm/masterchef.json";
import masterchefV2ABI from "config/abi/farm/masterchefV2.json";
import farmImplAbi from "config/abi/farm/farmImpl.json";

import { API_URL, MULTICALL_FETCH_LIMIT } from "config/constants";
import { SerializedFarmConfig, Version } from "config/constants/types";
import { BIG_ZERO } from "utils/bigNumber";
import { getBalanceNumber } from "utils/formatBalance";
import { sumOfArray } from "utils/functions";
import { simpleRpcProvider } from "utils/providers";
import multicall from "utils/multicall";

import { SerializedBigNumber, SerializedFarm } from "./types";

type PublicFarmData = {
  poolWeight: SerializedBigNumber;
  rewardPerBlock: SerializedBigNumber;
  multiplier: string;
  depositFee: string;
  withdrawFee: string;
  performanceFee: string;
  startBlock: number;
  endBlock?: number;
};

export const fetchFarm = async (farm: SerializedFarm): Promise<PublicFarmData> => {
  const { poolId, chainId } = farm;

  // Only make masterchef calls if farm has poolId
  let info;
  if (farm.version) {
    [info] =
      farm.poolId || farm.poolId === 0
        ? await multicall(
            masterchefV2ABI,
            [
              {
                address: farm.contractAddress,
                name: "poolInfo",
                params: [poolId],
              },
            ],
            chainId
          )
        : [null];
  } else {
    [info] =
      farm.poolId || farm.poolId === 0
        ? await multicall(
            masterchefABI,
            [
              {
                address: farm.contractAddress,
                name: "poolInfo",
                params: [poolId],
              },
            ],
            chainId
          )
        : [null, null, null];
  }

  const [totalAllocPoint, rewardPerBlock, startBlock] =
    farm.poolId || farm.poolId === 0
      ? await multicall(
          masterchefABI,
          [
            {
              address: farm.contractAddress,
              name: "totalAllocPoint",
            },
            {
              address: farm.contractAddress,
              name: "rewardPerBlock",
            },
            {
              address: farm.contractAddress,
              name: "startBlock",
            },
          ],
          chainId
        )
      : [null];

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
  const depositFee = info ? new BigNumber(info.depositFee) : BIG_ZERO;
  const withdrawFee = info ? new BigNumber(info.withdrawFee) : BIG_ZERO;
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO;

  let performanceFee = BIG_ZERO;
  if (farm.isServiceFee) {
    const [feeInfo] = await multicall(
      masterchefABI,
      [
        {
          address: farm.contractAddress,
          name: "performanceFee",
        },
      ],
      chainId
    );
    performanceFee = new BigNumber(feeInfo);
  }

  return {
    poolWeight: poolWeight.toJSON(),
    rewardPerBlock: rewardPerBlock ? new BigNumber(rewardPerBlock).toJSON() : BIG_ZERO.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}X`,
    depositFee: `${depositFee.dividedBy(100).toFixed(2)}`,
    withdrawFee: `${withdrawFee.dividedBy(100).toFixed(2)}`,
    performanceFee: performanceFee.toString(),
    startBlock: new BigNumber(info.startBlock ?? startBlock).toNumber(),
    endBlock: info.bonusEndBlock ? new BigNumber(info.bonusEndBlock).toNumber() : undefined,
  };
};

export const fetchFarms = async (farmsToFetch: SerializedFarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig);
      const serializedFarm = { ...farmConfig, ...farm };
      return serializedFarm;
    })
  );
  return data;
};

export const fetchTotalStakesForFarms = async (chainId, farmsToFetch: SerializedFarm[]) => {
  const filters = [];
  for (let i = 0; i < farmsToFetch.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = farmsToFetch.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const commonFarms = batch.filter((farm) => !farm.version || farm.version <= Version.V2);
        const compoundFarms = batch.filter((farm) => farm.version > Version.V2);

        const totalStakes = await multicall(
          erc20,
          commonFarms.map((farm) => ({
            address: farm.lpAddress,
            name: "balanceOf",
            params: [farm.contractAddress],
          })),
          chainId
        );

        if (totalStakes) {
          commonFarms.forEach((farm, index) => {
            data.push({ pid: farm.pid, totalStaked: ethers.utils.formatUnits(totalStakes[index][0], 18) });
          });
        }

        const v3TotalStakes = await multicall(
          masterchefV2ABI,
          compoundFarms
            .filter((f) => !f.category)
            .map((farm) => ({
              address: farm.contractAddress,
              name: "totalStaked",
              params: farm.category ? [] : [farm.poolId],
            })),
          chainId
        );

        if (v3TotalStakes) {
          compoundFarms
            .filter((f) => !f.category)
            .forEach((farm, index) => {
              data.push({
                pid: farm.pid,
                totalStaked: ethers.utils.formatUnits(v3TotalStakes[index][0], 18),
              });
            });
        }

        const v3ImplTotalStakes = await multicall(
          farmImplAbi,
          compoundFarms
            .filter((f) => f.category)
            .map((farm) => ({
              address: farm.contractAddress,
              name: "totalStaked",
              params: farm.category ? [] : [farm.poolId],
            })),
          chainId
        );

        if (v3ImplTotalStakes) {
          compoundFarms
            .filter((f) => f.category)
            .forEach((farm, index) => {
              data.push({
                pid: farm.pid,
                totalStaked: ethers.utils.formatUnits(v3ImplTotalStakes[index][0], 18),
              });
            });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchFarmTotalRewards = async (farm) => {
  let availableRewards, availableReflections;
  if (farm.pid > 10) {
    let calls = [
      {
        address: farm.contractAddress,
        name: "availableRewardTokens",
        params: [],
      },
      {
        address: farm.contractAddress,
        name: "availableDividendTokens",
        params: [],
      },
    ];
    [availableRewards, availableReflections] = await multicall(masterchefV2ABI, calls, farm.chainId);
  } else {
    let calls = [
      {
        address: farm.earningToken.address,
        name: "balanceOf",
        params: [farm.contractAddress],
      },
      {
        address:
          !farm.reflectionToken || farm.reflectionToken?.isNative
            ? farm.earningToken.address
            : farm.reflectionToken.address,
        name: "balanceOf",
        params: [farm.contractAddress],
      },
    ];
    [availableRewards, availableReflections] = await multicall(erc20, calls, farm.chainId);

    if (farm.reflectionToken?.isNative) {
      availableReflections = await simpleRpcProvider(farm.chainId).getBalance(farm.contractAddress);
      availableReflections = new BigNumber(availableReflections._hex);
    }
  }

  return {
    availableRewards: getBalanceNumber(availableRewards, farm.earningToken.decimals),
    availableReflections: farm.reflectionToken
      ? getBalanceNumber(availableReflections, farm.reflectionToken.decimals)
      : 0,
  };
};

export const fetchFarmFeeHistories = async (farm) => {
  let res;
  try {
    res = await axios.post(`${API_URL}/fee/single`, { type: "farm", id: farm.pid });
  } catch (e) {}
  if (!res.data) {
    return { performanceFees: [], stakedAddresses: [] };
  }
  const { performanceFees, stakedAddresses } = res.data;

  let _performanceFees = [],
    _stakedAddresses = [];
  const timeBefore24Hrs = Math.floor(new Date().setHours(new Date().getHours() - 24) / 1000);
  const curTime = Math.floor(new Date().getTime() / 1000);

  for (let t = timeBefore24Hrs; t <= curTime; t += 3600) {
    _performanceFees.push(sumOfArray(performanceFees.filter((v) => v.timestamp <= t).map((v) => v.value)));
    _stakedAddresses.push(sumOfArray(stakedAddresses.filter((v) => v.timestamp <= t).map((v) => v.value)));
  }

  return { performanceFees: _performanceFees, stakedAddresses: _stakedAddresses };
};
