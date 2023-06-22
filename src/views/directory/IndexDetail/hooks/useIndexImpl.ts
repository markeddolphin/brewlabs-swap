import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useIndexContract } from "hooks/useContract";
import { useCallback } from "react";
import { useAppDispatch } from "state";
import {
  fetchIndexPublicDataAsync,
  updateUserBalance,
  updateUserDeployerNftInfo,
  updateUserIndexNftInfo,
  updateUserStakings,
} from "state/indexes";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";

const zapIn = async (indexContract, token, amount, percents, gasPrice) => {
  const value = parseEther(amount);
console.log('precomputeZapIn', token, percents.map((p) => (p * 100).toFixed(0)))
  const queries = await indexContract.precomputeZapIn(
    token,
    value,
    percents.map((p) => (p * 100).toFixed(0))
  );
  // if (token != ethers.constants.AddressZero && queries[0].adapters.length === 0) return;
console.log('zapIn queries', queries)
  let trades = [];
  for (let i = 0; i < queries.length; i++) {
    // if (queries[i].adapters.length === 0) return;

    trades.push([
      queries[i].amounts[0] ?? 0,
      queries[i].amounts[queries[i].amounts.length - 1] ?? 0,
      queries[i].path,
      queries[i].adapters,
    ]);
  }

  console.log('ZapIn estimating')
  let gasLimit = await indexContract.estimateGas.zapIn(
    token,
    value,
    percents.map((p) => (p * 100).toFixed(0)),
    trades,
    {
      value: token === ethers.constants.AddressZero ? value : 0,
    }
  );
  gasLimit = calculateGasMargin(gasLimit);
  console.log('ZapIn gasLimit', gasLimit)

  const tx = await indexContract.zapIn(
    token,
    value,
    percents.map((p) => (p * 100).toFixed(0)),
    trades,
    {
      gasPrice,
      gasLimit,
      value: token === ethers.constants.AddressZero ? value : 0,
    }
  );
  const receipt = await tx.wait();
  return receipt;
};

const claimTokens = async (indexContract, percent, gasPrice) => {
  let gasLimit = await indexContract.estimateGas.claimTokens(Math.floor(percent * 100));
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.claimTokens((percent * 100).toFixed(0), { gasPrice, gasLimit });
  const receipt = await tx.wait();
  return receipt;
};

const zapOut = async (indexContract, token, gasPrice) => {
  const queries = await indexContract.precomputeZapOut(token);
  // if (token != ethers.constants.AddressZero && queries[queries.length - 1].adapters.length === 0) return;

  let trades = [];
  for (let i = 0; i < queries.length; i++) {
    // if (queries[i].adapters.length === 0) return;

    trades.push([
      queries[i].amounts[0] ?? 0,
      queries[i].amounts[queries[i].amounts.length - 1] ?? 0,
      queries[i].path,
      queries[i].adapters,
    ]);
  }

  let gasLimit = await indexContract.estimateGas.zapOut(token, trades);
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.zapOut(token, trades, { gasPrice, gasLimit });
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

const mintDeployerNft = async (indexContract, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.mintDeployerNft({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.mintDeployerNft({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const stakeDeployerNft = async (indexContract, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.stakeDeployerNft({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.stakeDeployerNft({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const unstakeDeployerNft = async (indexContract, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.unstakeDeployerNft({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.unstakeDeployerNft({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const updateFeeWallet = async (indexContract, wallet, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.setFeeWallet(wallet, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.setFeeWallet(wallet, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const useIndexImpl = (pid, contractAddress, performanceFee) => {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useActiveWeb3React();
  const indexContract = useIndexContract(chainId, contractAddress);

  const handleZapIn = useCallback(
    async (token, amount, percents) => {
      console.log('ZapIn', amount, percents)
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await zapIn(indexContract, token, amount, percents, gasPrice);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid]
  );

  const handleZapOut = useCallback(
    async (token) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await zapOut(indexContract, token, gasPrice);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid]
  );

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

    dispatch(updateUserStakings(pid, account, chainId));
    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserIndexNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid, performanceFee]);

  const handleStakeNft = useCallback(
    async (tokenId) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await stakeNft(indexContract, tokenId, gasPrice, performanceFee);

      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      dispatch(updateUserIndexNftInfo(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid, performanceFee]
  );

  const handleMintDeployerNft = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await mintDeployerNft(indexContract, gasPrice, performanceFee);

    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserDeployerNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid, performanceFee]);

  const handleStaketDeployerNft = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await stakeDeployerNft(indexContract, gasPrice, performanceFee);

    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserDeployerNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid, performanceFee]);

  const handleUnstaketDeployerNft = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await unstakeDeployerNft(indexContract, gasPrice, performanceFee);

    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserDeployerNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid, performanceFee]);

  const handleUpdateFeeAddresss = useCallback(
    async (wallet) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await updateFeeWallet(indexContract, wallet, gasPrice, performanceFee);

      dispatch(updateUserBalance(account, chainId));
      dispatch(updateUserDeployerNftInfo(account, chainId));
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
    onMintDeployerNft: handleMintDeployerNft,
    onStakeDeployerNft: handleStaketDeployerNft,
    onUnstakeDeployerNft: handleUnstaketDeployerNft,
    onUpdateFeeAddress: handleUpdateFeeAddresss,
  };
};

export default useIndexImpl;
