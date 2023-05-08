import { Currency, Token } from '@brewlabs/sdk'

export function currencyId(currency: Currency): string {
  if (currency.isNative) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
