import { useCallback } from "react";
import { ChainId } from "@brewlabs/sdk";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useMasterchef } from "hooks/useContract";
import { useAppDispatch } from "state";
import { updateFarmsUserData } from "state/farms";
import { BIG_ZERO } from "utils/bigNumber";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { calculateGasMargin } from "utils";

import { emergencyUnstakeFarm, harvestFarm, stakeFarm, unstakeFarm } from "./calls/farms";

const harvestReward = async (masterChefContract, pid, performanceFee, gasPrice) => {
  let gasLimit = await masterChefContract.estimateGas.claimReward(pid, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await masterChefContract.claimReward(pid, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const harvestDividend = async (masterChefContract, pid, performanceFee, gasPrice) => {
  let gasLimit = await masterChefContract.estimateGas.claimDividend(pid, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await masterChefContract.claimDividend(pid, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const compoundReward = async (masterChefContract, pid, performanceFee, gasPrice) => {
  let gasLimit = await masterChefContract.estimateGas.compoundReward(pid, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await masterChefContract.compoundReward(pid, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const compoundDividend = async (masterChefContract, pid, performanceFee, gasPrice) => {
  let gasLimit = await masterChefContract.estimateGas.compoundDividend(pid, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await masterChefContract.compoundDividend(pid, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const useFarm = (
  pid: number,
  farmId: number,
  chainId: ChainId,
  masterchef: string,
  performanceFee = "0",
  enableEmergencyWithdraw = false
) => {
  const dispatch = useAppDispatch();
  const { library } = useActiveWeb3React();
  const masterChefContract = useMasterchef(masterchef);

  const handleStake = useCallback(
    async (amount: string) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await stakeFarm(masterChefContract, pid, amount, performanceFee, gasPrice);

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: BIG_ZERO.toJSON() }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: BIG_ZERO.toJSON() }));
      return receipt;
    },
    [masterChefContract, pid, farmId, dispatch, chainId, library, performanceFee]
  );

  const handleUnstake = useCallback(
    async (amount: string) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let receipt;
      if (enableEmergencyWithdraw) {
        receipt = await emergencyUnstakeFarm(masterChefContract, pid, gasPrice);
      } else {
        receipt = await unstakeFarm(masterChefContract, pid, amount, performanceFee, gasPrice);
      }

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: BIG_ZERO.toJSON() }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: BIG_ZERO.toJSON() }));
      return receipt;
    },
    [masterChefContract, pid, farmId, enableEmergencyWithdraw, dispatch, chainId, library, performanceFee]
  );

  const handleHarvest = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    await harvestFarm(masterChefContract, pid, performanceFee, gasPrice);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: BIG_ZERO.toJSON() }));
    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: BIG_ZERO.toJSON() }));
  }, [pid, farmId, performanceFee, masterChefContract, dispatch, chainId, library]);

  const handleHarvestReward = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    await harvestReward(masterChefContract, pid, performanceFee, gasPrice);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: BIG_ZERO.toJSON() }));
  }, [pid, farmId, performanceFee, masterChefContract, dispatch, chainId, library]);

  const handleHarvestDividend = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    await harvestDividend(masterChefContract, pid, performanceFee, gasPrice);

    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: BIG_ZERO.toJSON() }));
  }, [pid, farmId, performanceFee, masterChefContract, dispatch, chainId, library]);

  const handleCompoundReward = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    await compoundReward(masterChefContract, pid, performanceFee, gasPrice);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: BIG_ZERO.toJSON() }));
  }, [pid, farmId, performanceFee, masterChefContract, dispatch, chainId, library]);

  const handleCompoundDividend = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    await compoundDividend(masterChefContract, pid, performanceFee, gasPrice);

    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: BIG_ZERO.toJSON() }));
  }, [pid, farmId, performanceFee, masterChefContract, dispatch, chainId, library]);

  return {
    onStake: handleStake,
    onUnstake: handleUnstake,
    onReward: handleHarvest,
    onHarvest: handleHarvest,
    onCompound: handleCompoundReward,
    onHarvestDividend: handleHarvestDividend,
    onCompoundDividend: handleCompoundDividend,
  };
};

export default useFarm;
