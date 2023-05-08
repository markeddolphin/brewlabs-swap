import { FAST_INTERVAL, SLOW_INTERVAL, BIGSLOW_INTERVAL, DAY_INTERVAL, MEDIUM_INTERVAL } from "config/constants";
import { DependencyList, EffectCallback, useEffect } from "react";
import useSWR from "swr";
import { useActiveChainId } from "./useActiveChainId";

type BlockEffectCallback = (blockNumber: number) => ReturnType<EffectCallback>;

export function useFastRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { chainId } = useActiveChainId();
  const { data = 0 } = useSWR([FAST_INTERVAL, "blockNumber", chainId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || [])]);
}

export function useMediumRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { chainId } = useActiveChainId();
  const { data = 0 } = useSWR([MEDIUM_INTERVAL, "blockNumber", chainId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || [])]);
}

export function useSlowRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { chainId } = useActiveChainId();
  const { data = 0 } = useSWR([SLOW_INTERVAL, "blockNumber", chainId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || [])]);
}

export function useBigSlowRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { chainId } = useActiveChainId();
  const { data = 0 } = useSWR([BIGSLOW_INTERVAL, "blockNumber", chainId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || [])]);
}

export function useDailyRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { chainId } = useActiveChainId();
  const { data = 0 } = useSWR([DAY_INTERVAL, "blockNumber", chainId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || [])]);
}
