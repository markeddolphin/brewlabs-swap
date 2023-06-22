import { ChainId } from "@brewlabs/sdk";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { API_URL } from "config/constants";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { Category } from "config/constants/types";
import { IndexesState } from "state/types";
import { fetchIndexPerformance, fetchIndexesTotalStaking } from "./fetchIndexes";
import {
  fetchUserBalance,
  fetchUserNftAllowance,
  fetchUserIndexNftData,
  fetchUserStakings,
  fetchUserDeployerNftData,
} from "./fetchIndexesUser";

import { SerializedIndex } from "./types";

const initialState: IndexesState = {
  data: [],
  userDataLoaded: false,
};

export const fetchIndexesFromApiAsync = () => async (dispatch) => {
  axios.post(`${API_URL}/indexes`).then((res) => {
    let indexes = [];
    if (res.data) {
      indexes = res.data
        .filter((p) => PAGE_SUPPORTED_CHAINS["indexes"].includes(p.chainId))
        .map((pool) => ({ type: Category.INDEXES, ...pool }));
    }
    dispatch(setIndexesPublicData(indexes));

    const pids = indexes.map((pool) => pool.pid);
    dispatch(fetchIndexesTVLDataAsync(pids));
  });
};

export const fetchIndexesTVLDataAsync = (pids) => async (dispatch, getState) => {
  const indexes = getState().indexes.data.filter((pool) => pids.includes(pool.pid));
  if (indexes.length === 0) return;

  axios.post(`${API_URL}/tvl/multiple`, { type: "index", ids: indexes.map((p) => p.pid) }).then((res) => {
    const ret = res?.data ?? [];

    const TVLData = [];
    for (let pool of indexes) {
      let record = { pid: pool.pid, data: [] };
      record.data = ret.filter((d) => d.pid === pool.pid).map((r) => r.totalStaked);

      if (record.data.length > 0) {
        TVLData.push(record);
      }
    }
    dispatch(setPoolTVLData(TVLData));
  });
};

export const fetchIndexesUserHistoryDataAsync = (account: string) => async (dispatch, getState) => {
  const indexes = getState().indexes.data;
  if (indexes.length === 0) return;

  axios
    .post(`${API_URL}/history/${account}/multiple`, { type: "index", ids: indexes.map((p) => p.pid) })
    .then((res) => {
      const ret = res?.data ?? [];

      const historyData = [];
      for (let pool of indexes) {
        let record = { pid: pool.pid, histories: [] };
        record.histories = ret.filter((d) => d.pid === pool.pid);

        historyData.push(record);
      }
      dispatch(setIndexesUserData(historyData));
    });
};

// Thunks
export const fetchIndexesPublicDataAsync = (chainId: ChainId) => async (dispatch, getState) => {
  const indexes = getState().indexes.data;

  const totalStakings = await fetchIndexesTotalStaking(chainId, indexes);

  const liveData = indexes
    .filter((p) => p.chainId === chainId)
    .map((pool) => totalStakings.find((entry) => entry.sousId === pool.sousId));

  dispatch(setIndexesPublicData(liveData));
};

export const fetchIndexesPriceChanges = (chainId: ChainId) => async (dispatch, getState) => {
  const indexes = getState().indexes.data;

  const result = await Promise.all(indexes.map((data) => fetchIndexPerformance(data)));

  const data = result.map((data, i) => {
    return { ...data, pid: indexes[i].pid };
  });

  dispatch(setIndexesPublicData(data));
};

export const fetchIndexPublicDataAsync = (pid: number) => async (dispatch, getState) => {
  const index = getState().indexes.data.find((pool) => pool.pid === pid);
  if (!index) return;

  const totalStakings = await fetchIndexesTotalStaking(index.chainId, [index]);
  if (totalStakings.length === 0) return;

  dispatch(setIndexesPublicData([totalStakings[0]]));
};

export const fetchIndexesUserDataAsync = (account: string, chainId: ChainId) => async (dispatch, getState) => {
  const indexes = getState().indexes.data.filter((p) => p.chainId === chainId);
  if (indexes.length === 0) return;

  fetchUserStakings(account, chainId, indexes).then((stakings) => {
    dispatch(setIndexesUserData(stakings));
  });
  fetchUserNftAllowance(account, chainId, indexes).then((allowances) => {
    dispatch(setIndexesUserData(allowances));
  });
  fetchUserBalance(account, chainId).then((ethBalance) => {
    dispatch(setIndexesUserData(indexes.map((pool) => ({ pid: pool.pid, ethBalance: ethBalance.toString() }))));
  });
  fetchUserIndexNftData(account, chainId, indexes.filter((index) => index.category === undefined)[0]?.nft).then(
    (nftInfo) =>
      dispatch(
        setIndexesUserData(
          indexes.filter((index) => index.category === undefined).map((pool) => ({
            pid: pool.pid,
            indexNftItems: nftInfo.filter((data) => data.indexAddress.toLowerCase() === pool.address.toLowerCase()),
          }))
        )
      )
  );
  fetchUserIndexNftData(account, chainId, indexes.filter((index) => index.category >= 0)[0]?.indexNft).then((nftInfo) =>
    dispatch(
      setIndexesUserData(
        indexes.filter((index) => index.category >= 0).map((pool) => ({
          pid: pool.pid,
          indexNftItems: nftInfo.filter((data) => data.indexAddress.toLowerCase() === pool.address.toLowerCase()),
        }))
      )
    )
  );
  fetchUserDeployerNftData(account, chainId, indexes.filter((index) => index.category >= 0)[0]?.deployerNft).then(
    (nftInfo) =>
      dispatch(
        setIndexesUserData(
          indexes.filter((index) => index.category >= 0).map((pool) => ({
            pid: pool.pid,
            deployerNftItem: nftInfo.find((data) => data.indexAddress.toLowerCase() === pool.address.toLowerCase()),
          }))
        )
      )
  );
};

