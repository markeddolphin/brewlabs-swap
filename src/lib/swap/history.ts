import { ChainId } from "@brewlabs/sdk";
import { gql, request } from "graphql-request";
import { waitForTransaction } from '@wagmi/core'

const pageSize = 1000;

const swapLogQuery = gql`
  query getSwapLogs($caller: String!, $first: Int!, $skip: Int!) {
    logs: brewlabsSwaps(orderDirection: desc, first: $first, skip: $skip) {
      id
      _tokenIn
      _tokenOut
      _amountIn
      _amountOut
      transactionHash
    }
  }
`;

export const getSwapLogs = async (graphEndpoint: string, caller: string, chainId: ChainId) => {
  let logs: any[] = [];
  let page = 0;
  const first = pageSize;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const data: any = await request(graphEndpoint, swapLogQuery, {
        first,
        skip: page * pageSize,
        caller,
      });
      if (data) {
        logs = data.logs.concat(logs);
      }
      if (!data || data.logs.length < pageSize) break;
      page += 1;
    } catch (graphError) {
      console.error({ graphError });
      break;
    }
  }
  const senders = await Promise.all(logs.map(async (log) => {
    const {transactionHash} = log;
    const receipt = await waitForTransaction({chainId, hash: transactionHash})
    return receipt.from;
  }))
  return logs.filter((log, index) => senders[index] === caller).slice(0, 10);
};
