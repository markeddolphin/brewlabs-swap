import { ChainId } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { pancakeFarms as farmsConfig } from "config/constants/farms";
import { AppId, Chef } from "config/constants/types";
import { SLOW_INTERVAL } from "config/constants";
import useSWRImmutable from "swr/immutable";
import { AppState, useAppDispatch } from "state";
import { useFetchLpTokenPrices, useLpTokenPrices } from "state/lpPrices/hooks";
import { State } from "state/types";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import {
  fetchApeFarmsPublicDataAsync,
  fetchApeFarmUserDataAsync,
  fetchBananaPrice,
  fetchFarmLpAprs,
  fetchFarmsPublicDataAsync,
  fetchFarmUserDataAsync,
  fetchSushiFarmsPublicDataAsync,
  fetchSushiFarmUserDataAsync,
  setFarmsPublicData,
  setInitialFarmData,
  setInitialFarmDataAsync,
  updateAppId,
} from ".";
import {
  farmsSelector,
  makeLpTokenPriceFromLpSymbolSelector,
  makeUserFarmFromPidSelector,
  priceCakeFromPidSelector,
} from "./selectors";
import { useSushiFarms } from "./sushiswap/masterchef";
import {
  useOneDayBlock,
  useSushiPairs,
  useAverageBlockTime,
  useMasterChefV1TotalAllocPoint,
  useMasterChefV1SushiPerBlock,
  useSushiPrice,
  useEthPrice,
} from "./sushiswap/hooks";
import { aprToApy } from "./sushiswap/apyApr";
import { useAccount } from "wagmi";
import { useFastRefreshEffect, useSlowRefreshEffect } from "@hooks/useRefreshEffect";

export const usePollFarmsWithUserData = () => {
  const dispatch = useAppDispatch();
  const { address: account } = useAccount();

  useSWRImmutable(
    ["publicFarmData"],
    () => {
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid);
      dispatch(fetchFarmsPublicDataAsync(pids));
    },
    {
      refreshInterval: SLOW_INTERVAL,
    }
  );

  useSWRImmutable(
    account ? ["farmsWithUserData", account] : null,
    () => {
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid);
      dispatch(fetchFarmUserDataAsync({ account, pids }));
    },
    {
      refreshInterval: SLOW_INTERVAL,
    }
  );
};

export const useFarms = (account) => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWeb3React();
  const { data: farms } = useSelector(farmsSelector);
  const apeFarmLoaded = farms.filter((data) => data.appId === AppId.APESWAP).length > 0;
  const sushiFarmLoaded = farms.filter((data) => data.appId === AppId.SUSHISWAP).length > 0;

  useSlowRefreshEffect(() => {
    if (account /*&& chainId === ChainId.BSC_MAINNET*/) {
      dispatch(fetchApeFarmUserDataAsync(ChainId.BSC_MAINNET, account));
    }
  }, [account, dispatch, chainId, apeFarmLoaded]);

  useSlowRefreshEffect(() => {
    if (account) {
      dispatch(fetchSushiFarmUserDataAsync(account));
    }
  }, [account, dispatch, chainId, sushiFarmLoaded]);
  return useSelector(farmsSelector);
};

export const useFarmUser = (pid: number, appId: AppId) => {
  const farmFromPidUser = useMemo(() => makeUserFarmFromPidSelector(pid, appId), [pid, appId]);
  return useSelector(farmFromPidUser);
};

export const useLpTokenPrice = (symbol: string, appId: AppId) => {
  const lpTokenPriceFromLpSymbol = useMemo(() => makeLpTokenPriceFromLpSymbolSelector(symbol, appId), [symbol, appId]);
  return useSelector(lpTokenPriceFromLpSymbol);
};

export const usePriceCakeBusd = (): BigNumber => {
  return useSelector(priceCakeFromPidSelector);
};

