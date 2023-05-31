/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { WNATIVE } from "@brewlabs/sdk";
import { useAccount, useSigner } from "wagmi";

import ERC20ABI from "config/abi/erc20.json";
import claimableTokenAbi from "config/abi/claimableToken.json";
import dividendTrackerAbi from "config/abi/dividendTracker.json";

import prices from "config/constants/prices";
import { customTokensForDeploy } from "config/constants/tokens";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useDailyRefreshEffect, useSlowRefreshEffect } from "hooks/useRefreshEffect";
import useWalletNFTs from "hooks/useWalletNFTs";
import { getContract, getDividendTrackerContract, getMulticallContract } from "utils/contractHelpers";
import multicall from "utils/multicall";
import { getNativeSybmol } from "lib/bridge/helpers";

const DashboardContext: any = React.createContext({
  tokens: [],
  priceHistory: [],
  marketHistory: [],
  tokenList: [],
  nfts: [],
  pending: false,
  selectedDeployer: "",
  viewType: 0,
  setViewType: () => {},
  setSelectedDeployer: () => {},
  setPending: () => {},
});

const apiKeyList = [
  "82fc55c0-9833-4d12-82bb-48ae9748bead",
  "10760947-8c9a-4a18-b20f-2be694baf496",
  "4853da0a-f79f-4714-a915-d683b8168e1e",
  "4f616412-ca6d-4876-9a94-dac14e142b12",
];

const tokenList_URI: any = {
  1: "https://tokens.coingecko.com/ethereum/all.json",
  56: "https://tokens.coingecko.com/binance-smart-chain/all.json",
  137: "https://tokens.coingecko.com/polygon-pos/all.json",
  250: "https://tokens.coingecko.com/fantom/all.json",
  43114: "https://tokens.coingecko.com/avalanche/all.json",
  42161: "https://tokens.coingecko.com/arbitrum-one/all.json",
  25: "https://tokens.coingecko.com/cronos/all.json",
};

const WETH_ADDR = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

