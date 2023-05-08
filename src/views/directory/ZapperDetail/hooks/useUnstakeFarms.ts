import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { getNetworkGasPrice } from 'utils/getGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useExternalMasterchef } from 'hooks/useContract'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { calculateGasMargin } from 'utils'
import { Chef } from 'config/constants/types'

const unstakeFarm = async (masterChefContract, pid, amount, earningTokenAddress, performanceFee, gasPrice) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  let gasLimit = await masterChefContract.estimateGas.zapOut(pid, value, earningTokenAddress, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit)

  const tx = await masterChefContract.zapOut(pid, value, earningTokenAddress, { gasPrice, gasLimit, value: performanceFee })
  const receipt = await tx.wait()
  return receipt.status
}

const useUnstakeFarms = (chef = Chef.MASTERCHEF, pid: number, earningTokenAddress: string, performanceFee: BigNumber) => {
  const { chainId, library } = useActiveWeb3React()
  const masterChefContract = useExternalMasterchef(true, chef)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const gasPrice = await getNetworkGasPrice(library, chainId)
      await unstakeFarm(masterChefContract, pid, amount, earningTokenAddress, performanceFee.toString(), gasPrice)
    },
    [masterChefContract, pid, earningTokenAddress, chainId, library, performanceFee],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
