import { ChainId } from '@brewlabs/sdk'
import masterchefABI from 'config/abi/pancakeMasterchef.json'
import { chunk } from 'lodash'
import { multicallv2 } from "utils/multicall"
import { getPancakeMasterChefAddress as getMasterChefAddress } from "utils/addressHelpers"
import { getPancakeMasterChefContract as getMasterchefContract } from "utils/contractHelpers"

const masterChefAddress = getMasterChefAddress()
const masterChefContract = getMasterchefContract()

export const fetchMasterChefFarmPoolLength = async () => {
  const poolLength = await masterChefContract.poolLength()
  return poolLength
}

const masterChefFarmCalls = (farm) => {
  const { pid } = farm
  return pid || pid === 0
    ? [
      {
        address: masterChefAddress,
        name: 'poolInfo',
        params: [pid],
      },
      {
        address: masterChefAddress,
        name: 'totalRegularAllocPoint'
      }
    ]
    : [null, null]
}

export const fetchMasterChefData = async (farms) => {
  const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter((masterChefCall) => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()
  const masterChefMultiCallResult = await multicallv2(ChainId.BSC_MAINNET, masterchefABI, masterChefAggregatedCalls)
  const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize)
  let masterChefChunkedResultCounter = 0
  return masterChefCalls.map((masterChefCall) => {
    if (masterChefCall[0] === null && masterChefCall[1] === null) {
      return [null, null]
    }
    const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter]
    masterChefChunkedResultCounter++
    return data
  })
}
