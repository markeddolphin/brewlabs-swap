import { WNATIVE } from '@brewlabs/sdk'
import { usdToken } from 'config/constants/tokens'
import { SerializedFarm } from 'state/types'

/**
 * Returns the first farm with a quote token that matches from an array of preferred quote tokens
 * @param farms Array of farms
 * @param preferredQuoteTokens Array of preferred quote tokens
 * @returns A preferred farm, if found - or the first element of the farms array
 */
export const filterFarmsByQuoteToken = (farms: SerializedFarm[], preferredQuoteTokens?: string[]): SerializedFarm => {
  let preferredFarm

  if (preferredQuoteTokens) {
    preferredFarm = farms.find((farm) => {
      return preferredQuoteTokens.some((quoteToken) => {
        return farm.quoteToken.symbol === quoteToken
      })
    })
  } else {
    preferredFarm = farms.find(
      (farm) =>
        farm.quoteToken.symbol === usdToken[farm.chainId].symbol ||
        farm.quoteToken.symbol === WNATIVE[farm.chainId].symbol,
    )
  }
  return preferredFarm || farms[0]
}

export default filterFarmsByQuoteToken
