import { ethers } from "ethers";

import IndexAbi from "config/abi/indexes/index.json";
import IndexNftAbi from "config/abi/indexes/indexNft.json";
import DeployerNftAbi from "config/abi/indexes/deployerNft.json";

import { MULTICALL_FETCH_LIMIT } from "config/constants";
import multicall from "utils/multicall";
import { simpleRpcProvider } from "utils/providers";

export const fetchUserStakings = async (account, chainId, indexes) => {
  const selectedIndexs = indexes.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedIndexs.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedIndexs.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      if (batch.length === 0) return;

      try {
        let calls = [];
        for (let pool of batch) {
          calls.push({
            address: pool.address,
            name: "userInfo",
            params: [account],
          });
        }

        const userStakes = await multicall(IndexAbi, calls, chainId);
        batch.forEach((pool, index) => {
          data.push({
            pid: pool.pid,
            stakedUsdAmount: ethers.utils.formatEther(userStakes[index].usdAmount),
            stakedBalances: userStakes[index].amounts.map((amount) => amount.toString()),
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );
  return data;
};

export const fetchUserNftAllowance = async (account, chainId, indexes) => {
  const selectedIndexs = indexes.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedIndexs.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedIndexs.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      if (batch.length === 0) return;

      try {
        let calls = [];
        for (let pool of batch) {
          calls.push(
            {
              address: pool.category === undefined ? pool.nft : pool.indexNft,
              name: "isApprovedForAll",
              params: [account, pool.address],
            }
          );
        }

        const allowances = await multicall(IndexNftAbi, calls, chainId);

        batch.forEach((pool, index) => {
          data.push({
            pid: pool.pid,
            allowance: allowances[index][0],
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );
  return data;
};

export const fetchUserBalance = async (account, chainId) => {
  const provider = simpleRpcProvider(chainId);
  if (!account || !provider) return "0";
  const ethBalance = await provider.getBalance(account);
  return ethBalance;
};

export const fetchUserIndexNftData = async (account, chainId, nftAddr) => {
  if (!nftAddr) return [];

  let calls = [{ address: nftAddr, name: "balanceOf", params: [account] }];
  const [balance] = await multicall(IndexNftAbi, calls, chainId);
  if (balance[0].eq(0)) return [];

  if (balance[0].gt(0)) {
    calls = [];
    for (let i = 0; i < balance[0].toNumber(); i++) {
      calls.push({ address: nftAddr, name: "tokenOfOwnerByIndex", params: [account, i] });
    }

    let tokenIds = [];
    const result = await multicall(IndexNftAbi, calls, chainId);
    for (let i = 0; i < balance[0].toNumber(); i++) {
      tokenIds.push(result[i][0].toNumber());
    }

    calls = tokenIds.map((tokenId) => ({ address: nftAddr, name: "getNftInfo", params: [tokenId] }));
    const nftInfo = await multicall(IndexNftAbi, calls, chainId);

    return tokenIds.map((tokenId, index) => {
      let level = nftInfo[index][0].toNumber();
      let usdAmount = ethers.utils.formatEther(nftInfo[index][2]);
      let amounts = nftInfo[index][1].map((amount) => amount.toString());
      return {
        tokenId,
        level,
        amounts,
        usdAmount,
        indexAddress: nftInfo[index][3] ?? "0x11ff513ED9770C2eB02655777EF55F123a17ec00",
      };
    });
  }
};

export const fetchUserDeployerNftData = async (account, chainId, nftAddr) => {
  if (!nftAddr) return [];

  let calls = [{ address: nftAddr, name: "balanceOf", params: [account] }];
  const [balance] = await multicall(DeployerNftAbi, calls, chainId);
  if (balance[0].eq(0)) return [];

  if (balance[0].gt(0)) {
    calls = [];
    for (let i = 0; i < balance[0].toNumber(); i++) {
      calls.push({ address: nftAddr, name: "tokenOfOwnerByIndex", params: [account, i] });
    }

    let tokenIds = [];
    const result = await multicall(DeployerNftAbi, calls, chainId);
    for (let i = 0; i < balance[0].toNumber(); i++) {
      tokenIds.push(result[i][0].toNumber());
    }

    calls = tokenIds.map((tokenId) => ({ address: nftAddr, name: "getIndexInfo", params: [tokenId] }));
    const indexInfo = await multicall(DeployerNftAbi, calls, chainId);

    return tokenIds.map((tokenId, index) => {
      let usdAmount = ethers.utils.formatEther(indexInfo[index][2]);
      let amounts = indexInfo[index][3].map((amount) => amount.toString());
      return {
        tokenId,
        amounts,
        usdAmount,
        indexAddress: indexInfo[index][0],
      };
    });
  }
};