export const usePollFarms = () => {
  const { chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { lpTokenPrices } = useLpTokenPrices();
  const bananaPrice = useBananaPrice();
  const farmLpAprs = useFarmLpAprsFromAppId(AppId.APESWAP);

  useSlowRefreshEffect(() => {
    // if (chainId === ChainId.BSC_MAINNET) {
    dispatch(fetchApeFarmsPublicDataAsync(ChainId.BSC_MAINNET, lpTokenPrices, new BigNumber(bananaPrice), farmLpAprs));
    // }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [dispatch, chainId, lpTokenPrices?.length, farmLpAprs?.lpAprs?.length, bananaPrice]);

  const farms = useSelector((state: State) => state.zap.data[AppId.SUSHISWAP]);

  useSlowRefreshEffect(() => {
    // if (chainId === ChainId.ETHEREUM) {
    dispatch(fetchSushiFarmsPublicDataAsync(ChainId.ETHEREUM));
    // }
  }, [dispatch, chainId, farms?.length]);
};

export const useSetFarms = () => {
  useFetchLpTokenPrices();
  const dispatch = useAppDispatch();
  const apeFarms = useSelector((state: State) => state.zap.data[AppId.APESWAP]);
  if (apeFarms.length === 0) {
    dispatch(setInitialFarmDataAsync());
  }

  const rewards = useFarmRewards({ chainId: ChainId.ETHEREUM });
  const sushiFarms = useSelector((state: State) => state.zap.data[AppId.SUSHISWAP]);

  useEffect(() => {
    if (sushiFarms.length === 0) {
      dispatch(setInitialFarmData({ appId: AppId.SUSHISWAP, farms: rewards }));
    } else {
      dispatch(setFarmsPublicData({ appId: AppId.SUSHISWAP, farms: rewards }));
    }
  }, [dispatch, rewards, sushiFarms.length]);
};

export const useFetchBananaPrice = () => {
  const dispatch = useAppDispatch();
  useFastRefreshEffect(() => {
    dispatch(fetchBananaPrice(ChainId.BSC_MAINNET));
  }, [dispatch]);
};

export const useBananaPrice = () => {
  const { bananaPrice } = useSelector((state: State) => state.zap);
  return bananaPrice;
};

export const useFetchFarmLpAprs = (chainId) => {
  const dispatch = useAppDispatch();

  useSlowRefreshEffect(() => {
    dispatch(fetchFarmLpAprs(chainId));
  }, [chainId, dispatch]);
};

export const useFarmLpAprs = (): any => {
  const farmLpAprs = useSelector((state: State) => state.zap.FarmLpAprs);
  return farmLpAprs;
};

export const useFarmLpAprsFromAppId = (appId: AppId): any => {
  const farmLpAprs = useSelector((state: State) => state.zap.FarmLpAprs[appId]);
  return farmLpAprs;
};

export const useAppId = (): [AppId, (appId: AppId) => void] => {
  const dispatch = useAppDispatch();
  const appId = useSelector<AppState, AppState["zap"]["appId"]>((state) => state.zap.appId);

  const setAppId = useCallback(
    (newAppId: AppId) => {
      dispatch(updateAppId(newAppId));
    },
    [dispatch]
  );

  return [appId, setAppId];
};

export function useFarmRewards({ chainId = ChainId.ETHEREUM }) {
  const { data: block1d } = useOneDayBlock({ chainId, shouldFetch: !!chainId });
  const farms = useSushiFarms({ chainId });
  const farmAddresses = useMemo(() => farms.map((farm) => farm.pair.toLowerCase()), [farms]);

  const { data: swapPairs } = useSushiPairs({
    chainId,
    variables: {
      where: {
        id_in: farmAddresses,
      },
    },
    shouldFetch: !!farmAddresses,
  });

  const { data: swapPairs1d } = useSushiPairs({
    chainId,
    variables: {
      block: block1d,
      where: {
        id_in: farmAddresses,
      },
    },
    shouldFetch: !!block1d && !!farmAddresses,
  });

  const { data: averageBlockTime } = useAverageBlockTime({ chainId });
  const { data: masterChefV1TotalAllocPoint } = useMasterChefV1TotalAllocPoint();
  const { data: masterChefV1SushiPerBlock } = useMasterChefV1SushiPerBlock();

  const { data: sushiPrice } = useSushiPrice();
  const { data: ethPrice } = useEthPrice();

  const map = useCallback(
    (pool) => {
      const owner = pool?.owner || pool?.masterChef;
      const balance = pool?.balance || pool?.slpBalance;

      const swapPair = swapPairs?.find((pair) => pair.id === pool.pair);
      const swapPair1d = swapPairs1d?.find((pair) => pair.id === pool.pair);

      const blocksPerHour = 3600 / averageBlockTime;

      const totalAllocPoint = pool.chef === Chef.MASTERCHEF_V2 ? masterChefV1TotalAllocPoint : owner.totalAllocPoint;

      function getRewards() {
        const sushiPerBlock =
          owner?.sushiPerBlock / 1e18 || (owner?.sushiPerSecond / 1e18) * averageBlockTime || masterChefV1SushiPerBlock;

        const rewardPerBlock = (pool.allocPoint / totalAllocPoint) * sushiPerBlock;

        const defaultReward = {
          rewardPerBlock,
          rewardPrice: sushiPrice,
        };

        const rewards: { rewardPerBlock: number; rewardPrice: number }[] = [defaultReward];

        if (pool.chef === Chef.MASTERCHEF_V2) {
          const decimals = 10 ** (pool.rewardToken?.decimals ?? 18);

          if (pool.rewarder.rewardToken !== "0x0000000000000000000000000000000000000000") {
            const rewardPerBlock =
              pool.id === "1"
                ? 0
                : pool.rewardToken.symbol === "ALCX"
                ? pool.rewarder.rewardPerSecond / decimals
                : pool.rewardToken.symbol === "LDO"
                ? (0 / decimals) * averageBlockTime
                : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime;

            const rewardPrice =
              pool.rewarder.rewardToken === "0x5dd8905aec612529361a35372efd5b127bb182b3"
                ? swapPair.token1.derivedETH * ethPrice
                : pool.rewardToken.derivedETH * ethPrice;

            const reward = {
              rewardPerBlock,
              rewardPrice,
            };
            rewards[1] = reward;
          }
        }
        return rewards;
      }

      const rewards = getRewards();

      const tvl = (balance / (Number(swapPair.totalSupply) * 1e18)) * Number(swapPair.reserveUSD);

      const feeApyPerYear =
        swapPair && swapPair1d
          ? aprToApy(
              (((swapPair?.volumeUSD - swapPair1d?.volumeUSD) * 0.0025 * 365) / swapPair?.reserveUSD) * 100,
              3650
            ) / 100
          : 0;

      const roiPerBlock =
        rewards.reduce((previousValue, currentValue) => {
          return previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice;
        }, 0) / tvl;

      const rewardAprPerYear = roiPerBlock * blocksPerHour * 24 * 30 * 12;

      const roiPerYear = rewardAprPerYear + feeApyPerYear;

      const lpValueUsd = swapPair.reserveUSD / Number(swapPair.totalSupply);

      return {
        ...pool,
        pid: Number(pool.id),
        pair: swapPair,
        lpAddress: pool.pair,
        lpSymbol: `${swapPair.token0.symbol}-${swapPair.token1.symbol}`,
        lpValueUsd,
        apr: roiPerYear * 100,
        liquidity: tvl,
        totalRewards: "0",
      };
    },
    [
      averageBlockTime,
      ethPrice,
      masterChefV1SushiPerBlock,
      masterChefV1TotalAllocPoint,
      sushiPrice,
      swapPairs,
      swapPairs1d,
    ]
  );

  const filter = useCallback(
    (farm) => swapPairs && swapPairs.find((pair) => pair.id === farm.pair && farm.allocPoint !== "0"),
    [swapPairs]
  );

  return useMemo(() => farms.filter(filter).map(map), [farms, filter, map]);
}
