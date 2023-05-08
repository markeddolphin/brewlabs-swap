import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { stringify } from "querystring";
import BigNumber from "bignumber.js";
import { ChainId } from "@brewlabs/sdk";
import { AppId } from "config/constants/types";
import { pancakeFarms } from "config/constants/farms";
import lpAprs from "config/constants/lpAprs.json";
import multicall from "utils/multicall";
import masterchefABI from "config/abi/pancakeMasterchef.json";
import { getPancakeMasterChefAddress as getMasterChefAddress, getBananaAddress } from "utils/addressHelpers";
import { getBalanceAmount } from "utils/formatBalance";
import { getLpAprsFromLocalStorage } from "utils/farmHelpers";
import { ethersToBigNumber } from "utils/bigNumber";
import { getTokenUsdPrice } from "utils/getTokenUsdPrice";
import type { AppState } from "state";
import fetchFarms from "./pancakeswap/fetchFarms";
import getPancakeFarmLpAprs from "./pancakeswap/getFarmLpAprs";
import getFarmsPrices from "./pancakeswap/getFarmsPrices";
import { fetchFarmUserEarnings, fetchFarmUserStakedBalances } from "./pancakeswap/fetchFarmUser";
import { AppThunk, Farm, FarmLpAprsType, LpTokenPrices, SerializedPancakeFarm, SerializedZapState } from "../types";
import { fetchMasterChefFarmPoolLength } from "./pancakeswap/fetchMasterChefData";
import { fetchApeFarmUserEarnings, fetchApeFarmUserStakedBalances } from "./apeswap/fetchFarmUser";
import fetchApeFarms from "./apeswap/fetchFarms";
import fetchFarmConfig from "./apeswap/api";
import getApeFarmLpAprs from "./apeswap/getFarmLpAprs";
import fetchSushiFarms from "./sushiswap/fetchFarms";
import { fetchSushiFarmUserEarnings, fetchSushiFarmUserStakedBalances } from "./sushiswap/fetchFarmUser";

const noAccountFarmConfig = pancakeFarms.map((farm) => ({
  ...farm,
  userData: {
    stakedBalance: "0",
    earnings: "0",
    totalRewards: "0",
  },
}));

const initialState: SerializedZapState = {
  data: {
    [AppId.PANCAKESWAP]: noAccountFarmConfig,
    [AppId.APESWAP]: [],
    [AppId.SUSHISWAP]: [],
  },
  userDataLoaded: false,
  loadingKeys: {},
  bananaPrice: null,
  FarmLpAprs: {
    [AppId.PANCAKESWAP]: getLpAprsFromLocalStorage() ?? lpAprs,
    [AppId.APESWAP]: null,
    [AppId.SUSHISWAP]: {},
  },
  appId: AppId.PANCAKESWAP,
};

export const fetchFarmsPublicDataAsync = createAsyncThunk<
  [SerializedPancakeFarm[], number, number],
  number[],
  {
    state: AppState;
  }
>(
  "zap/fetchFarmsPublicDataAsync",
  async (pids) => {
    const masterChefAddress = getMasterChefAddress();
    const calls = [
      {
        address: masterChefAddress,
        name: "poolLength",
      },
      {
        address: masterChefAddress,
        name: "cakePerBlock",
        params: [true],
      },
    ];
    const [[poolLength], [cakePerBlockRaw]] = await multicall(masterchefABI, calls, ChainId.BSC_MAINNET);
    const regularCakePerBlock = getBalanceAmount(ethersToBigNumber(cakePerBlockRaw));
    const farmsToFetch = pancakeFarms.filter((farmConfig) => pids.includes(farmConfig.pid));
    const farmsCanFetch = farmsToFetch.filter((f) => poolLength.gt(f.pid));

    const farms = await fetchFarms(farmsCanFetch);
    const farmsWithPrices = getFarmsPrices(farms);

    return [farmsWithPrices, poolLength.toNumber(), regularCakePerBlock.toNumber()];
  },
  {
    condition: (args, { getState }) => {
      const { zap }: any = getState();
      if (zap.loadingKeys[stringify({ type: fetchFarmsPublicDataAsync.typePrefix, args })]) {
        console.debug("farms action is fetching, skipping here");
        return false;
      }
      return true;
    },
  }
);

