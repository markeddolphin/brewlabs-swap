import { useEffect } from "react";
import { useSelector } from "react-redux";

import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { useAppDispatch } from "state";
import { State } from "state/types";
import { fetchFarmFactoryDataAsync } from ".";

export const usePollFarmFactoryData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    PAGE_SUPPORTED_CHAINS["deployer"].forEach((chainId) => dispatch(fetchFarmFactoryDataAsync(chainId)));
  }, [dispatch]);
};

export const useFarmFactories = (chainId) =>
  useSelector((state: State) => state.deploy.farm.find((data) => data.chainId === chainId));
