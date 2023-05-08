import apePriceGetterABI from "config/abi/apePriceGetter.json";
import { getApePriceGetterAddress, getNativeWrappedAddress } from "./addressHelpers";
import multicall from "./multicall";
import { getBalanceNumber } from "./formatBalance";

export const getTokenUsdPrice = async (
  chainId: number,
  tokenAddress: string,
  tokenDecimal: number,
  lp?: boolean,
  isNative?: boolean
) => {
  const priceGetterAddress = getApePriceGetterAddress(chainId);
  const nativeTokenAddress = getNativeWrappedAddress(chainId);
  if (!priceGetterAddress) return 0;
  if ((tokenAddress || isNative) && tokenDecimal) {
    const call = lp
      ? {
          address: priceGetterAddress,
          name: "getLPPrice",
          params: [tokenAddress, 18],
        }
      : {
          address: priceGetterAddress,
          name: "getPrice",
          params: [isNative ? nativeTokenAddress : tokenAddress, tokenDecimal],
        };

    const tokenPrice = await multicall(apePriceGetterABI, [call], chainId);
    const filterPrice = getBalanceNumber(tokenPrice[0], tokenDecimal);
    return filterPrice;
  }
  return null;
};
