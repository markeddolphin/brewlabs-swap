import { useCallback } from "react";
import { parseUnits } from "ethers/lib/utils";
import { useLockupStaking } from "hooks/useContract";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import {
  resetPendingReflection,
  updatePoolsUserData,
  updateUserBalance,
  updateUserPendingReward,
  updateUserStakedBalance,
} from "state/pools";
import { BIG_ZERO } from "utils/bigNumber";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { calculateGasMargin } from "utils";

const stake = async (stakingContract, type, amount, decimals, performanceFee, gasPrice) => {
  const units = parseUnits(amount, decimals);
  let gasLimit = await stakingContract.estimateGas.deposit(units.toString(), type, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.deposit(units.toString(), type, {
    gasPrice,
    gasLimit,
    value: performanceFee,
  });
  const receipt = await tx.wait();
  return receipt;
};

const unstake = async (stakingContract, type, amount, decimals, performanceFee, gasPrice) => {
  const units = parseUnits(amount, decimals);

  let gasLimit = await stakingContract.estimateGas.withdraw(units.toString(), type, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.withdraw(units.toString(), type, {
    gasPrice,
    gasLimit,
    value: performanceFee,
  });
  const receipt = await tx.wait();
  return receipt;
};

const emergencyUnstake = async (stakingContract, type, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.emergencyWithdraw(type);
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.emergencyWithdraw(type, { gasPrice, gasLimit });
  const receipt = await tx.wait();
  return receipt;
};

const harvestPool = async (stakingContract, type, performanceFee, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.claimReward(type, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.claimReward(type, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const harvestDividend = async (stakingContract, type, performanceFee, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.claimDividend(type, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.claimDividend(type, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const compoundPool = async (stakingContract, type, performanceFee, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.compoundReward(type, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.compoundReward(type, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const compoundDividend = async (stakingContract, type, performanceFee, gasPrice) => {
  let gasLimit = await stakingContract.estimateGas.compoundDividend(type, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await stakingContract.compoundDividend(type, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const useLockupPool = (sousId, contractAddress, type, performanceFee = "0", enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useActiveWeb3React();
  const stakingContract = useLockupStaking(chainId, contractAddress);

  const handleStake = useCallback(
    async (amount, decimals) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await stake(stakingContract, type, amount, decimals, performanceFee, gasPrice);

      dispatch(resetPendingReflection(sousId));
      dispatch(updatePoolsUserData({ sousId, field: "earnings", value: BIG_ZERO.toJSON() }));
      dispatch(updateUserPendingReward(sousId, account, chainId));
      dispatch(updateUserBalance(sousId, account, chainId));
      dispatch(updateUserStakedBalance(sousId, account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, stakingContract, sousId, type, performanceFee]
  );

  const handleUnStake = useCallback(
    async (amount, decimals) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let receipt;
      if (enableEmergencyWithdraw) {
        receipt = await emergencyUnstake(stakingContract, type, gasPrice);
      } else {
        receipt = await unstake(stakingContract, type, amount, decimals, performanceFee, gasPrice);
      }

      dispatch(resetPendingReflection(sousId));
      dispatch(updatePoolsUserData({ sousId, field: "earnings", value: BIG_ZERO.toJSON() }));
      dispatch(updateUserPendingReward(sousId, account, chainId));
      dispatch(updateUserBalance(sousId, account, chainId));
      dispatch(updateUserStakedBalance(sousId, account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, stakingContract, sousId, type, performanceFee, enableEmergencyWithdraw]
  );

  const handleHarvest = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await harvestPool(stakingContract, type, performanceFee, gasPrice);

    dispatch(updatePoolsUserData({ sousId, field: "earnings", value: BIG_ZERO.toJSON() }));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, stakingContract, sousId, type, performanceFee]);

  const handleHarvestDividend = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await harvestDividend(stakingContract, type, performanceFee, gasPrice);

    dispatch(resetPendingReflection(sousId));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, stakingContract, sousId, type, performanceFee]);

  const handleCompound = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await compoundPool(stakingContract, type, performanceFee, gasPrice);

    dispatch(updatePoolsUserData({ sousId, field: "earnings", value: BIG_ZERO.toJSON() }));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserStakedBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, stakingContract, sousId, type, performanceFee]);

  const handleCompoundDividend = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await compoundDividend(stakingContract, type, performanceFee, gasPrice);

    dispatch(resetPendingReflection(sousId));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserStakedBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, stakingContract, sousId, type, performanceFee]);

  return {
    onStake: handleStake,
    onUnStake: handleUnStake,
    onReward: handleHarvest,
    onCompound: handleCompound,
    onDividend: handleHarvestDividend,
    onCompoundDividend: handleCompoundDividend,
  };
};

export default useLockupPool;
