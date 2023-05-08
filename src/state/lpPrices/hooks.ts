import { AppId } from "config/constants/types";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "state";
import { LpTokenPricesState, State } from "state/types";
import { fetchLpTokenPrices } from ".";

export const useFetchLpTokenPrices = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWeb3React();
  const farms = useSelector((state: State) => state.zap.data[AppId.APESWAP]);
  useEffect(() => {
    dispatch(fetchLpTokenPrices(chainId, farms));
  }, [dispatch, farms, chainId]);
};

export const useLpTokenPrices = () => {
  const { isInitialized, isLoading, data }: LpTokenPricesState = useSelector((state: State) => state.lpTokenPrices);
  return { lpTokenPrices: data, isInitialized, isLoading };
};
