import { ChainId } from "@brewlabs/sdk"

const getCurrencyId = (chainId: ChainId | 0, address: string | undefined, isLiquidityToken = false) => {
  if(isLiquidityToken) return `c${chainId}_l${address?.toLowerCase()}`
  return `c${chainId}_t${address?.toLowerCase()}`
}

export default getCurrencyId