interface FarmUserDataResponse {
  pid: number;
  stakedBalance: string;
  earnings: string;
  totalRewards: string;
}

export const fetchFarmUserDataAsync = createAsyncThunk<
  FarmUserDataResponse[],
  { account: string; pids: number[] },
  {
    state: AppState;
  }
>(
  "zap/fetchFarmUserDataAsync",
  async ({ account, pids }) => {
    const poolLength = await fetchMasterChefFarmPoolLength();
    const farmsToFetch = pancakeFarms.filter((farmConfig) => pids.includes(farmConfig.pid));
    const farmsCanFetch = farmsToFetch.filter((f) => poolLength.gt(f.pid));
    const [[userStakedBalances, userTotalRewards], userFarmEarnings] = await Promise.all([
      fetchFarmUserStakedBalances(account, farmsCanFetch),
      fetchFarmUserEarnings(account, farmsCanFetch),
    ]);

    return userStakedBalances.map((stakedBalance, index) => {
      return {
        pid: farmsToFetch[index].pid,
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
        totalRewards: userTotalRewards[index],
      };
    });
  },
  {
    condition: (arg, { getState }) => {
      const { zap } = getState();
      if (zap.loadingKeys[stringify({ type: fetchFarmUserDataAsync.typePrefix, ...arg })]) {
        console.debug("farms user action is fetching, skipping here");
        return false;
      }
      return true;
    },
  }
);

export const farmsSlice = createSlice({
  name: "Zap",
  initialState,
  reducers: {
    setInitialFarmData: (state, action) => {
      const { appId, farms } = action.payload;
      state.data[appId] = farms;
    },
    setFarmsPublicData: (state, action) => {
      const { appId, farms: liveFarmsData } = action.payload;
      state.data[appId] = state.data[appId].map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid);
        return { ...farm, ...liveFarmData };
      });
    },
    setFarmUserData: (state, action) => {
      const { appId, arrayOfUserDataObjects } = action.payload;
      arrayOfUserDataObjects.forEach((userDataE1) => {
        const { index } = userDataE1;
        state.data[appId][index] = { ...state.data[appId][index], userData: userDataE1 };
      });
    },
    setBananaPrice: (state, action) => {
      state.bananaPrice = action.payload;
    },
    setFarmLpAprs: (state, action) => {
      state.FarmLpAprs = { ...state.FarmLpAprs, ...action.payload };
    },
    updateFarmsUserData: (state, action) => {
      const { field, value, pid, appId } = action.payload;
      const index = state.data[appId].findIndex((p) => p.pid === pid);

      if (index >= 0) {
        state.data[appId][index] = {
          ...state.data[appId][index],
          userData: { ...state.data[appId][index].userData, [field]: value },
        };
      }
    },
    updateAppId: (state, action) => {
      state.appId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      const [farmPayload, poolLength, regularCakePerBlock] = action.payload;
      state.data[AppId.PANCAKESWAP] = state.data[AppId.PANCAKESWAP].map((farm) => {
        const liveFarmData = farmPayload.find((farmData) => farmData.pid === farm.pid);
        return { ...farm, ...liveFarmData };
      });
      state.poolLength = poolLength;
      state.regularCakePerBlock = regularCakePerBlock;
    });

    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataE1) => {
        const { pid } = userDataE1;
        const index = state.data[AppId.PANCAKESWAP].findIndex((farm) => farm.pid === pid);
        state.data[AppId.PANCAKESWAP][index] = { ...state.data[AppId.PANCAKESWAP][index], userData: userDataE1 };
      });
      state.userDataLoaded = true;
    });
  },
});

