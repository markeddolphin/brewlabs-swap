import { parseEther } from "ethers/lib/utils";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useIndexContract } from "hooks/useContract";
import { useCallback } from "react";
import { useAppDispatch } from "state";
import { fetchIndexPublicDataAsync, updateUserBalance, updateUserStakings } from "state/indexes";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";

const zapIn = async (indexContract, amount, percents, gasPrice) => {
  const value = parseEther(amount);
  let gasLimit = await indexContract.estimateGas.zapIn(
    percents.map((p) => Math.floor(p * 100)),
    { value }
  );
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.zapIn(
    percents.map((p) => p * 100),
    { gasPrice, gasLimit, value }
  );
  const receipt = await tx.wait();
  return receipt;
};

const claimTokens = async (indexContract, percent, gasPrice) => {
  let gasLimit = await indexContract.estimateGas.claimTokens(Math.floor(percent * 100));
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.claimTokens(Math.floor(percent * 100), { gasPrice, gasLimit });
  const receipt = await tx.wait();
  return receipt;
};

const zapOut = async (indexContract, gasPrice) => {
  let gasLimit = await indexContract.estimateGas.zapOut();
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.zapOut({ gasPrice, gasLimit });
  const receipt = await tx.wait();
  return receipt;
};

const mintNft = async (indexContract, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.mintNft({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.mintNft({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const stakeNft = async (indexContract, tokenId, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.stakeNft(tokenId, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.stakeNft(tokenId, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const useIndex = (pid, contractAddress, performanceFee) => {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useActiveWeb3React();
  const indexContract = useIndexContract(chainId, contractAddress);

  const handleZapIn = useCallback(
    async (amount, percents) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await zapIn(indexContract, amount, percents, gasPrice);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid]
  );

  const handleZapOut = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await zapOut(indexContract, gasPrice);

    dispatch(fetchIndexPublicDataAsync(pid));
    dispatch(updateUserStakings(pid, account, chainId));
    dispatch(updateUserBalance(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid]);

  const handleClaim = useCallback(
    async (percent) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await claimTokens(indexContract, percent, gasPrice);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid]
  );

  const handleMintNft = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await mintNft(indexContract, gasPrice, performanceFee);

    dispatch(fetchIndexPublicDataAsync(pid));
    dispatch(updateUserStakings(pid, account, chainId));
    dispatch(updateUserBalance(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid, performanceFee]);

  const handleStakeNft = useCallback(
    async (tokenId) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await stakeNft(indexContract, tokenId, gasPrice, performanceFee);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid, performanceFee]
  );

  return {
    onZapIn: handleZapIn,
    onClaim: handleClaim,
    onZapOut: handleZapOut,
    onMintNft: handleMintNft,
    onStakeNft: handleStakeNft,
  };
};

export default useIndex;
