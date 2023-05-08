import { useCallback } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import { updateUserAllowance } from "state/pools";
import { getNetworkGasPrice } from "utils/getGasPrice";
import {  useTokenContract } from "hooks/useContract";
import { ethers } from "ethers";

const useApprovePool = (tokenAddress, sousId, contractAddress) => {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useActiveWeb3React();

  const tokenContract = useTokenContract(tokenAddress);

  const handleApprove = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);

    const tx = await tokenContract.approve(contractAddress, ethers.constants.MaxUint256, { gasPrice });
    const receipt = await tx.wait();

    dispatch(updateUserAllowance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, contractAddress, sousId, tokenContract]);

  return { onApprove: handleApprove };
};

export default useApprovePool;
