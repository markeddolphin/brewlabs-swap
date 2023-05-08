import qs from 'qs'
import { ChainId, Currency, WNATIVE } from "@brewlabs/sdk"

const chains = {
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.BSC_MAINNET]: 'bsc2'
}

export const getTokenInfo = async (chainId: ChainId, token: Currency) => {
  const params = {
    chain: chains[chainId],
    token: token.isNative ? WNATIVE[chainId].address : token.address
  }

  try {
    const response = await fetch(`https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot?${qs.stringify({ ...params })}`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

// export const detecthoneypot = async () => {
//   const response = await fetch('https://honeypotapi.p.rapidapi.com/api/v1/scan/?factory_address=0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73&token_b=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&chain=bsc&exchange=Pancakeswap+v2&token_a=0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7&router_address=0x10ED43C718714eb63d5aA57B78B54704E256024E', {
//     method: 'GET',
//     headers: { 'x-rapidapi-key': '4d8bf74d9emshb1397907330fdd1p14107bjsnd36afd004063' }
//   })
//   const data = await response.json()

//   console.log('response', data)
// }