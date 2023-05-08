import { AppId } from "config/constants/types"
import { FarmConfig } from "state/types"
import { getExternalMasterChefAddress, getMasterApeAddress } from "utils/addressHelpers"
import { Call } from "utils/multicall"

const fetchFarmCalls = (farm: FarmConfig, chainId: number): Call[] => {
  const masterChefAddress = getMasterApeAddress(chainId)
  const lpAddress = farm.lpAddresses[chainId]
  const calls = [
    {
      address: farm.tokenAddresses[chainId],
      name: 'balanceOf',
      params: [lpAddress]
    },
    {
      address: farm.quoteTokenAdresses[chainId],
      name: 'balanceOf',
      params: [lpAddress],
    },
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [masterChefAddress]
    },
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    {
      address: farm.tokenAddresses[chainId],
      name: 'decimals',
    },
    {
      address: farm.quoteTokenAdresses[chainId],
      name: 'decimals',
    },
    {
      address: masterChefAddress,
      name: 'poolInfo',
      params: [farm.pid]
    },
    {
      address: masterChefAddress,
      name: 'totalAllocPoint',
    },
  ]
  return calls
}

export const fetchExternalCall = (farm: FarmConfig): Call => {
  const masterChefAddress = getExternalMasterChefAddress(AppId.APESWAP)
  const call = {
    address: masterChefAddress,
    name: 'poolInfo',
    params: [farm.pid]
  }
  return call
}

export default fetchFarmCalls
