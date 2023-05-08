import { useCallback } from "react";
import { Chef } from "config/constants/types";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useExternalMasterchef } from "hooks/useContract";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { RewardType } from "../types";

const harvestFarm = async (
  masterChefContract: any,
  pid: number,
  reward: string,
  performanceFee: string,
  gasPrice: string
) => {
  let gasLimit = await masterChefContract.estimateGas.zapOut(pid, "0", reward, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await masterChefContract.zapOut(pid, "0", reward, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt.status;
};

const useHarvestFarm = (chef = Chef.MASTERCHEF, pid: number, earningTokens: string[]) => {
  const { library, chainId } = useActiveWeb3React();
  const masterChefContract = useExternalMasterchef(true, chef);

  const handleHarvest = useCallback(
    async (rewardType: RewardType) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const performanceFee = await masterChefContract.feeAmount();
      await harvestFarm(masterChefContract, pid, earningTokens[rewardType], performanceFee, gasPrice);
    },
    [pid, masterChefContract, chainId, library, earningTokens]
  );

  return {
    onReward: handleHarvest,
  };
};

export default useHarvestFarm;
