import { gql, request } from "graphql-request";
import { GRAPH_HEALTH_ENDPOINT } from "config/constants/bridge";

const healthQuery = gql`
  query getHealthStatus($subgraph: String!) {
    status: indexingStatusForCurrentVersion(subgraphName: $subgraph) {
      synced
      health
      fatalError {
        message
        block {
          number
          hash
        }
        handler
      }
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`;

const extractStatus = ({ fatalError, synced, chains }: any) => ({
  isReachable: true,
  isFailed: !!fatalError,
  isSynced: synced,
  latestBlockNumber: Number(chains[0].latestBlock.number),
  chainHeadBlockNumber: Number(chains[0].chainHeadBlock.number),
});

const failedStatus = {
  isReachable: false,
  isFailed: true,
  isSynced: false,
  latestBlockNumber: 0,
  chainHeadBlockNumber: 0,
};

export const getHealthStatus = async (subgraph: any) => {
  try {
    const data: any = await request(GRAPH_HEALTH_ENDPOINT, healthQuery, {
      subgraph,
    });
    return extractStatus(data.status);
  } catch (graphHealthError) {
    console.error(`Error getting subgraph health for ${subgraph}`, graphHealthError);
    return failedStatus;
  }
};
