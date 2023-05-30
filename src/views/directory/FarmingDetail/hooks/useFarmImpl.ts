import { useCallback } from "react";
import { ChainId } from "@brewlabs/sdk";
import { ethers } from "ethers";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useFarmContract } from "hooks/useContract";
import { useAppDispatch } from "state";
import { updateFarmsUserData } from "state/farms";
import { calculateGasMargin } from "utils";
import { BIG_ZERO } from "utils/bigNumber";
import { getNetworkGasPrice } from "utils/getGasPrice";

const stakeFarm = async (farmContract, amount, performanceFee, gasPrice) => {
  const _amount = ethers.utils.parseEther(amount).toString();
  let gasLimit = await farmContract.estimateGas.deposit(_amount, {value: performanceFee});
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await farmContract.deposit(_amount, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const unstakeFarm = async (farmContract, amount, performanceFee, gasPrice) => {
  const _amount = ethers.utils.parseEther(amount).toString();

  let gasLimit = await farmContract.estimateGas.withdraw(_amount, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await farmContract.withdraw(_amount, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const emergencyUnstakeFarm = async (farmContract, gasPrice) => {
  let gasLimit = await farmContract.estimateGas.emergencyWithdraw();
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await farmContract.emergencyWithdraw({ gasPrice, gasLimit });
  const receipt = await tx.wait();
  return receipt;
};

const harvestReward = async (farmContract, performanceFee, gasPrice) => {
  let gasLimit = await farmContract.estimateGas.claimReward({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await farmContract.claimReward({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const harvestDividend = async (farmContract, performanceFee, gasPrice) => {
  let gasLimit = await farmContract.estimateGas.claimDividend({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await farmContract.claimDividend({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const compoundReward = async (farmContract, performanceFee, gasPrice) => {
  let gasLimit = await farmContract.estimateGas.compoundReward({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await farmContract.compoundReward({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const compoundDividend = async (farmContract, performanceFee, gasPrice) => {
  let gasLimit = await farmContract.estimateGas.compoundDividend({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await farmContract.compoundDividend({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const useFarmImpl = (
  pid: number,
  farmId: number,
  chainId: ChainId,
  contractAddress: string,
  performanceFee = "0",
  enableEmergencyWithdraw = false
) => {
  const dispatch = useAppDispatch();
  const { library } = useActiveWeb3React();
  const farmContract = useFarmContract(contractAddress);

  const handleStake = useCallback(
    async (amount: string) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await stakeFarm(farmContract, amount, performanceFee, gasPrice);

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: BIG_ZERO.toJSON() }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: BIG_ZERO.toJSON() }));
      return receipt;
    },
    [farmContract, pid, farmId, dispatch, chainId, library, performanceFee]
  );

  const handleUnstake = useCallback(
    async (amount: string) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let receipt;
      if (enableEmergencyWithdraw) {
        receipt = await emergencyUnstakeFarm(farmContract, gasPrice);
      } else {
        receipt = await unstakeFarm(farmContract, amount, performanceFee, gasPrice);
      }

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: BIG_ZERO.toJSON() }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: BIG_ZERO.toJSON() }));
      return receipt;
    },
    [farmContract, pid, farmId, enableEmergencyWithdraw, dispatch, chainId, library, performanceFee]
  );

  const handleHarvestReward = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    await harvestReward(farmContract, performanceFee, gasPrice);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: BIG_ZERO.toJSON() }));
  }, [pid, farmId, performanceFee, farmContract, dispatch, chainId, library]);

  const handleHarvestDividend = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    await harvestDividend(farmContract, performanceFee, gasPrice);

    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: BIG_ZERO.toJSON() }));
  }, [pid, farmId, performanceFee, farmContract, dispatch, chainId, library]);

  const handleCompoundReward = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    await compoundReward(farmContract, performanceFee, gasPrice);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: BIG_ZERO.toJSON() }));
  }, [pid, farmId, performanceFee, farmContract, dispatch, chainId, library]);

  const handleCompoundDividend = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    await compoundDividend(farmContract, performanceFee, gasPrice);

    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: BIG_ZERO.toJSON() }));
  }, [pid, farmId, performanceFee, farmContract, dispatch, chainId, library]);

  return {
    onStake: handleStake,
    onUnstake: handleUnstake,
    onHarvest: handleHarvestReward,
    onCompound: handleCompoundReward,
    onHarvestDividend: handleHarvestDividend,
    onCompoundDividend: handleCompoundDividend,
  };
};

export default useFarmImpl;
