import { useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";

import PairABI from "config/abi/lpToken.json";
import { useFastRefreshEffect } from "hooks/useRefreshEffect";
import multicall from "utils/multicall";

export const useLPTokens = () => {
  const {  address: account } = useAccount();

  const [ethLPTokens, setETHLPTokens] = useState(null);
  const [bscLPTokens, setBSCLpTokens] = useState(null);

  async function fetchPrice(address: any, chainID: number, resolution: number) {
    const to = Math.floor(Date.now() / 1000);
    const url = `https://api.dex.guru/v1/tradingview/history?symbol=${address}-${
      chainID === 56 ? "bsc" : "eth"
    }_USD&resolution=${resolution}&from=${to - 3600 * 24}&to=${to}`;
    let result: any = await axios.get(url);
    return result;
  }

  async function fetchLPTokens(chainId) {
    if (chainId === 1) {
      try {
        let response: any = await axios.post("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2", {
          query: `{
            user(id: "${account.toLowerCase()}") {
                liquidityPositions(first: 1000, where: {liquidityTokenBalance_gt: "0"}) {
                    pair {
                        token0 {
                            decimals
                            symbol
                            name
                            id
                          }
                          token1 {
                            decimals
                            name
                            symbol
                            id
                          }
                          id
                          createdAtTimestamp
                          totalSupply
                          reserve0
                          reserve1
                    }
                    liquidityTokenBalance
                  }
                }
          }`,
        });
        if (!response.data.data.user) {
          setETHLPTokens([]);
          return;
        }
        response = response.data.data.user.liquidityPositions;
        let _lpTokens = [];

        for (let i = 0; i < response.length; i++) {
          const filteredLP = ethLPTokens && ethLPTokens.find((data) => data.address === response[i].pair.id);

          _lpTokens.push({
            timeStamp: response[i].pair.createdAtTimestamp / 1,
            address: response[i].pair.id,
            reserve0: response[i].pair.reserve0 / 1,
            reserve1: response[i].pair.reserve1 / 1,
            totalSupply: response[i].pair.totalSupply / 1,
            balance: response[i].liquidityTokenBalance / 1,
            token0: {
              decimals: response[i].pair.token0.decimals,
              symbol: response[i].pair.token0.symbol,
              address: response[i].pair.token0.id,
              name: response[i].pair.token0.name,
            },
            token1: {
              decimals: response[i].pair.token1.decimals,
              symbol: response[i].pair.token1.symbol,
              address: response[i].pair.token1.id,
              name: response[i].pair.token1.name,
            },
            price: filteredLP ? filteredLP.price : 0,
            volume: filteredLP ? filteredLP.volume : 0,
            chainId: 1,
          });
        }

        setETHLPTokens(_lpTokens);
        const prices = await Promise.all(
          _lpTokens.map(async (data) => {
            const result = await fetchPrice(data.address, 1, 10);
            const price = result.data.c[result.data.c.length - 1];
            const volume = result.data.v;
            return { price, address: data.address, volume };
          })
        );

        for (let i = 0; i < _lpTokens.length; i++) {
          const filteredPrice = prices.find((data) => data.address === _lpTokens[i].address);
          let volume = 0;
          for (let j = 0; j < filteredPrice.volume; j++) volume += filteredPrice.volume[j];
          _lpTokens[i] = {
            ..._lpTokens[i],
            price: _lpTokens[i].price !== 0 ? _lpTokens[i].price : filteredPrice.price,
            volume,
          };
        }
        setETHLPTokens(_lpTokens);

        const result = await Promise.all(
          _lpTokens.map(async (data) => {
            if (data.price !== 0 || data.totalSupply === 0) return data;
            else {
              const prices = await Promise.all([
                fetchPrice(data.token0.address, 1, 10),
                fetchPrice(data.token1.address, 1, 10),
              ]);
              const token0Price = prices[0].data.c[prices[0].data.c.length - 1];
              const token1Price = prices[1].data.c[prices[1].data.c.length - 1];
              const price = (token0Price * data.reserve0 + token1Price * data.reserve1) / data.totalSupply;
              return { ...data, price, token0Price, token1Price };
            }
          })
        );
        setETHLPTokens(result);
      } catch (e) {
        console.log(e);
        setETHLPTokens([]);
      }
    } else if (chainId === 56) {
      try {
        let tokenBalances: any = await axios.post("https://pein-api.vercel.app/api/tokenController/getHTML", {
          url: `https://bsc-explorer-api.nodereal.io/api/token/getTokensByAddress?address=${account}&pageSize=0x64`,
        });
        tokenBalances = tokenBalances.data.result.data.erc20.details;
        let _lps = tokenBalances.filter((data) => data.tokenSymbol === "Cake-LP");

        const pairInfos = await Promise.all(
          _lps.map(async (data) => {
            const query = `{
              pairs(where: {id: "${data.tokenAddress}"}) {
                token0 {
                  decimals
                  id
                  name
                  symbol
                }
                token1 {
                  decimals
                  id
                  name
                  symbol
                }
                id
                timestamp
              }
            }`;
            const result = await axios.post("https://api.thegraph.com/subgraphs/name/bluesea321/pancakeswap-pair", {
              query,
            });
            return result.data.data.pairs[0];
          })
        );

        let _lpTokens = [];
        for (let i = 0; i < _lps.length; i++) {
          const filteredLP = bscLPTokens && bscLPTokens.find((data) => data.address === pairInfos[i].id);
          _lpTokens.push({
            timeStamp: pairInfos[i].timestamp / 1,
            address: pairInfos[i].id,
            reserve0: filteredLP ? filteredLP.reserve0 : 0,
            reserve1: filteredLP ? filteredLP.reserve1 : 0,
            totalSupply: filteredLP ? filteredLP.totalSupply : 0,
            balance: parseInt(_lps[i].tokenBalance) / Math.pow(10, _lps[i].tokenDecimals),
            token0: {
              decimals: pairInfos[i].token0.decimals,
              symbol: pairInfos[i].token0.symbol,
              address: pairInfos[i].token0.id,
              name: pairInfos[i].token0.name,
            },
            token1: {
              decimals: pairInfos[i].token1.decimals,
              symbol: pairInfos[i].token1.symbol,
              address: pairInfos[i].token1.id,
              name: pairInfos[i].token1.name,
            },
            price: filteredLP ? filteredLP.price : 0,
            volume: filteredLP ? filteredLP.volume : 0,
            chainId: 56,
          });
        }

        setBSCLpTokens(_lpTokens);
        _lpTokens = await Promise.all(
          _lpTokens.map(async (data) => {
            const calls = [
              {
                name: "totalSupply",
                address: data.address,
              },
              {
                name: "getReserves",
                address: data.address,
              },
            ];
            const result = await Promise.all([
              multicall(PairABI, calls, chainId),
              fetchPrice(data.address, chainId, 10),
              fetchPrice(data.token0.address, chainId, 10),
              fetchPrice(data.token1.address, chainId, 10),
            ]);
            const reserve0 = result[0][1]._reserve0 / Math.pow(10, data.token0.decimals);
            const reserve1 = result[0][1]._reserve1 / Math.pow(10, data.token1.decimals);
            const totalSupply = result[0][0][0] / Math.pow(10, 18);
            let volume = 0;
            const pairResult = result[1].data.v;
            for (let i = 0; i < pairResult; i++) volume += pairResult[i];
            const token0Price = result[2].data.c[result[2].data.c.length - 1];
            const token1Price = result[3].data.c[result[3].data.c.length - 1];
            const price = (token0Price * reserve0 + token1Price * reserve1) / totalSupply;
            return {
              ...data,
              reserve0,
              reserve1,
              totalSupply,
              token0Price,
              token1Price,
              price,
              volume,
            };
          })
        );
        setBSCLpTokens(_lpTokens);
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
