import { useCallback } from "react";
import { ethers } from "ethers";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useTokenContract } from "hooks/useContract";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/farms";
import { getNetworkGasPrice } from "utils/getGasPrice";

const useApproveFarm = (tokenAddress, pid, contractAddress) => {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useActiveWeb3React();

  const tokenContract = useTokenContract(tokenAddress);

  const handleApprove = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);

    const tx = await tokenContract.approve(contractAddress, ethers.constants.MaxUint256, { gasPrice });
    const receipt = await tx.wait();

    dispatch(fetchFarmUserDataAsync({ account, chainId, pids: [pid] }));
    return receipt;
  }, [account, chainId, library, dispatch, contractAddress, pid, tokenContract]);

  return { onApprove: handleApprove };
};

export default useApproveFarm;
