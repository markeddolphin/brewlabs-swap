import { useEffect } from "react";
import { useSelector } from "react-redux";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAppDispatch } from "state";
import { simpleRpcProvider } from "utils/providers";

import { State } from "../types";
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsPublicDataFromApiAsync,
  fetchPoolsUserDataAsync,
  fetchPoolsUserDepositDataAsync,
  resetPoolsUserData,
} from ".";
import { transformPool } from "./helpers";
import { DeserializedPool } from "./types";

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWeb3React();
  const { pools } = usePools();

  useSlowRefreshEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await simpleRpcProvider(chainId).getBlockNumber();
      dispatch(fetchPoolsPublicDataAsync(blockNumber, chainId));
    };

    fetchPoolsPublicData();
  }, [dispatch, chainId, pools.length]);
};

export const usePollPoolsPublicDataFromApi = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchPoolsPublicDataFromApiAsync());
  }, [dispatch]);
};

export const useFetchPoolsWithUserData = () => {
  const { chainId, account } = useActiveWeb3React();
  const { pools } = usePools();
  const dispatch = useAppDispatch();

  useSlowRefreshEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account, chainId));
      dispatch(fetchPoolsUserDepositDataAsync(account));
    } else {
      dispatch(resetPoolsUserData());
    }
  }, [account, chainId, pools.length, dispatch]);
};

export const usePools = (): { pools: DeserializedPool[]; userDataLoaded: boolean; dataFetched: boolean } => {
  const { pools, userDataLoaded, dataFetched } = useSelector((state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
    dataFetched: state.pools.dataFetched,
  }));
  return { pools: pools.map(transformPool), userDataLoaded, dataFetched };
};
