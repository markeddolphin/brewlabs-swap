import { ChainId } from "@brewlabs/sdk";
import masterChefABI from "config/abi/externalMasterchef.json";
import { multicallv2 } from "utils/multicall";
import { getExternalMasterChefAddress } from "utils/addressHelpers";
import { AppId } from "config/constants/types";

const masterChefAddress = getExternalMasterChefAddress(AppId.PANCAKESWAP);

const masterChefFarmCalls = (farm) => {
  const { pid } = farm;
  return pid || pid === 0
    ? {
        address: masterChefAddress,
        name: "poolInfo",
        params: [pid],
      }
    : null;
};

export const fetchExternalMasterChefData = async (farms) => {
  const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm));
  const masterChefAggregatedCalls = masterChefCalls.filter((masterChefCall) => masterChefCall !== null);
  const masterChefMultiCallResult = await multicallv2(ChainId.BSC_MAINNET, masterChefABI, masterChefAggregatedCalls);
  let masterChefChunkedResultCounter = 0;
  return masterChefCalls.map((masterChefCall) => {
    if (masterChefCall === null) {
      return null;
    }
    const data = masterChefMultiCallResult[masterChefChunkedResultCounter];
    masterChefChunkedResultCounter++;
    return data;
  });
};
