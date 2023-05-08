const getFarmLpAprs = async (chainId: number) => {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/pancakeswap/pancake-frontend/develop/apps/web/src/config/constants/lpAprs/${chainId}.json`)
    const farmLpAprs = await response.json()
    if (farmLpAprs.statusCode === 500) {
      return null
    }
    localStorage.setItem('pcs_lpAprs', JSON.stringify(farmLpAprs))
    return farmLpAprs
  } catch (error) {
    return null
  }
}

export default getFarmLpAprs
