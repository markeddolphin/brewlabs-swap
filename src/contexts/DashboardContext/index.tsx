/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { WNATIVE } from "@brewlabs/sdk";
import { useAccount, useSigner } from "wagmi";

import ERC20ABI from "config/abi/erc20.json";
import claimableTokenAbi from "config/abi/claimableToken.json";
import dividendTrackerAbi from "config/abi/dividendTracker.json";

import { useActiveChainId } from "hooks/useActiveChainId";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import useWalletNFTs from "hooks/useWalletNFTs";
import { getContract, getDividendTrackerContract } from "utils/contractHelpers";
import multicall from "utils/multicall";
import { getNativeSybmol } from "lib/bridge/helpers";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import useTokenMarketChart, { defaultMarketData } from "@hooks/useTokenMarketChart";
import { fetchFeaturedPrices, fetchTokenBaseInfo } from "./fetchFeaturedPrices";
import { fetchTokenBalances } from "./fetchTokenBalances";
import { fetchMarketInfo, fetchTokenList } from "./fetchMarketInfo";
import { fetchWalletHistories } from "./fetchWalletHistories";
import { CHART_PERIOD_RESOLUTION, DEX_GURU_WETH_ADDR } from "config/constants";

const DashboardContext: any = React.createContext({
  tokens: [],
  featuredPriceHistory: [],
  marketHistory: [],
  tokenList: [],
  nfts: [],
  pending: false,
  selectedDeployer: "",
  viewType: 0,
  chartPeriod: 0,
  setViewType: () => {},
  setSelectedDeployer: () => {},
  setPending: () => {},
  setChartPeriod: () => {},
});

let temp_addr: any, temp_id: any;
const DashboardContextProvider = ({ children }: any) => {
  const { address } = useAccount();
  // const address = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
  const { chainId } = useActiveChainId();
  const { data: signer }: any = useSigner();

  const [tokens, setTokens] = useState([]);
  const [walletHistories, setWalletHistories] = useState([]);
  const [marketHistory, setMarketHistory] = useState([]);
  const [pending, setPending] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [featuredPriceHistory, setFeaturedPriceHistory] = useState([]);
  const [selectedDeployer, setSelectedDeployer] = useState("");
  const [viewType, setViewType] = useState(0);
  const [chartPeriod, setChartPeriod] = useState(0);

  const tokenMarketData = useTokenMarketChart(chainId);

  const nfts = useWalletNFTs(address);

  temp_addr = address;
  temp_id = chainId;

  const isScamToken = async (token: any) => {
    let isScam = false;
    if (!token.name.includes("_Tracker")) {
      try {
        if (signer && token.address !== DEX_GURU_WETH_ADDR) {
          const tokenContract = getContract(chainId, token.address, ERC20ABI, signer);
          await tokenContract.estimateGas.transfer("0x2170Ed0880ac9A755fd29B2688956BD959F933F8", 1);
        }
      } catch (error) {
        isScam = true;
      }
    }
    return isScam;
  };

  const fetchTokenInfo = async (token: any) => {
    try {
      let reward = {
          pendingRewards: 0,
          totalRewards: 0,
          symbol: "",
        },
        isReward = false;

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
        let rewardToken: any,
          pendingRewards = 0,
          totalRewards = 0;
        try {
          const dividendTrackerContract = getDividendTrackerContract(chainId, dividendTracker);
          const rewardTokenAddress = await dividendTrackerContract.rewardToken();
          const rewardTokenBaseinfo = await fetchTokenBaseInfo(rewardTokenAddress, chainId);
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
        reward,
        isScam: scamResult !== undefined ? scamResult : token.isScam,
        isReward,
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
        const serializedToken = { ...data, ...tokenInfo };
        return serializedToken;
      })
    );
    return data;
  };

  async function fetchTokens() {
    try {
      const items: any = await fetchTokenBalances(address, chainId);
      let _tokens: any = [];

      for (let i = 0; i < items.length; i++) {
        const address = items[i].address.toLowerCase();
        const filter = tokens.find((data) => data.address.toLowerCase() === address);
        const balance = filter ? filter.balance : items[i].balance;
        const name = items[i].name;
        const symbol = items[i].symbol;
        const decimals = items[i].decimals;
        const { usd: price } =
          tokenMarketData[address === DEX_GURU_WETH_ADDR ? WNATIVE[chainId].address.toLowerCase() : address] ||
          defaultMarketData;
        const reward = {
          totalRewards: filter ? filter.reward.totalRewards : 0,
          pendingRewards: filter ? filter.reward.pendingRewards : 0,
          symbol: filter ? filter.reward.symbol : "",
        };
        const isScam = filter ? filter.isScam : false;
        const isReward = filter ? filter.isReward : false;
        _tokens.push({
          address,
          balance,
          name,
          symbol,
          decimals,
          price: price ?? 0,
          reward,
          isScam,
          isReward,
          chainId,
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

  useSlowRefreshEffect(() => {
    if (!PAGE_SUPPORTED_CHAINS.draw.includes(chainId) || !signer || !address) {
      setTokens([]);
    } else {
      fetchTokens();
    }
  }, [chainId, signer, JSON.stringify(tokenMarketData)]);

  useSlowRefreshEffect(() => {
    if (!PAGE_SUPPORTED_CHAINS.draw.includes(chainId)) {
      setMarketHistory([]);
    } else {
      fetchMarketInfo().then((data) => setMarketHistory(data));
    }
  }, [chainId]);

  useEffect(() => {
    fetchTokenList(chainId).then((data) => setTokenList(data));
  }, [chainId]);

  useEffect(() => {
    setTokens([]);
  }, [chainId, address]);

  useSlowRefreshEffect(() => {
    fetchFeaturedPrices()
      .then((data) => setFeaturedPriceHistory(data))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    fetchWalletHistories(
      tokens,
      CHART_PERIOD_RESOLUTION[chartPeriod].period,
      CHART_PERIOD_RESOLUTION[chartPeriod].resolution
    ).then((data) => setWalletHistories(data));
  }, [JSON.stringify(tokens), chartPeriod]);

  return (
    <DashboardContext.Provider
      value={{
        tokens,
        marketHistory,
        pending,
        setPending,
        tokenList,
        featuredPriceHistory,
        nfts,
        selectedDeployer,
        setSelectedDeployer,
        viewType,
        setViewType,
        chartPeriod,
        setChartPeriod,
        walletHistories,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardContextProvider };
