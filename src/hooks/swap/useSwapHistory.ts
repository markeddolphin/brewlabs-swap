import { useState } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useFastRefreshEffect } from "hooks/useRefreshEffect";
import { useGraphEndPoint } from "./useGraphEndPoint";
import { getSwapLogs } from "lib/swap/history";

export const useSwapHistory = () => {
  const { account, chainId } = useActiveWeb3React();

  const [swapLogs, setSwapLogs] = useState<any[]>([]);

  const graphEndPoint = useGraphEndPoint();

  useFastRefreshEffect(() => {
    let isSubscribed = true;

    async function update() {
      const _swapLogs = await getSwapLogs(graphEndPoint, account, chainId);
      if (isSubscribed) setSwapLogs(_swapLogs);
    }

    update();

    return () => {
      isSubscribed = false;
    };
  }, [graphEndPoint, account]);

  return swapLogs;
};