export const {
  setInitialFarmData,
  setFarmsPublicData,
  setFarmUserData,
  setBananaPrice,
  setFarmLpAprs,
  updateFarmsUserData,
  updateAppId,
} = farmsSlice.actions;

export const fetchApeFarmsPublicDataAsync =
  (chainId: number, lpPrices: LpTokenPrices[], bananaPrice: BigNumber, farmLpAprs: FarmLpAprsType): AppThunk =>
  async (dispatch, getState) => {
    try {
      const farmsConfig = getState().zap.data[AppId.APESWAP];
      const farms = await fetchApeFarms(chainId, lpPrices, bananaPrice, farmLpAprs, farmsConfig);
      dispatch(setFarmsPublicData({ appId: AppId.APESWAP, farms }));
    } catch (error) {
      console.warn(error);
    }
  };

export const fetchApeFarmUserDataAsync =
  (chainId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const farms = getState().zap.data[AppId.APESWAP];
      const [userStakedBalances, userTotalRewards] = await fetchApeFarmUserStakedBalances(chainId, account, farms);
      const userFarmEarnings = await fetchApeFarmUserEarnings(chainId, account, farms);

      const arrayOfUserDataObjects = userStakedBalances.map((_, index) => {
        return {
          index,
          stakedBalance: userStakedBalances[index],
          earnings: userFarmEarnings[index],
          totalRewards: userTotalRewards[index],
        };
      });
      dispatch(setFarmUserData({ appId: AppId.APESWAP, arrayOfUserDataObjects }));
    } catch (error) {
      console.warn(error);
    }
  };

export const setInitialFarmDataAsync = (): AppThunk => async (dispatch) => {
  try {
    const initialFarmState: Farm[] = await fetchFarmConfig();
    dispatch(setInitialFarmData({ appId: AppId.APESWAP, farms: initialFarmState || [] }));
  } catch (error) {
    console.error(error);
  }
};

export const fetchBananaPrice =
  (chainId): AppThunk =>
  async (dispatch) => {
    const bananaPrice = await getTokenUsdPrice(chainId, getBananaAddress(chainId), 18);
    dispatch(setBananaPrice(bananaPrice));
  };

export const fetchFarmLpAprs = (chainId) => async (dispatch) => {
  getPancakeFarmLpAprs(chainId).then((data) => {
    if (!data) return;
    dispatch(setFarmLpAprs({ [AppId.PANCAKESWAP]: data }));
  });
  const farmLpAprs = await getApeFarmLpAprs(chainId);
  dispatch(setFarmLpAprs({ [AppId.APESWAP]: farmLpAprs }));
};

export const fetchSushiFarmsPublicDataAsync = (chainId) => async (dispatch, getState) => {
  try {
    const farmsConfig = getState().zap.data[AppId.SUSHISWAP];
    const farms = await fetchSushiFarms(chainId, farmsConfig);
    dispatch(setFarmsPublicData({ appId: AppId.SUSHISWAP, farms }));
  } catch (error) {
    console.warn(error);
  }
};

export const fetchSushiFarmUserDataAsync =
  (account: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const farms = getState().zap.data[AppId.SUSHISWAP];
      const [userStakedBalances, userTotalRewards] = await fetchSushiFarmUserStakedBalances(account, farms);
      const userFarmEarnings = await fetchSushiFarmUserEarnings(account, farms);

      const arrayOfUserDataObjects = userStakedBalances.map((_, index) => {
        return {
          index,
          stakedBalance: userStakedBalances[index],
          earnings: userFarmEarnings[index],
          totalRewards: userTotalRewards[index],
        };
      });
      dispatch(setFarmUserData({ appId: AppId.SUSHISWAP, arrayOfUserDataObjects }));
    } catch (error) {
      console.warn(error);
    }
  };

export default farmsSlice.reducer;
