import { useMemo } from "react"
import { concat } from "lodash"
import { ChainId } from "@brewlabs/sdk"
import useSWR, { SWRConfiguration } from "swr"
import { Chef } from "config/constants/types"
import { getMasterChefV1Farms, getMasterChefV2Farms } from "./fetchers"

interface useFarmsProps {
  chainId: number
  swrConfig?: SWRConfiguration
}

export function useMasterChefV1Farms({ chainId, swrConfig = undefined }: useFarmsProps) {
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? ['masterChefV1Farms'] : null, () => getMasterChefV1Farms(undefined), swrConfig)
  return useMemo(() => {
    if (!data) return []
    return data.map((datum) => ({ ...datum, chef: Chef.MASTERCHEF }))
  }, [data])
}

export function useMasterChefV2Farms({ chainId, swrConfig = undefined }: useFarmsProps) {
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? 'masterChefV2Farms' : null, () => getMasterChefV2Farms(), swrConfig)
  return useMemo(() => {
    if (!data) return []
    // @ts-ignore
    return data.map((datum) => ({ ...datum, chef: Chef.MASTERCHEF_V2 }))
  }, [data])
}

export function useSushiFarms({ chainId }: useFarmsProps) {
  const masterChefV1Farms = useMasterChefV1Farms({ chainId })
  const masterChefV2Farms = useMasterChefV2Farms({ chainId })
  return useMemo(
    () => concat(masterChefV1Farms, masterChefV2Farms).filter((pool) => pool && pool.pair),
    [masterChefV1Farms, masterChefV2Farms]
  )
}
