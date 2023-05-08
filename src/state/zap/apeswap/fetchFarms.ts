import erc20 from "config/abi/erc20.json";
import masterchefABI from "config/abi/masterape.json";
import externalMasterchefABI from "config/abi/externalMasterchef.json";
import BigNumber from "bignumber.js";
import { chunk } from "lodash";
import multicall from "utils/multicall";
import { Farm, FarmLpAprsType, LpTokenPrices } from "state/types";
import fetchFarmCalls, { fetchExternalCall } from "./fetchFarmCalls";
import cleanFarmData from "./cleanFarmData";

const fetchFarms = async (
  chainId: number,
  lpPrices: LpTokenPrices[],
  bananaPrice: BigNumber,
  farmsLpAprs: FarmLpAprsType,
  farmsConfig: Farm[]
) => {
  const farmIds = [];
  const farmCalls = farmsConfig.flatMap((farm) => {
    farmIds.push(farm.pid);
    return fetchFarmCalls(farm, chainId);
  });
  const externalCalls = farmsConfig.flatMap((farm) => fetchExternalCall(farm));
  const vals = await multicall([...masterchefABI, ...erc20], farmCalls, chainId);
  const externalVals = await multicall(externalMasterchefABI, externalCalls, chainId);
  const chunkSize = farmCalls.length / farmsConfig.length;
  const chunkedFarms = chunk(vals, chunkSize);
  return cleanFarmData(farmIds, chunkedFarms, externalVals, lpPrices, bananaPrice, farmsLpAprs, farmsConfig);
};

export default fetchFarms;
