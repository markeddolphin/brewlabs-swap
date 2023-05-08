import { useBridgeContext } from "contexts/BridgeContext";
import { fetchTokenLimits } from "lib/bridge/bridge";
import { useBridgeDirection } from "./useBridgeDirection";

const { useState, useCallback, useEffect } = require("react");

export const useTokenLimits = () => {
  const { fromToken, toToken, currentDay }: any = useBridgeContext();
  const { bridgeDirectionId, homeChainId, foreignChainId } = useBridgeDirection();
  const [tokenLimits, setTokenLimits] = useState();
  const [fetching, setFetching] = useState(false);

  const updateTokenLimits = useCallback(async () => {
    if (
      fromToken &&
      toToken &&
      fromToken.chainId &&
      toToken.chainId &&
      (fromToken.symbol.includes(toToken.symbol) || toToken.symbol.includes(fromToken.symbol)) &&
      [homeChainId, foreignChainId].includes(fromToken.chainId) &&
      [homeChainId, foreignChainId].includes(toToken.chainId) &&
      currentDay
    ) {
      setFetching(true);
      const limits = await fetchTokenLimits(bridgeDirectionId, fromToken, toToken, currentDay);
      setTokenLimits(limits);
      setFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, homeChainId, foreignChainId, currentDay]);

  useEffect(() => {
    updateTokenLimits();
  }, [updateTokenLimits]);

  return { tokenLimits, fetching, refresh: updateTokenLimits };
};
