import axios from "axios";
import { ethers } from "ethers";

import IndexAbi from "config/abi/indexes/index.json";

import { API_URL, MULTICALL_FETCH_LIMIT } from "config/constants";
import multicall from "utils/multicall";
import { sumOfArray } from "utils/functions";

export const fetchIndexesTotalStaking = async (chainId, indexes) => {
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
          for (let k = 0; k < pool.numTokens; k++) {
            calls.push({
              address: pool.address,
              name: "totalStaked",
              params: [k],
            });
          }
        }

        const totalStakes = await multicall(IndexAbi, calls, chainId);

        if (totalStakes) {
          let idx = 0;
          for (let pool of batch) {
            let totalStaked = [];
            for (let k = 0; k < pool.numTokens; k++) {
              totalStaked.push(ethers.utils.formatUnits(totalStakes[idx][0], pool.tokens[k].decimals));
              idx++;
            }

            data.push({ pid: pool.pid, totalStaked });
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

const getPriceChange = (prices, time) => {
  let currentPriceChange = 0,
    prevPriceChange = 0;
  let curPrices = [];
  for (let k = 0; k < prices.length; k++) {
    curPrices.push(prices[k].c[prices[k].c.length - 1]);
    currentPriceChange += curPrices[k] / prices.length;
  }

  let prevPrices = new Array(prices.length).fill(0);
  for (let k = 0; k < prices.length; k++) {
    for (let i = prices[k].t.length; i >= 0; i--)
      if (prices[k].t[i] < (Date.now() - time) / 1000) {
        prevPrices[k] = prices[k].c[i];
        break;
      }
    prevPriceChange += prevPrices[k] / prices.length;
  }

  return {
    percent: ((currentPriceChange - prevPriceChange) / currentPriceChange) * 100,
    value: currentPriceChange - prevPriceChange,
  };
};

export const getAverageHistory = (prices) => {
  let temp = [];
  if (!prices[0]) return [];
  for (let i = 0; i < prices[0].length; i++) {
    let currentPriceChange = 0,
      prevPriceChange = 0;
    for (let k = 0; k < prices.length; k++) {
      currentPriceChange += prices[k][i] / prices.length;
      prevPriceChange += prices[k][0] / prices.length;
    }
    const average = ((currentPriceChange - prevPriceChange) / currentPriceChange) * 100;

    temp.push(average);
  }
  return temp;
};

export const fetchIndexPerformance = async (pool) => {
  let keys = { 1: "eth", 56: "bsc", 137: "polygon" };

  const to = Math.floor(Date.now() / 1000);
  let prices = [];
  let tokenPrices = [];
  try {
    for (let i = 0; i < pool.numTokens; i++) {
      const tokenYearUrl = `https://api.dex.guru/v1/tradingview/history?symbol=${pool.tokens[i].address}-${
        keys[pool.chainId]
      }_USD&resolution=1440&from=${to - 3600 * 24 * 365}&to=${to}`;

      let priceResult = await axios.get(tokenYearUrl);
      const yearlyPrice = priceResult.data;

      const tokenDayUrl = `https://api.dex.guru/v1/tradingview/history?symbol=${pool.tokens[i].address}-${
        keys[pool.chainId]
      }_USD&resolution=60&from=${to - 3600 * 24}&to=${to}`;

      priceResult = await axios.get(tokenDayUrl);
      const dailyPrice = priceResult.data;
      prices.push([yearlyPrice, dailyPrice]);
      tokenPrices.push(dailyPrice.c[dailyPrice.c.length - 1]);
    }
  } catch (e) {
    return { priceChanges: new Array(4).fill({ percent: 0, value: 0 }), priceHistories: [] };
  }

  let priceChanges = [
    getPriceChange(
      prices.map((p) => p[1]),
      3600 * 23 * 1000
    ),
    getPriceChange(
      prices.map((p) => p[0]),
      7 * 86400 * 1000
    ),
    getPriceChange(
      prices.map((p) => p[0]),
      30 * 86400 * 1000
    ),
  ];

  return { priceChanges, priceHistories: prices.map((p) => p[1].c), tokenPrices };
};

export const fetchIndexFeeHistories = async (pool) => {
  let res;
  try {
    res = await axios.post(`${API_URL}/fee/single`, { type: "index", id: pool.pid });
  } catch (e) {}
  if (!res?.data) {
    return { performanceFees: [] };
  }
  const { performanceFees, commissions } = res.data;

  let _performanceFees = [],
    _commissions = [];
  const timeBefore24Hrs = Math.floor(new Date().setHours(new Date().getHours() - 24) / 1000);
  const curTime = Math.floor(new Date().getTime() / 1000);

  for (let t = timeBefore24Hrs; t <= curTime; t += 3600) {
    _performanceFees.push(sumOfArray(performanceFees.filter((v) => v.timestamp <= t).map((v) => +v.value)));
  }

  for (let t = timeBefore24Hrs; t <= curTime; t += 3600) {
    _commissions.push(sumOfArray(commissions.filter((v) => v.timestamp <= t).map((v) => +v.value)));
  }

  return { performanceFees: _performanceFees, commissions: _commissions };
};
