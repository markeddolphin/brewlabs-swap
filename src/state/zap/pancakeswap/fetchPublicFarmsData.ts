import { ChainId } from "@brewlabs/sdk"
import erc20 from 'config/abi/erc20.json'
import { chunk } from "lodash"
import { getPancakeMasterChefAddress as getMasterChefAddress } from "utils/addressHelpers"
import { multicallv2 } from "utils/multicall"

const fetchFarmCalls = (farm) => {
  const { lpAddress, token, quoteToken } = farm

  return [
    {
      address: token.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    {
      address: quoteToken.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [getMasterChefAddress()],
    },
    {
      address: lpAddress,
      name: 'totalSupply'
    },
    {
      address: token.address,
      name: 'decimals',
    },
    {
      address: quoteToken.address,
      name: 'decimals',
    },
  ]
}

export const fetchPublicFarmsData = async (farms): Promise<any[]> => {
  const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm))
  const chunkSize = farmCalls.length / farms.length
  const farmMultiCallResult = await multicallv2(ChainId.BSC_MAINNET, erc20, farmCalls)
  return chunk(farmMultiCallResult, chunkSize)
}