let temp_addr: any, temp_id: any;
const DashboardContextProvider = ({ children }: any) => {
  const { address } = useAccount();
  const { chainId } = useActiveChainId();
  const { data: signer }: any = useSigner();

  const [tokens, setTokens] = useState([]);
  const [marketHistory, setMarketHistory] = useState([]);
  const [pending, setPending] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedDeployer, setSelectedDeployer] = useState("");
  const [viewType, setViewType] = useState(0);

  const nfts = useWalletNFTs(address);

  temp_addr = address;
  temp_id = chainId;

  const fetchTokenBaseInfo = async (address: any, type = "name symbol decimals", accountAddress: string = null) => {
    let calls: any = [];
    const splitList = type === "" ? [] : type.split(" ");
    for (let i = 0; i < splitList.length; i++)
      calls.push({
        address: address,
        name: splitList[i],
      });
    if (accountAddress)
      calls.push({
        address: address,
        name: "balanceOf",
        params: [accountAddress],
      });
    const result = await multicall(ERC20ABI, calls, chainId);
    return result;
  };

  const isScamToken = async (token: any) => {
    let isScam = false;
    if (!token.name.includes("_Tracker")) {
      try {
        if (signer && token.address !== WETH_ADDR) {
          const tokenContract = getContract(chainId, token.address, ERC20ABI, signer);
          await tokenContract.estimateGas.transfer("0x2170Ed0880ac9A755fd29B2688956BD959F933F8", 1);
        }
      } catch (error) {
        isScam = true;
      }
    }
    return isScam;
  };

  async function fetchPrice(address: any, chainID: number, resolution: number) {
    const to = Math.floor(Date.now() / 1000);
    const url = `https://api.dex.guru/v1/tradingview/history?symbol=${
      address === WETH_ADDR || !address ? WNATIVE[chainID].address : address
    }-${chainID === 56 ? "bsc" : "eth"}_USD&resolution=${resolution}&from=${to - 3600 * 24}&to=${to}`;
    let result: any = await axios.get(url);
    return result;
  }

  async function fetchPrices() {
    let data: any;

    data = await Promise.all(
      prices.map(async (data: any) => {
        const tokenInfo = await fetchPrice(data.address, data.chainId, 60);

        const serializedToken = { ...data, history: tokenInfo.data.c };
        return serializedToken;
      })
    );

    setPriceHistory(data);
    return data;
  }

  const fetchTokenInfo = async (token: any) => {
    try {
      let reward = {
          pendingRewards: 0,
          totalRewards: 0,
          symbol: "",
        },
        isReward = false,
        balance = token.balance;

      let priceBalanceResult: any = await Promise.all([
        fetchPrice(token.address, chainId, 10),
        token.address === WETH_ADDR ? 0 : fetchTokenBaseInfo(token.address, "", address),
      ]);
      let result = priceBalanceResult[0];
      balance = token.address === WETH_ADDR ? balance : priceBalanceResult[1][0][0] / Math.pow(10, token.decimals);
      try {
        let calls = [
          {
            address: token.address,
            name: "dividendTracker",
            params: [],
          },
        ];
        const claimableResult = await multicall(claimableTokenAbi, calls, chainId);
        const dividendTracker = claimableResult[0][0];
        if (token.address === "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase()) console.log(balance);
        let rewardToken: any,
          pendingRewards = 0,
          totalRewards = 0;
        try {
          const dividendTrackerContract = getDividendTrackerContract(chainId, dividendTracker);
          const rewardTokenAddress = await dividendTrackerContract.rewardToken();
          const rewardTokenBaseinfo = await fetchTokenBaseInfo(rewardTokenAddress);
          rewardToken = {
            address: rewardTokenAddress,
            name: rewardTokenBaseinfo[0][0],
            symbol: rewardTokenBaseinfo[1][0],
            decimals: rewardTokenBaseinfo[2][0],
          };
        } catch (e) {
          rewardToken = {
            address: "0x0",
            name: getNativeSybmol[chainId],
            symbol: getNativeSybmol[chainId],
            decimals: 18,
          };
        }
        calls = [
          {
            address: dividendTracker,
            name: "withdrawableDividendOf",
            params: [address],
          },
          {
            address: dividendTracker,
            name: "withdrawnDividendOf",
            params: [address],
          },
        ];
        const rewardResult = await multicall(dividendTrackerAbi, calls, chainId);
        pendingRewards = rewardResult[0][0];
        totalRewards = rewardResult[1][0];
        reward.pendingRewards =
          pendingRewards / Math.pow(10, token.name.toLowerCase() === "brewlabs" ? 18 : rewardToken.decimals);
        reward.totalRewards =
          totalRewards / Math.pow(10, token.name.toLowerCase() === "brewlabs" ? 18 : rewardToken.decimals);
        reward.symbol = rewardToken.symbol;
        isReward = true;
      } catch (e) {}

      let scamResult: any = await Promise.all([await isScamToken(token)]);
      scamResult = scamResult[0];

      return {
        priceList: result.data ? result.data.c : token.priceList,
        price: result.data ? result.data.c[result.data.c.length - 1] : token.price,
        reward,
        isScam: scamResult !== undefined ? scamResult : token.isScam,
        isReward,
        balance,
      };
    } catch (error) {
      console.log(error);
      return token;
    }
  };

  const fetchTokenInfos = async (tokens: []) => {
    let data: any;

    data = await Promise.all(
      tokens.map(async (data: any) => {
        const tokenInfo = await fetchTokenInfo(data);
        if (tokenInfo.name === "Wrapped ETH") console.log(tokenInfo);
        const serializedToken = { ...data, ...tokenInfo, balance: tokenInfo.balance };
        return serializedToken;
      })
    );
    return data;
  };

  async function fetchTokenBalances() {
    let ethBalance = 0;
    const multicallContract = getMulticallContract(chainId);
    ethBalance = await multicallContract.getEthBalance(address);
    let data: any = [];
    if (chainId === 1) {
      const result = await axios.get(`https://api.blockchain.info/v2/eth/data/account/${address}/tokens`);
      const nonZeroBalances = result.data.tokenAccounts.filter((data: any) => data.balance / 1 > 0);
      data = await Promise.all(
        nonZeroBalances.map(async (token: any) => {
          const data = await Promise.all([fetchTokenBaseInfo(token.tokenHash, "name")]);
          return {
            address: token.tokenHash,
            balance: token.balance / Math.pow(10, token.decimals),
            decimals: token.decimals,
            name: data[0][0][0],
            symbol: token.tokenSymbol,
            price: 0,
            priceList: [0],
          };
        })
      );
    } else if (chainId === 56) {
      data = await axios.post("https://pein-api.vercel.app/api/tokenController/getTokenBalances", { address, chainId });
      data = data.data;
    }
    data.push({
      address: WETH_ADDR,
      balance: ethBalance / Math.pow(10, 18),
      decimals: 18,
      name: chainId === 1 ? "Ethereum" : "Binance",
      symbol: chainId === 1 ? "ETH" : "BNB",
      price: 0,
      priceList: [0],
    });
    return data;
  }
  async function fetchTokens() {
    try {
      const items: any = await fetchTokenBalances();
      let _tokens: any = [];

      for (let i = 0; i < items.length; i++) {
        const filter = tokens.filter((data) => data.address.toLowerCase() === items[i].address.toLowerCase());
        _tokens.push({
          balance: filter.length ? filter[0].balance : items[i].balance,
          name: items[i].name,
          symbol: items[i].symbol,
          decimals: items[i].decimals,
          address: items[i].address.toLowerCase(),
          price: filter.length ? filter[0].price : items[i].price,
          priceList: filter.length ? filter[0].priceList : items[i].priceList,
          reward: {
            totalRewards: filter.length ? filter[0].reward.totalRewards : 0,
            pendingRewards: filter.length ? filter[0].reward.pendingRewards : 0,
            symbol: filter.length ? filter[0].reward.symbol : "",
          },
          isScam: filter.length ? filter[0].isScam : false,
          isReward: filter.length ? filter[0].isReward : false,
        });
      }

      if (!temp_addr || temp_addr !== address || temp_id !== chainId) return;
      setTokens(_tokens);
      let tokenInfos: any = await fetchTokenInfos(_tokens);
      if (!temp_addr || temp_addr !== address || temp_id !== chainId) return;

      setTokens(tokenInfos);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMarketInfo() {
    let i;
    for (i = 0; i < apiKeyList.length; i++) {
      try {
        const response = await fetch(new Request("https://api.livecoinwatch.com/overview/history"), {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": apiKeyList[i],
          }),
          body: JSON.stringify({
            currency: "USD",
            start: Date.now() - 1000 * 3600 * 24,
            end: Date.now(),
          }),
        });
        let result = await response.json();
        let temp: any = [];
        for (let i = 0; i < result.length; i++) {
          temp.push(result[i].cap);
        }
        setMarketHistory(temp);
        break;
      } catch (error) {
        console.log(error);
      }
    }
    if (i === apiKeyList.length) {
      setMarketHistory([]);
    }
  }

  async function fetchTokenList() {
    try {
      if (!tokenList_URI[chainId]) {
        setTokenList(customTokensForDeploy[chainId] ?? []);
        return;
      }
      const result = await axios.get(tokenList_URI[chainId]);
      setTokenList([...(customTokensForDeploy[chainId] ?? []), ...result.data.tokens]);
    } catch (error) {
      console.log(error);
    }
  }

  useSlowRefreshEffect(() => {
    if (!(chainId === 56 || chainId === 1) || !signer || !address) {
      setTokens([]);
    } else {
      fetchTokens();
    }
  }, [chainId, signer]);

  useSlowRefreshEffect(() => {
    if (!(chainId === 56 || chainId === 1)) {
      setMarketHistory([]);
    } else {
      fetchMarketInfo();
    }
  }, [chainId]);

  useDailyRefreshEffect(() => {
    fetchTokenList();
  }, [chainId]);

  useEffect(() => {
    setTokens([]);
  }, [chainId, address]);

  useSlowRefreshEffect(() => {
    fetchPrices();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        tokens,
        marketHistory,
        pending,
        setPending,
        tokenList,
        priceHistory,
        nfts,
        selectedDeployer,
        setSelectedDeployer,
        viewType,
        setViewType,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardContextProvider };
