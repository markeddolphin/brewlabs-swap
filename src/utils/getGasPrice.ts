import { ChainId } from '@brewlabs/sdk'
import BigNumber from 'bignumber.js'
import store from 'state'
import { GAS_PRICE_GWEI } from 'state/user/hooks/helpers'

/**
 * Function to return gasPrice outwith a react component
 */
export const getNetworkGasPrice = async (library, chainId) => {
  let gasPrice = await library.getGasPrice()
  if (!gasPrice) return undefined

  gasPrice = new BigNumber(gasPrice._hex)
  switch (chainId) {
    case ChainId.ETHEREUM:
      gasPrice = gasPrice.plus(5 * 1e9) // + 5 Gwei
      break
    case ChainId.FANTOM:
      gasPrice = gasPrice.multipliedBy(2)
      break
    default:
  }
  return gasPrice.toJSON()
}

const getGasPrice = (): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  const state = store.getState()
  const userGas = state.user.gasPrice || GAS_PRICE_GWEI.default
  return chainId === ChainId.BSC_MAINNET.toString() ? userGas : GAS_PRICE_GWEI.testnet
}

export default getGasPrice
