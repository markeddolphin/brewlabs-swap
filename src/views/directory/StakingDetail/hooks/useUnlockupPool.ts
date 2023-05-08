import { useCallback } from "react";
import { useSingleStaking } from "hooks/useContract";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import {
  updateUserStakedBalance,
  updateUserBalance,
  resetPendingReflection,
  updateUserPendingReward,
} from "state/pools";
import { updatePoolsUserData } from "state/pools";
import { calculateGasMargin } from "utils";
import { BIG_TEN, BIG_ZERO } from "utils/bigNumber";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { ethers } from "ethers";
import { forceGasLimits } from "config/constants/pools";

const stake = async (stakingContract, amount, decimals, performanceFee, gasPrice) => {
  const _amount = ethers.utils.parseUnits(amount, decimals);
  let gasLimit = await stakingContract.estimateGas.deposit(_amount, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.deposit(_amount, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const unstake = async (
  stakingContract: any,
  amount: string,
  decimals: number,
  performanceFee,
  gasPrice,
  forceGasLimit = "0"
) => {
  const _amount = ethers.utils.parseUnits(amount, decimals);

  let gasLimit = await stakingContract.estimateGas.withdraw(_amount, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);
  if (forceGasLimit !== "0") gasLimit = forceGasLimit;

  const tx = await stakingContract.withdraw(_amount, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const emergencyUnstake = async (stakingContract: any, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.emergencyWithdraw();
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.emergencyWithdraw({ gasPrice, gasLimit });
  const receipt = await tx.wait();
  return receipt;
};

const harvestPool = async (stakingContract, performanceFee, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.claimReward({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.claimReward({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const harvestDividend = async (stakingContract, performanceFee, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.claimDividend({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.claimDividend({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const compoundPool = async (stakingContract, performanceFee, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.compoundReward({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.compoundReward({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const compoundDividend = async (stakingContract, performanceFee, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.compoundDividend({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.compoundDividend({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const useUnlockupPool = (sousId: number, contractAddress, performanceFee = "0", enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useActiveWeb3React();

  const stakingContract = useSingleStaking(chainId, contractAddress);

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await stake(stakingContract, amount, decimals, performanceFee, gasPrice);

      dispatch(updatePoolsUserData({ sousId, field: "earnings", value: BIG_ZERO.toJSON() }));
      dispatch(resetPendingReflection(sousId));
      dispatch(updateUserStakedBalance(sousId, account, chainId));
      dispatch(updateUserBalance(sousId, account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, stakingContract, sousId, performanceFee]
  );

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let receipt;
      if (enableEmergencyWithdraw) {
        receipt = await emergencyUnstake(stakingContract, gasPrice);
      } else {
        receipt = await unstake(stakingContract, amount, decimals, performanceFee, gasPrice, forceGasLimits[sousId]);
      }

      dispatch(resetPendingReflection(sousId));
      dispatch(updatePoolsUserData({ sousId, field: "earnings", value: BIG_ZERO.toJSON() }));
      dispatch(updateUserStakedBalance(sousId, account, chainId));
      dispatch(updateUserBalance(sousId, account, chainId));
      dispatch(updateUserPendingReward(sousId, account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, enableEmergencyWithdraw, stakingContract, sousId, performanceFee]
  );

  const handleHarvest = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await harvestPool(stakingContract, performanceFee, gasPrice);

    dispatch(updatePoolsUserData({ sousId, field: "earnings", value: BIG_ZERO.toJSON() }));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, stakingContract, sousId, performanceFee]);

  const handleHarvestDividend = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await harvestDividend(stakingContract, performanceFee, gasPrice);

    dispatch(resetPendingReflection(sousId));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, stakingContract, sousId, performanceFee]);

  const handleCompound = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await compoundPool(stakingContract, performanceFee, gasPrice);

    dispatch(updatePoolsUserData({ sousId, field: "earnings", value: BIG_ZERO.toJSON() }));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserStakedBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, stakingContract, sousId, performanceFee]);

  const handleCompoundDividend = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await compoundDividend(stakingContract, performanceFee, gasPrice);

    dispatch(resetPendingReflection(sousId));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserStakedBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, stakingContract, sousId, performanceFee]);

  return {
    onStake: handleStake,
    onUnstake: handleUnstake,
    onReward: handleHarvest,
    onCompound: handleCompound,
    onDividend: handleHarvestDividend,
    onCompoundDividend: handleCompoundDividend,
  };
};

export default useUnlockupPool;