export const fetchIndexUserHistoryDataAsync = (pid: number, account: string) => async (dispatch, getState) => {
  const indexes = getState().indexes.data;
  if (indexes.length === 0) return;

  axios.post(`${API_URL}/history/${account}/multiple`, { type: "index", ids: [pid] }).then((res) => {
    const ret = res?.data ?? [];

    const historyData = [];
    for (let pool of indexes) {
      let record = { pid: pool.pid, histories: [] };
      record.histories = ret.filter((d) => d.pid === pool.pid);

      historyData.push(record);
    }
    dispatch(setIndexesUserData(historyData));
  });
};

export const updateUserStakings = (pid: number, account: string, chainId: ChainId) => async (dispatch, getState) => {
  const index = getState().indexes.data.find((p) => p.pid === pid && p.chainId === chainId);
  if (!index) return;

  const stakings = await fetchUserStakings(account, chainId, [index]);
  dispatch(setIndexesUserData(stakings));
};

export const updateNftAllowance = (pid: number, account: string, chainId: ChainId) => async (dispatch, getState) => {
  const index = getState().indexes.data.find((p) => p.pid === pid && p.chainId === chainId);
  if (!index) return;

  const allowances = await fetchUserNftAllowance(account, chainId, [index]);
  dispatch(setIndexesUserData(allowances));
};

export const updateUserBalance = (account: string, chainId: ChainId) => async (dispatch, getState) => {
  const indexes = getState().indexes.data.filter((p) => p.chainId === chainId);
  if (indexes.length === 0) return;

  const ethBalance = await fetchUserBalance(account, chainId);
  dispatch(setIndexesUserData(indexes.map((pool) => ({ pid: pool.pid, ethBalance: ethBalance.toString() }))));
};

export const updateUserIndexNftInfo = (account: string, chainId: ChainId) => async (dispatch, getState) => {
  const indexes = getState().indexes.data.filter((p) => p.chainId === chainId);
  if (indexes.length === 0) return;

  let nftInfo = await fetchUserIndexNftData(
    account,
    chainId,
    indexes.filter((index) => index.category === undefined)[0]?.nft
  );
  dispatch(
    setIndexesUserData(
      indexes.map((pool) => ({
        pid: pool.pid,
        indexNftItems: nftInfo.filter((data) => data.indexAddress.toLowerCase() === pool.address.toLowerCase()),
      }))
    )
  );

  nftInfo = await fetchUserIndexNftData(account, chainId, indexes.filter((index) => index.category >= 0)[0]?.indexNft);
  dispatch(
    setIndexesUserData(
      indexes.map((pool) => ({
        pid: pool.pid,
        indexNftItems: nftInfo.filter((data) => data.indexAddress.toLowerCase() === pool.address.toLowerCase()),
      }))
    )
  );
};

export const updateUserDeployerNftInfo = (account: string, chainId: ChainId) => async (dispatch, getState) => {
  const indexes = getState().indexes.data.filter((p) => p.chainId === chainId);
  if (indexes.length === 0) return;

  const deployerNftInfo = await fetchUserDeployerNftData(
    account,
    chainId,
    indexes.filter((index) => index.category >= 0)[0]?.deployerNft
  );

  dispatch(
    setIndexesUserData(
      indexes.map((pool) => ({
        pid: pool.pid,
        deployerNftItem: deployerNftInfo.find(
          (data) => data.indexAddress.toLowerCase() === pool.address.toLowerCase()
        ),
      }))
    )
  );
};

export const IndexesSlice = createSlice({
  name: "Indexes",
  initialState,
  reducers: {
    setIndexesPublicData: (state, action) => {
      const liveIndexesData: SerializedIndex[] = action.payload;

      liveIndexesData.map((pool) => {
        const index = state.data.findIndex((p) => p.pid === pool.pid);
        if (index >= 0) {
          state.data[index] = { ...state.data[index], ...pool };
        } else if (pool.address) {
          state.data.push(pool);
        }
        return pool;
      });
    },
    setIndexesUserData: (state, action) => {
      const userData = action.payload;
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.pid === pool.pid);
        return { ...pool, userData: { ...pool.userData, ...userPoolData } };
      });
      state.userDataLoaded = true;
    },
    updateIndexesUserData: (state, action) => {
      const { field, value, pid } = action.payload;
      const index = state.data.findIndex((p) => p.pid === pid);

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } };
      }
    },
    setPoolTVLData: (state, action) => {
      action.payload.forEach((tvlDataEl) => {
        const { pid, data } = tvlDataEl;
        const index = state.data.findIndex((pool) => pool.pid === pid);
        state.data[index] = { ...state.data[index], TVLData: data };
      });
      state.userDataLoaded = true;
    },
    resetIndexesUserData: (state) => {
      state.data = state.data.map((pool) => {
        return { ...pool, userData: undefined };
      });
      state.userDataLoaded = false;
    },
  },
});

// Actions
export const { setIndexesPublicData, setIndexesUserData, updateIndexesUserData, setPoolTVLData, resetIndexesUserData } =
  IndexesSlice.actions;

export default IndexesSlice.reducer;
