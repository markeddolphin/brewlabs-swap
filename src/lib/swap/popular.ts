import { ChainId } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { gql, request } from "graphql-request";

const pageSize = 1000;

const swapLogQuery = gql`
  query getSwapLogs($caller: String!, $first: Int!, $skip: Int!) {
    logs: SwapTokens(where: { caller: $caller }, orderBy: timestamp, orderDirection: desc, first: $first, skip: $skip) {
      id
      caller
      srcToken
      dstToken
      spentAmount
      returnAmount
    }
  }
`;

export const getSwapLogs = async (graphEndpoint: string, caller: string) => {
  let logs: any[] = [];
  let page = 0;
  const first = pageSize;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const data = await request(graphEndpoint, swapLogQuery, {
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

  return { logs };
};
