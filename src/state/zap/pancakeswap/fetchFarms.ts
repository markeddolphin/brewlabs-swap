import { FixedNumber, BigNumber } from "@ethersproject/bignumber";
import { FIXED_TWO, FIXED_ZERO } from "utils/bigNumber";
import { fetchPublicFarmsData } from "./fetchPublicFarmsData";
import { fetchMasterChefData } from "./fetchMasterChefData";
import { fetchExternalMasterChefData } from "./fetchExternalMasterChefData";

export const getTokenAmount = (balance: FixedNumber, decimals: number) => {
  const tokenDividerFixed = FixedNumber.from(BigNumber.from(10).pow(decimals));
  return balance.divUnsafe(tokenDividerFixed);
};

const fetchFarms = async (farmsToFetch) => {
  const [farmResult, masterChefResult, externalMasterchefResult] = await Promise.all([
    fetchPublicFarmsData(farmsToFetch),
    fetchMasterChefData(farmsToFetch),
    fetchExternalMasterChefData(farmsToFetch),
  ]);

  return farmsToFetch.map((farm, index) => {
    const [
      [_tokenBalanceLP],
      [_quoteTokenBalanceLP],
      [_lpTokenBalanceMC],
      [_lpTotalSupply],
      [tokenDecimals],
      [quoteTokenDecimals],
    ] = farmResult[index];
    const tokenBalanceLP = FixedNumber.from(_tokenBalanceLP);
    const quoteTokenBalanceLP = FixedNumber.from(_quoteTokenBalanceLP);
    const lpTokenBalanceMC = FixedNumber.from(_lpTokenBalanceMC);
    const lpTotalSupply = FixedNumber.from(_lpTotalSupply);

    const [info, [totalRegularAllocPoint]] = masterChefResult[index];
    const externalInfo = externalMasterchefResult[index];

    const lpTokenRatio = !lpTotalSupply.isZero() ? lpTokenBalanceMC.divUnsafe(lpTotalSupply) : FIXED_ZERO;
    const tokenAmountTotal = getTokenAmount(tokenBalanceLP, tokenDecimals);
    const quoteTokenAmountTotal = getTokenAmount(quoteTokenBalanceLP, quoteTokenDecimals);
    // Amount of quoteToken in the LP that are staked in the MC
    const quoteTokenAmountMc = quoteTokenAmountTotal.mulUnsafe(lpTokenRatio);
    const lpTotalInQuoteToken = quoteTokenAmountMc.mulUnsafe(FIXED_TWO);

    const allocPoint = info ? FixedNumber.from(info.allocPoint) : FIXED_ZERO;
    const poolWeight = totalRegularAllocPoint
      ? allocPoint.divUnsafe(FixedNumber.from(totalRegularAllocPoint))
      : FIXED_ZERO;
    const totalRewards = externalInfo ? FixedNumber.from(externalInfo.totalRewards) : FIXED_ZERO;

    return {
      ...farm,
      token: farm.token,
      quoteToken: farm.quoteToken,
      tokenAmountTotal: tokenAmountTotal.toString(),
      quoteTokenAmountTotal: quoteTokenAmountTotal.toString(),
      lpTotalSupply: lpTotalSupply.toString(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
      tokenPriceVsQuote: !tokenAmountTotal.isZero()
        ? quoteTokenAmountTotal.divUnsafe(tokenAmountTotal).toString()
        : FIXED_ZERO.toString(),
      totalSupply: externalInfo.totalBoostedShare.toString(),
      poolWeight: poolWeight.toString(),
      multiplier: !allocPoint.isZero() ? `${allocPoint.divUnsafe(FixedNumber.from(100)).toString()}X` : `0X`,
      totalRewards: totalRewards.toString(),
    };
  });
};

export default fetchFarms;
