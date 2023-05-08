import { Currency, JSBI, Price, WNATIVE } from "@brewlabs/sdk";
import { useContext, useEffect, useMemo, useState } from "react";

import { usdToken, brewsToken } from "config/constants/tokens";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import getCurrencyId from "utils/getCurrencyId";
import { wrappedCurrency } from "utils/wrappedCurrency";
import { useActiveChainId } from "./useActiveChainId";
import { PairState, usePairs } from "./usePairs";

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useUsdPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveChainId();
  const wrapped = wrappedCurrency(currency, chainId);
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && currency?.isNative ? undefined : currency, chainId ? WNATIVE[chainId] : undefined],
      [wrapped?.equals(usdToken[chainId]) ? undefined : wrapped, usdToken[chainId]],
      [chainId ? WNATIVE[chainId] : undefined, usdToken[chainId]],
    ],
    [chainId, currency, wrapped]
  );
  const [[ethPairState, ethPair], [busdPairState, busdPair], [busdEthPairState, busdEthPair]] = usePairs(tokenPairs);

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined;
    }
    // handle weth/eth
    if (wrapped.equals(WNATIVE[chainId])) {
      if (busdPair) {
        const price = busdPair.priceOf(WNATIVE[chainId]);
        return new Price(currency, usdToken[chainId], price.denominator, price.numerator);
      }
      return undefined;
    }
    // handle busd
    if (wrapped.equals(usdToken[chainId])) {
      return new Price(usdToken[chainId], usdToken[chainId], "1", "1");
    }

    const ethPairETHAmount = ethPair?.reserveOf(WNATIVE[chainId]);
    const ethPairETHBUSDValue: JSBI =
      ethPairETHAmount && busdEthPair
        ? busdEthPair.priceOf(WNATIVE[chainId]).quote(ethPairETHAmount).raw
        : JSBI.BigInt(0);

    // all other tokens
    // first try the busd pair
    if (
      busdPairState === PairState.EXISTS &&
      busdPair &&
      busdPair.reserveOf(usdToken[chainId]).greaterThan(ethPairETHBUSDValue)
    ) {
      const price = busdPair.priceOf(wrapped);
      return new Price(currency, usdToken[chainId], price.denominator, price.numerator);
    }
    if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
      if (
        busdEthPair.reserveOf(usdToken[chainId]).greaterThan("0") &&
        ethPair.reserveOf(WNATIVE[chainId]).greaterThan("0")
      ) {
        const ethBusdPrice = busdEthPair.priceOf(usdToken[chainId]);
        const currencyEthPrice = ethPair.priceOf(WNATIVE[chainId]);
        const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert();
        return new Price(currency, usdToken[chainId], busdPrice.denominator, busdPrice.numerator);
      }
    }

    return undefined;
  }, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped]);
}

export const useBrewsUsdPrice = (): number | undefined => {
  const { chainId } = useActiveChainId();
  const { tokenPrices } = useContext(TokenPriceContext);

  const brewsPrice = tokenPrices[getCurrencyId(chainId, brewsToken[chainId]?.address)];
  return brewsPrice;
};

export const useNativeTokenPrice = (): Price | undefined => {
  const { chainId } = useActiveChainId();
  const nativeTokenPrice = useUsdPrice(WNATIVE[chainId]);
  return nativeTokenPrice;
};

export const useBrewsCoingeckoPrice = () => {
  const [brewsPrice, setBrewsPrice] = useState(0);
  const { prices }: any = useContext(TokenPriceContext);

  useEffect(() => {
    setBrewsPrice(prices.brewlabs?.usd || 0);
  }, [prices]);

  return brewsPrice;
};
