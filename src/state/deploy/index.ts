import { createSlice } from "@reduxjs/toolkit";
import { NATIVE_CURRENCIES } from "@brewlabs/sdk";

import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { serializeToken } from "state/user/hooks/helpers";
import { getFarmFactoryAddress, getIndexFactoryAddress } from "utils/addressHelpers";
import { fetchFarmFactoryData } from "./fetchFactory";
import { fetchIndexFactoryData } from "./fetchIndex";

const initialState = {
  farm: PAGE_SUPPORTED_CHAINS["deployer"].map((chainId) => ({
    chainId,
    address: getFarmFactoryAddress(chainId),
    payingToken: serializeToken(NATIVE_CURRENCIES[chainId]),
    serviceFee: "0",
  })),
  pool: PAGE_SUPPORTED_CHAINS["deployer"].map((chainId) => ({
    chainId,
    address: getFarmFactoryAddress(chainId),
    payingToken: serializeToken(NATIVE_CURRENCIES[chainId]),
    serviceFee: "0",
  })),
  indexes: PAGE_SUPPORTED_CHAINS["deployer"].map((chainId) => ({
    chainId,
    address: getIndexFactoryAddress(chainId),
    payingToken: serializeToken(NATIVE_CURRENCIES[chainId]),
    serviceFee: "0",
    depositFeeLimit: 0.25,
    commissionFeeLimit: 1,
  })),
};

export const fetchFarmFactoryDataAsync = (chainId) => async (dispatch) => {
  const result = await fetchFarmFactoryData(chainId);

  dispatch(setDeployPublicData({ type: "farm", data: result }));
};

export const fetchIndexFactoryDataAsync = (chainId) => async (dispatch) => {
  const result = await fetchIndexFactoryData(chainId);

  dispatch(setDeployPublicData({ type: "indexes", data: result }));
};

export const deploySlice = createSlice({
  name: "Deploy",
  initialState,
  reducers: {
    setDeployPublicData: (state, action) => {
      const { type, data } = action.payload;
      const index = state[type].findIndex((entry) => entry.chainId === data.chainId);
      state[type][index] = { ...state[type][index], ...data };
    },
  },
});

// Actions
export const { setDeployPublicData } = deploySlice.actions;

export default deploySlice.reducer;
