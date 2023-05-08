import { useState, useEffect } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { SUBGRAPH_NAMES } from "config/constants/swap";

export const useGraphEndPoint = () => {
  const { chainId } = useActiveWeb3React();

  const [graphEndpoint, setGraphEndPoint] = useState<string>("");

  useEffect(() => {
    if (chainId) {
      const subgraphName = SUBGRAPH_NAMES[chainId];
      setGraphEndPoint(`https://api.thegraph.com/subgraphs/name/devscninja/${subgraphName}`);
    }
  }, [chainId]);

  return graphEndpoint;
};
