import { useCallback } from "react";
import useActiveWeb3React from "@hooks/useActiveWeb3React";
import { useFarmFactoryContract } from "@hooks/useContract";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";

export const useFactory = (chainId, performanceFee) => {
  const { library } = useActiveWeb3React();
  const factoryContract = useFarmFactoryContract(chainId);

  const handleCreate = useCallback(
    async (
      lpToken: string,
      rewardToken: string,
      dividendToken: string,
      rewardPerBlock: string,
      depositFee: number,
      withdrawFee: number,
      duration: number,
      hasDividend: boolean
    ) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let gasLimit = await factoryContract.estimateGas.createBrewlabsFarm(
        lpToken,
        rewardToken,
        dividendToken,
        rewardPerBlock,
        depositFee,
        withdrawFee,
        duration,
        hasDividend,
        { value: performanceFee, gasPrice }
      );
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await factoryContract.createBrewlabsFarm(
        lpToken,
        rewardToken,
        dividendToken,
        rewardPerBlock,
        depositFee,
        withdrawFee,
        duration,
        hasDividend,
        { value: performanceFee, gasPrice, gasLimit }
      );
      const receipt = await tx.wait();

      return receipt;
    },
    [factoryContract, chainId, library, performanceFee]
  );

  return {
    onCreate: handleCreate,
  };
};
