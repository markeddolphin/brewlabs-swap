import { ChainId } from "@brewlabs/sdk";
import { stringify } from "qs";
import useSWR, { SWRConfiguration } from "swr";
import { addSeconds, getUnixTime, startOfHour, startOfMinute, startOfSecond, subDays } from "date-fns";
import { getAverageBlockTime, getBlock, getMasterChefV1SushiPerBlock, getMasterChefV1TotalAllocPoint, getNativePrice, getPairs, getSushiPrice } from "./fetchers";

interface GraphProps {
  chainId?: ChainId
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useOneDayBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 1))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useBlock({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  return useSWR(
    shouldFetch ? ['block', chainId, stringify(variables)] : null,
    () => getBlock(chainId, variables),
    swrConfig
  )
}

export function useSushiPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  return useSWR(
    shouldFetch ? ['sushiPairs', chainId, stringify(variables)] : null,
    () => getPairs(chainId, variables),
    swrConfig
  )
}

export function useAverageBlockTime({
  chainId = ChainId.ETHEREUM,
  swrConfig = undefined,
}: GraphProps) {
  return useSWR(chainId ? ['averageBlockTime', chainId] : null, () => getAverageBlockTime(chainId), swrConfig)
}

export function useMasterChefV1TotalAllocPoint(swrConfig = undefined) {
  return useSWR('masterChefV1TotalAllocPoint', () => getMasterChefV1TotalAllocPoint(), swrConfig)
}

export function useMasterChefV1SushiPerBlock(swrConfig = undefined) {
  return useSWR('masterChefV1SushiPerBlock', () => getMasterChefV1SushiPerBlock(), swrConfig)
}

export function useSushiPrice(swrConfig: SWRConfiguration = undefined) {
  return useSWR(['sushiPrice'], () => getSushiPrice(), swrConfig)
}

export function useEthPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  return useSWR(['ethPrice'], () => getNativePrice(variables), swrConfig)
}
