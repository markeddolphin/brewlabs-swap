import qs from 'qs'
import { Currency } from '@brewlabs/sdk'
import { BigNumber } from 'ethers';

export const ETHER_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const quote = async (chainId: number, fromToken: Currency, toToken: Currency, amount: BigNumber, gasPrice?: string) => {
  if (!fromToken || !toToken || amount.isZero()) return null

  const params = {
    fromTokenAddress: fromToken.isNative ? ETHER_ADDRESS : fromToken.address,
    toTokenAddress: toToken.isNative ? ETHER_ADDRESS : toToken.address,
    amount: amount.toString(),
    gasPrice
  }

  const response = await fetch(`https://api.1inch.io/v5.0/${chainId}/quote?${qs.stringify({ ...params })}`)
  const data = await response.json()

  return data
}

export const getAllowance = async (chainId: number, fromToken: Currency, account: string) => {
  if (!fromToken || !account) return null

  const params = {
    tokenAddress: fromToken.isNative ? ETHER_ADDRESS : fromToken.address,
    walletAddress: account
  }

  const response = await fetch(`https://api.1inch.io/v5.0/${chainId}/approve/allowance?${qs.stringify({ ...params })}`)
  const data = await response.json()

  return data
}

export const approve = async (chainId: number, fromToken: Currency, amount: BigNumber) => {
  if (!fromToken || amount.isZero()) return null

  const params = {
    tokenAddress: fromToken.isNative ? ETHER_ADDRESS : fromToken.address,
    amount: amount.toString()
  }

  const response = await fetch(`https://api.1inch.io/v5.0/${chainId}/approve/transaction?${qs.stringify({ ...params })}`)
  const data = await response.json()

  return data
}

export const swap = async (chainId: number, fromToken: Currency, toToken: Currency, amount: BigNumber, account: string, slippage: number, gasPrice?: string) => {
  if (!fromToken || !toToken || amount.isZero() || !account) return null

  const params = {
    fromTokenAddress: fromToken.isNative ? ETHER_ADDRESS : fromToken.address,
    toTokenAddress: toToken.isNative ? ETHER_ADDRESS : toToken.address,
    amount: amount.toString(),
    disableEstimate: true,
    fromAddress: account,
    slippage,
    gasPrice
  }

  const response = await fetch(`https://api.1inch.io/v5.0/${chainId}/swap?${qs.stringify({ ...params })}`)
  const data = await response.json()

  return data
}
