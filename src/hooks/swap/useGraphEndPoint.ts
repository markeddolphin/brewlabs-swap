import { useState, useEffect } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { AGGREGATOR_SUBGRAPH_NAMES, ROUTER_SUBGRAPH_NAMES } from "config/constants/swap";

export const useGraphEndPoint = () => {
  const { chainId } = useActiveWeb3React();

  const [graphEndpoint, setGraphEndPoint] = useState<{[path: string]: string}>({});

  useEffect(() => {
    if (chainId) {
      setGraphEndPoint({
        aggregator: `https://api.thegraph.com/subgraphs/name/devscninja/${AGGREGATOR_SUBGRAPH_NAMES[chainId]}`,
        router: `https://api.thegraph.com/subgraphs/name/devscninja/${ROUTER_SUBGRAPH_NAMES[chainId]}`
      })
    }
  }, [chainId]);

  return graphEndpoint;
};
