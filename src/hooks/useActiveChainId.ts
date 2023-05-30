import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { useNetwork } from "wagmi";

import { bsc } from "contexts/wagmi";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { useGlobalState } from "state";
import { isChainSupported } from "utils/wagmi";
import { useReplaceQueryParams } from "./useReplaceQueryParams";

export const useQueryChainId = () => {
  const router = useRouter();
  const { replaceQueryParams } = useReplaceQueryParams();
  const { query } = router;

  const [queryChainId, setQueryChainId] = useState(-1);

  useEffect(() => {
    const page = router.pathname.split("/")[1];
    if (query.chainId === undefined) return;
    if (typeof query.chainId !== "string") return;
    if (!PAGE_SUPPORTED_CHAINS[page]) return;

    if (!PAGE_SUPPORTED_CHAINS[page].includes(+query.chainId)) {
      replaceQueryParams("chainId", PAGE_SUPPORTED_CHAINS[page][0]);
    }
    setQueryChainId(+query.chainId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.chainId]);

  return queryChainId;
};

export function useLocalNetworkChain() {
  const [sessionChainId] = useGlobalState("sessionChainId");
  const queryChainId = useQueryChainId();

  const chainId = +(sessionChainId || queryChainId);
  if (isChainSupported(chainId)) {
    return chainId;
  }

  return undefined;
}

export const useActiveChainId = (): { chainId: ChainId; isWrongNetwork: any; isNotMatched: any } => {
  const { chain } = useNetwork();

  const localChainId = useLocalNetworkChain();
  const queryChainId = useQueryChainId();

  const chainId = localChainId ?? chain?.id ?? (queryChainId <= 0 ? bsc.id : queryChainId);
  const isNotMatched = useMemo(() => chain && localChainId && chain.id !== localChainId, [chain, localChainId]);

  return {
    chainId,
    isWrongNetwork: (chain?.unsupported ?? false) || isNotMatched,
    isNotMatched,
  };
};
