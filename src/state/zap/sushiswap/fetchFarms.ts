import { AppId, Chef } from "config/constants/types";
import BigNumber from "bignumber.js";
import masterchefABI from "config/abi/externalMasterchef.json";
import multicall from "utils/multicall";
import { BIG_ZERO } from "utils/bigNumber";
import { getExternalMasterChefAddress } from "utils/addressHelpers";

const fetchFarms = async (chainId: number, farmsConfig) => {
  const masterChefAddress = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF);
  const masterChefV2Address = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF_V2);
  const masterChefCalls = farmsConfig.map((farm) => ({
    address: farm.chef === Chef.MASTERCHEF ? masterChefAddress : masterChefV2Address,
    name: "poolInfo",
    params: [farm.id],
  }));
  const masterChefMultiCallResult = await multicall(masterchefABI, masterChefCalls, chainId);
  return farmsConfig.map((farm, index) => {
    const info = masterChefMultiCallResult[index];
    const totalRewards = info ? new BigNumber(info.totalBoostedShare?._hex) : BIG_ZERO;
    const totalSupply = info ? new BigNumber(info.totalRewards?._hex) : BIG_ZERO;
    return {
      ...farm,
      totalSupply: totalSupply.toJSON(),
      totalRewards: totalRewards.toJSON(),
    };
  });
};

export default fetchFarms;
