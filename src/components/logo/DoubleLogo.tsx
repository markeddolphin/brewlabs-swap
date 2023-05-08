import React from 'react'
import { Currency } from '@brewlabs/sdk'
import { AppId } from 'config/constants/types'
import CurrencyLogo from './CurrencyLogo'

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
  appId?: AppId
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 20,
  margin = false,
  appId
}: DoubleCurrencyLogoProps) {
  return (
    <div className='flex mr-1'>
      {currency0 && <CurrencyLogo currency={currency0} size={`${size.toString()}px`} style={{ marginRight: '4px' }} appId={appId} />}
      {currency1 && <CurrencyLogo currency={currency1} size={`${size.toString()}px`} appId={appId} />}
    </div>
  )
}
