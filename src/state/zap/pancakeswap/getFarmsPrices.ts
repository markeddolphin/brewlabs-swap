import { FixedNumber } from '@ethersproject/bignumber'
import { FIXED_ZERO, FIXED_ONE } from "utils/bigNumber"
import { filterFarmsByQuoteToken } from "utils/farmsPriceHelpers"
import { tokens } from "config/constants/tokens"
import { ChainId } from "@brewlabs/sdk"

const getFarmFromTokenSymbol = (
  farms,
  tokenSymbol,
  preferredQuoteTokens = ['BUSD', 'WBNB']
) => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const getFarmBaseTokenPrice = (
  farm,
  quoteTokenFarm,
  bnbPriceBusd
) => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === tokens[ChainId.BSC_MAINNET].busd.symbol) {
    return hasTokenPriceVsQuote ? FixedNumber.from(farm.tokenPriceVsQuote) : FIXED_ZERO
  }

  if (farm.quoteToken.symbol === tokens[ChainId.BSC_MAINNET].wbnb.symbol) {
    return hasTokenPriceVsQuote ? bnbPriceBusd.mulUnsafe(FixedNumber.from(farm.tokenPriceVsQuote)) : FIXED_ZERO
  }

  if (!quoteTokenFarm) {
    return FIXED_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === tokens[ChainId.BSC_MAINNET].wbnb.symbol) {
    const quoteTokenInBusd = bnbPriceBusd.mulUnsafe(FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote))
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? FixedNumber.from(farm.tokenPriceVsQuote).mulUnsafe(quoteTokenInBusd)
      : FIXED_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === tokens[ChainId.BSC_MAINNET].busd.symbol) {
    const quoteTokenInBusd = FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? FixedNumber.from(farm.tokenPriceVsQuote).mulUnsafe(quoteTokenInBusd)
      : FIXED_ZERO
  }

  return FIXED_ZERO
}

const getFarmQuoteTokenPrice = (
  farm,
  quoteTokenFarm,
  bnbPriceBusd
) => {
  if (farm.quoteToken.symbol === 'BUSD') {
    return FIXED_ONE
  }

  if (farm.quoteToken.symbol === 'WBNB') {
    return bnbPriceBusd
  }

  if (!quoteTokenFarm) {
    return FIXED_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'WBNB') {
    return quoteTokenFarm.tokenPriceVsQuote ? bnbPriceBusd.mulUnsafe(FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote)) : FIXED_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
    return quoteTokenFarm.tokenPriceVsQuote ? FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote) : FIXED_ZERO
  }

  return FIXED_ZERO
}

const getFarmsPrices = (farms) => {
  const bnbBusdFarm = farms.find((farm) => farm.token.symbol === 'BUSD' && farm.quoteToken.symbol === 'WBNB')
  const bnbPriceBusd = bnbBusdFarm.tokenPriceVsQuote ? FIXED_ONE.divUnsafe(FixedNumber.from(bnbBusdFarm.tokenPriceVsQuote)) : FIXED_ONE
  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    const tokenPriceBusd = getFarmBaseTokenPrice(farm, quoteTokenFarm, bnbPriceBusd)
    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(farm, quoteTokenFarm, bnbPriceBusd)

    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toString(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toString(),
    }
  })

  return farmsWithPrices
}

export default getFarmsPrices
