import BigNumber from "bignumber.js";
import { getApeFarmApr } from "utils/apr";
import { getRoi, tokenEarnedPerThousandDollarsCompounding } from "utils/compoundApyHelpers";
import { LpTokenPrices, Farm, FarmLpAprsType } from "state/types";

const cleanFarmData = (
  farmIds: number[],
  chunkedFarms: any[],
  externalVals: any[],
  lpPrices: LpTokenPrices[],
  bananaPrice: BigNumber,
  farmLpAprs: FarmLpAprsType,
  farmsConfig: Farm[]
) => {
  const data = chunkedFarms.map((chunk, index) => {
    const farmConfig = farmsConfig?.find((farm) => farm.pid === farmIds[index]);
    const filteredLpPrice = lpPrices?.find((lp) => lp.address === farmConfig.lpAddresses);
    const [
      tokenBalanceLP,
      quoteTokenBlanceLP,
      lpTokenBalanceMC,
      lpTotalSupply,
      tokenDecimals,
      quoteTokenDecimals,
      info,
      totalAllocPoint,
    ] = chunk;

    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply));
    const totalLpStaked = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(18));

    const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(18))
      .times(new BigNumber(2))
      .times(lpTokenRatio);
    const totalInQuoteToken = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(10).pow(18)).times(new BigNumber(2));

    const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio);
    const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(lpTokenRatio);

    let alloc = null;
    let multiplier = "unset";
    const allocPoint = new BigNumber(info.allocPoint._hex);
    const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint));
    alloc = poolWeight.toJSON();
    multiplier = `${allocPoint.div(100).toString()}X`;
    const totalLpStakedUsd = totalLpStaked.times(filteredLpPrice?.price);
    const apr = getApeFarmApr(poolWeight, bananaPrice, totalLpStakedUsd);
    const lpApr = farmLpAprs?.lpAprs?.find((lp) => lp.pid === farmConfig.pid)?.lpApr * 100;
    const amountEarned = tokenEarnedPerThousandDollarsCompounding({
      numberOfDays: 365,
      farmApr: lpApr ? apr + lpApr : apr,
      tokenPrice: bananaPrice,
    });

    const apy = getRoi({ amountEarned, amountInvested: 1000 / bananaPrice?.toNumber() });

    const externalInfo = externalVals[index];
    const totalRewards = new BigNumber(externalInfo.totalRewards._hex);

    return {
      ...farmConfig,
      tokenAmount: tokenAmount.toJSON(),
      quoteTokenAmount: quoteTokenAmount.toJSON(),
      totalInQuoteToken: totalInQuoteToken.toJSON(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
      tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
      liquidity: totalLpStakedUsd?.toFixed(0),
      apr,
      apy: apy?.toFixed(2),
      lpRewardsApr: lpApr,
      lpValueUsd: filteredLpPrice?.price,
      bananaPrice: bananaPrice?.toNumber(),
      poolWeight: alloc,
      multiplier,
      tokenDecimals: new BigNumber(tokenDecimals).toNumber(),
      quoteTokenDecimals: new BigNumber(quoteTokenDecimals).toNumber(),
      totalRewards: totalRewards.toJSON(),
      totalSupply: externalInfo.totalBoostedShare.toString(),
    };
  });
  return data;
};

export default cleanFarmData;
