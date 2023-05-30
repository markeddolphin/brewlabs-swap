import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

import { API_URL } from "config/constants";
import { resetUserState } from "state/global/actions";
import { SerializedFarmsState } from "state/types";

import {
  fetchFarmUserAllowances,
  fetchFarmUserEarnings,
  fetchFarmUserReflections,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from "./fetchFarmUser";
import { fetchTotalStakesForFarms } from "./fetchPublicFarmData";
import { Category } from "config/constants/types";

const initialUserData = {
  allowance: "0",
  tokenBalance: "0",
  stakedBalance: "0",
  earnings: "0",
  reflections: "0",
  deposits: [],
};

const initialState: SerializedFarmsState = {
  data: [],
  userDataLoaded: false,
};

export const fetchFarmsPublicDataFromApiAsync = () => async (dispatch) => {
  axios.post(`${API_URL}/farms`).then((res) => {
    let farms = [];
    if (res.data) {
      farms = res.data.map((farm) => ({ type: Category.FARM, ...farm }));
    }
    dispatch(setFarmsPublicData(farms));

    const pids = farms.map((farmToFetch) => farmToFetch.pid);
    dispatch(fetchFarmsTVLDataAsync(pids));
  });
};

export const fetchFarmsTotalStakesAsync = (chainId) => async (dispatch, getState) => {
  const farms = getState().farms.data.filter((farm) => farm.chainId === chainId);
  if (farms.length === 0) return;

  const data = await fetchTotalStakesForFarms(chainId, farms);
  dispatch(setFarmsPublicData(data));
};

export const fetchFarmsTVLDataAsync = (pids) => async (dispatch, getState) => {
  const farms = getState().farms.data.filter((farm) => pids.includes(farm.pid));
  if (farms.length === 0) return;

  axios.post(`${API_URL}/tvl/multiple`, { type: "farm", ids: farms.map((p) => p.pid) }).then((res) => {
    const ret = res?.data ?? [];

    const TVLData = [];
    for (let farm of farms) {
      let record = { pid: farm.pid, data: [] };
      record.data = ret.filter((d) => d.farmId === farm.pid).map((r) => r.totalStaked);

      if (record.data.length > 0) {
        TVLData.push(record);
      }
    }
    dispatch(setFarmTVLData(TVLData));
  });
};

export const fetchFarmsUserDepositDataAsync =
  ({ account, pids }) =>
  async (dispatch, getState) => {
    const farms = getState().farms.data.filter((farm) => pids.includes(farm.pid));
    if (farms.length === 0) return;

    axios.post(`${API_URL}/deposit/${account}/multiple`, { type: "farm", ids: farms.map((p) => p.pid) }).then((res) => {
      const ret = res?.data ?? [];

      const depositData = [];
      for (let farm of farms) {
        let record = { pid: farm.pid, deposits: [] };
        record.deposits = ret.filter((d) => d.farmId === farm.pid);

        depositData.push(record);
      }
      dispatch(setFarmUserData(depositData));
    });
  };

export const fetchFarmUserDataAsync =
  ({ account, chainId, pids }) =>
  async (dispatch, getState) => {
    const farmsToFetch = getState().farms.data.filter((farmConfig) => pids.includes(farmConfig.pid));
    if (farmsToFetch.length === 0) return;

    fetchFarmUserAllowances(account, chainId, farmsToFetch).then((userFarmAllowances) => {
      const data = farmsToFetch.map((farm, index) => {
        return {
          pid: farm.pid,
          farmId: farm.farmId,
          poolId: farm.poolId,
          chainId: farm.chainId,
          allowance: userFarmAllowances[index],
        };
      });
      dispatch(setFarmUserData(data));
    });
    fetchFarmUserTokenBalances(account, chainId, farmsToFetch).then((userFarmTokenBalances) => {
      const data = farmsToFetch.map((farm, index) => {
        return {
          pid: farm.pid,
          farmId: farm.farmId,
          poolId: farm.poolId,
          chainId: farm.chainId,
          tokenBalance: userFarmTokenBalances[index],
        };
      });
      dispatch(setFarmUserData(data));
    });
    fetchFarmUserStakedBalances(account, chainId, farmsToFetch).then((data) => {
      dispatch(setFarmUserData(data));
    });
    fetchFarmUserEarnings(
      account,
      chainId,
      farmsToFetch.filter((f) => ![15, 17].includes(f.farmId))
    ).then((data) => {
      dispatch(setFarmUserData(data));
    });
    await fetchFarmUserReflections(
      account,
      chainId,
      farmsToFetch.filter((f) => ![15, 16, 17].includes(f.farmId))
    ).then((userFarmReflections) => {
      const data = farmsToFetch
        .filter((f) => ![15, 16, 17].includes(f.farmId))
        .filter((f) => !f.enableEmergencyWithdraw)
        .map((farm, index) => {
          return {
            pid: farm.pid,
            farmId: farm.farmId,
            poolId: farm.poolId,
            chainId: farm.chainId,
            reflections: userFarmReflections[index] ?? "0",
          };
        });
      dispatch(setFarmUserData(data));
    });
  };

export const farmsSlice = createSlice({
  name: "Farms",
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData = action.payload;
      liveFarmsData.map((farm) => {
        const index = state.data.findIndex((entry) => entry.pid === farm.pid);
        if (index >= 0) {
          state.data[index] = { ...state.data[index], ...farm };
        } else if (farm.contractAddress) {
          state.data.push({ ...farm, userData: initialUserData, TVLData: [] });
        }
        return farm;
      });
    },
    setFarmUserData: (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl;
        const index = state.data.findIndex((farm) => farm.pid === pid);
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, ...userDataEl } };
      });
      state.userDataLoaded = true;
    },
    updateFarmsUserData: (state, action) => {
      const { field, value, pid, farmId } = action.payload;
      const index = state.data.findIndex((p) => p.poolId === pid && p.farmId === farmId);

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } };
      }
    },
    setFarmTVLData: (state: any, action) => {
      action.payload.forEach((tvlDataEl: any) => {
        const { pid, data } = tvlDataEl;
        const index = state.data.findIndex((farm) => farm.pid === pid);
        state.data[index] = { ...state.data[index], TVLData: data };
      });
      state.userDataLoaded = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.data = state.data.map((farm: any) => {
        return {
          ...farm,
          userData: initialUserData,
        };
      });
      state.userDataLoaded = false;
    });
  },
});

// Actions
export const { setFarmsPublicData, setFarmUserData, updateFarmsUserData, setFarmTVLData } = farmsSlice.actions;

export default farmsSlice.reducer;
