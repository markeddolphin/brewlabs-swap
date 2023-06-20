import { useCallback } from "react";
import useActiveWeb3React from "@hooks/useActiveWeb3React";
import { useIndexFactoryContract } from "@hooks/useContract";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";

export const useFactory = (chainId, performanceFee) => {
  const { library } = useActiveWeb3React();
  const factoryContract = useIndexFactoryContract(chainId);

  const handleCreate = useCallback(
    async (indexName: string, tokens: string[], fees: number[], commissionWallet: string, isPrivate = true) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let gasLimit = await factoryContract.estimateGas.createBrewlabsIndex(
        indexName,
        tokens,
        fees.map((fee) => Math.floor(fee * 100).toString()),
        commissionWallet,
        isPrivate,
        { value: performanceFee, gasPrice }
      );
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await factoryContract.createBrewlabsIndex(
        indexName,
        tokens,
        fees.map((fee) => Math.floor(fee * 100).toString()),
        commissionWallet,
        isPrivate,
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
