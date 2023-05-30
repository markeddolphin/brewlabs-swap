import { ChainId } from '@brewlabs/sdk'
import { startOfHour, getUnixTime, subHours } from 'date-fns'
import { request } from 'graphql-request'
import {
  blocksQuery,
  ethPriceQuery,
  masterChefV1SushiPerBlockQuery,
  masterChefV1TotalAllocPointQuery,
  pairsQuery,
  poolsQuery,
  poolsV2Query,
  tokenPriceQuery,
  tokenSubsetQuery,
} from './queries'
import { pager } from './pager'

export const GRAPH_HOST = {
  [ChainId.ETHEREUM]: 'https://api.thegraph.com',
}

export const EXCHANGE = {
  [ChainId.ETHEREUM]: 'sushiswap/exchange',
}

export const BLOCKS = {
  [ChainId.ETHEREUM]: 'blocklytics/ethereum-blocks',
}

const fetcher = async (chainId = ChainId.ETHEREUM, query, variables = undefined) => {
  return request(`${GRAPH_HOST[chainId]}/subgraphs/name/${BLOCKS[chainId]}`, query, variables) as any
}

export const MASTERCHEF_V2 = {
  [ChainId.ETHEREUM]: 'sushiswap/master-chefv2',
}

export const masterChefV2 = async (query, chainId = ChainId.ETHEREUM, variables = undefined) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V2[chainId]}`, query, variables) as any

export const MASTERCHEF_V1 = {
  [ChainId.ETHEREUM]: 'jiro-ono/masterchef-staging',
}

export const masterChefV1 = async (query, chainId = ChainId.ETHEREUM, variables = undefined) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V1[chainId]}`, query, variables) as any

export const getMasterChefV1TotalAllocPoint = async () => {
  const {
    masterChef: { totalAllocPoint },
  } = await masterChefV1(masterChefV1TotalAllocPointQuery)
  return totalAllocPoint
}

export const getMasterChefV1SushiPerBlock = async () => {
  const {
    masterChef: { sushiPerBlock },
  } = await masterChefV1(masterChefV1SushiPerBlockQuery)
  return sushiPerBlock / 1e18
}

export const getMasterChefV1Farms = async (variables = undefined) => {
  const { pools } = await masterChefV1(poolsQuery, undefined, variables)
  return pools
}

export const getTokenSubset = async (chainId = ChainId.ETHEREUM, variables) => {
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

export const getMasterChefV2Farms = async (variables = undefined) => {
  const { pools } = await masterChefV2(poolsV2Query, undefined, variables)

  const tokens = await getTokenSubset(ChainId.ETHEREUM, {
    tokenAddresses: Array.from(pools.map((pool) => pool.rewarder.rewardToken)),
  })

  return pools.map((pool) => ({
    ...pool,
    rewardToken: {
      ...tokens.find((token) => token.id === pool.rewarder.rewardToken),
    },
  }))
}

export const exchange = async (chainId = ChainId.ETHEREUM, query, variables = {}) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`, query, variables)

export const getPairs = async (chainId = ChainId.ETHEREUM, variables: any = undefined, query = pairsQuery) => {
  const { pairs } = await exchange(chainId, query, variables)
  return pairs
}

export const getBlock = async (chainId = ChainId.ETHEREUM, variables) => {
  const { blocks } = await fetcher(chainId, blocksQuery, variables)

  return { number: Number(blocks?.[0]?.number) }
}

export const getBlocks = async (chainId = ChainId.ETHEREUM, variables) => {
  const { blocks } = await fetcher(chainId, blocksQuery, variables)
  return blocks
}

export const getAverageBlockTime = async (chainId = ChainId.ETHEREUM) => {
  const now = startOfHour(Date.now())
  const blocks = await getBlocks(chainId, {
    where: {
      timestamp_gt: getUnixTime(subHours(now, 6)),
      timestamp_lt: getUnixTime(now),
    },
  })

  const averageBlockTime = blocks?.reduce(
    (previousValue, currentValue, currentIndex) => {
      if (previousValue.timestamp) {
        const difference = previousValue.timestamp - currentValue.timestamp

        // eslint-disable-next-line no-param-reassign, operator-assignment
        previousValue.averageBlockTime = previousValue.averageBlockTime + difference
      }

      // eslint-disable-next-line no-param-reassign
      previousValue.timestamp = currentValue.timestamp

      if (currentIndex === blocks.length - 1) {
        return previousValue.averageBlockTime / blocks.length
      }

      return previousValue
    },
    { timestamp: null, averageBlockTime: 0 },
  )

  return averageBlockTime
}

export const getTokenPrice = async (chainId = ChainId.ETHEREUM, query, variables) => {
  const nativePrice = await getNativePrice(chainId)

  const { token } = await exchange(chainId, query, variables)
  return token?.derivedETH * nativePrice
}

export const getNativePrice = async (chainId = ChainId.ETHEREUM, variables: any = undefined) => {
  const data = await getBundle(chainId, undefined, variables)
  return data?.bundles[0]?.ethPrice
}

export const getSushiPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.ETHEREUM, tokenPriceQuery, {
    id: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    ...variables,
  })
}

export const getBundle = async (
  chainId = ChainId.ETHEREUM,
  query = ethPriceQuery,
  variables = {
    id: 1,
  },
) => {
  return exchange(chainId, query, variables)
}
