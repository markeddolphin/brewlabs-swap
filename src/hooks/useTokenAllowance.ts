import { Currency, CurrencyAmount } from '@brewlabs/sdk'
import { useMemo } from 'react'

import { useTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

function useTokenAllowance(token?: Currency, owner?: string, spender?: string): CurrencyAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(
    () => (token && allowance ? new CurrencyAmount(token, allowance.toString()) : undefined),
    [token, allowance],
  )
}

export default useTokenAllowance
