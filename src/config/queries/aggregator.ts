import { gql } from "graphql-request";

export const SWAP_LOGS = gql`
query getSwapLogs($caller: String!, $first: Int!, $skip: Int!) {
  logs: brewlabsSwaps(orderDirection: desc, first: $first, skip: $skip, _sender: $caller) {
    id
    _tokenIn
    _tokenOut
    _amountIn
    _amountOut
    transactionHash
  }
}
`;