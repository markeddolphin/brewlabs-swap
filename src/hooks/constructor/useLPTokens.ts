import { useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";

import PairABI from "config/abi/lpToken.json";
import { useFastRefreshEffect } from "hooks/useRefreshEffect";
import multicall from "utils/multicall";
import { getAddress } from "ethers/lib/utils.js";

export const useLPTokens = () => {
  const { address: account } = useAccount();
  // const account = "0xb101a10B7501788969CDb34afbB417175aA83682";
  // const account = "0xaE837FD1c51705F3f8f232910dfeCB9180541B27";

  const [ethLPTokens, setETHLPTokens] = useState(null);
  const [bscLPTokens, setBSCLpTokens] = useState(null);

  async function fetchLPInfo(data: any, chain: string) {
    const pairInfos = await Promise.all(
      data.map(async (data) => {
        const result = await axios.post("https://api.dex.guru/v3/tokens", {
          ids: [`${data.address}-${chain}`],
          limit: 1,
          network: chain,
        });
        const addresses = result.data.data[0].underlyingAddresses;
        let info = {
          pool_address: data.address,
          order: "desc",
          limit: 15,
          offset: 1,
          sort_by: "timestamp",
          token_status: "all",
          transaction_types: ["mint", "burn"],
          with_full_totals: false,
        };
        const response = await Promise.all([
          axios.post("https://api.dex.guru/v3/tokens", {
            ids: [`${addresses[0]}-${chain}`, `${addresses[1]}-${chain}`],
            limit: 2,
            network: chain,
          }),
          axios.post("https://api.dex.guru/v3/tokens/transactions/count", info),
        ]);
        const priceResult = response[0];
        const txCount = response[1].data.count;
        info.offset = 15 * Math.floor(txCount / 15);
        let lastTx: any = await axios.post("https://api.dex.guru/v3/tokens/transactions", info);
        const token0 = priceResult.data.data[0];
        const token1 = priceResult.data.data[1];
        const lpInfo = result.data.data[0];
        lastTx = lastTx.data.data;
        return {
          timeStamp: lastTx.length ? lastTx[lastTx.length - 1].timestamp : 0,
          address: getAddress(data.address),
          balance: data.balance,
          token0: {
            decimals: token0.decimals,
            symbol: token0.symbols[0],
            address: getAddress(token0.address),
            name: token0.name,
          },
          token1: {
            decimals: token1.decimals,
            symbol: token1.symbols[0],
            address: getAddress(token1.address),
            name: token1.name,
          },
          price: lpInfo.priceUSD,
          volume: lpInfo.volume24hUSD,
          chainId: chain === "eth" ? 1 : 56,
        };
      })
    );
    return pairInfos;
  }

  async function fetchLPTokens(chainId) {
    if (chainId === 1) {
      try {
        const result1 = await axios.get(`https://api.blockchain.info/v2/eth/data/account/${account}/tokens`);
        const nonZeroBalances = result1.data.tokenAccounts.filter(
          (data: any) => data.balance / 1 > 0 && data.tokenSymbol === "UNI-V2"
        );
        const addresses = nonZeroBalances.map((data) => {
          return {
            address: data.tokenHash,
            balance: data.balance / Math.pow(10, data.decimals),
          };
        });
        const info = await fetchLPInfo(addresses, "eth");
        setETHLPTokens(info);
      } catch (e) {
        console.log(e);
        setETHLPTokens([]);
      }
    } else if (chainId === 56) {
      try {
        let tokenBalances: any = await axios.post("https://pein-api.vercel.app/api/tokenController/getTokenBalances", {
          address: account,
          chainId,
        });
        tokenBalances = tokenBalances.data;
        let _lps = tokenBalances.filter((data) => data.symbol === "Cake-LP");
        _lps = await fetchLPInfo(_lps, "bsc");
        setBSCLpTokens(_lps);
      } catch (e) {
        console.log(e);
        setBSCLpTokens([]);
      }
    }
  }

  useFastRefreshEffect(() => {
    if (!account) return;
    fetchLPTokens(1);
    fetchLPTokens(56);
  }, [account]);

  return { ethLPTokens, bscLPTokens, fetchLPTokens };
};
