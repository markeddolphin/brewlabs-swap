import { useState } from "react";
import { useAccount } from "wagmi";
import { useFastRefreshEffect } from "hooks/useRefreshEffect";
import { combineRequestsWithExecutions, getExecutions, getRequests } from "lib/bridge/history";
import { useBridgeDirection } from "./useBridgeDirection";

export const useUserHistory = () => {
  const { homeChainId, foreignChainId, getGraphEndpoint } = useBridgeDirection();
  const { address: account } = useAccount();

  const [transfers, setTransfers] = useState<any[]>([]);
  const [allTransfers, setAllTransfers] = useState<any[]>([]);
  const [curPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useFastRefreshEffect(() => {
    let isSubscribed = true;
    async function update() {
      if (!account) {
        setTransfers([]);
        return;
      }

      setLoading(true);
      const [{ requests: homeRequests }, { requests: foreignRequests }] = await Promise.all([
        getRequests(getGraphEndpoint(homeChainId), account),
        getRequests(getGraphEndpoint(foreignChainId), account),
      ]);
      const [{ executions: homeExecutions }, { executions: foreignExecutions }] = await Promise.all([
        getExecutions(getGraphEndpoint(homeChainId), foreignRequests),
        getExecutions(getGraphEndpoint(foreignChainId), homeRequests),
      ]);
      const homeTransfers = combineRequestsWithExecutions(homeRequests, foreignExecutions, homeChainId, foreignChainId);
      const foreignTransfers = combineRequestsWithExecutions(
        foreignRequests,
        homeExecutions,
        foreignChainId,
        homeChainId
      );
      const allTransfers = [...homeTransfers, ...foreignTransfers].sort((a, b) => a.timestamp - b.timestamp);
      if (isSubscribed) {
        setTransfers(allTransfers);
        setLoading(false);
      }
    }

    async function updateAll() {
      setLoading(true);
      const [{ requests: homeRequests }, { requests: foreignRequests }] = await Promise.all([
        getRequests(getGraphEndpoint(homeChainId)),
        getRequests(getGraphEndpoint(foreignChainId)),
      ]);
      const [{ executions: homeExecutions }, { executions: foreignExecutions }] = await Promise.all([
        getExecutions(getGraphEndpoint(homeChainId), foreignRequests),
        getExecutions(getGraphEndpoint(foreignChainId), homeRequests),
      ]);
      const homeTransfers = combineRequestsWithExecutions(homeRequests, foreignExecutions, homeChainId, foreignChainId);
      const foreignTransfers = combineRequestsWithExecutions(
        foreignRequests,
        homeExecutions,
        foreignChainId,
        homeChainId
      );
      const allTransfers = [...homeTransfers, ...foreignTransfers].sort((a, b) => b.timestamp - a.timestamp);
      if (isSubscribed) {
        setAllTransfers(allTransfers);
        setLoading(false);
      }
    }

    update();
    updateAll();

    return () => {
      isSubscribed = false;
    };
  }, [homeChainId, foreignChainId, account, getGraphEndpoint]);

  const loadMoreTransfers = () => {
    setCurrentPage(curPage + 1);
  };

  return { transfers, loadMoreTransfers, allTransfers, curPage, loading };
};
