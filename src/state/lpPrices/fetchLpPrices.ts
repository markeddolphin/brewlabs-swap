import apePriceGetterABI from "config/abi/apePriceGetter.json";
import { Farm } from "state/types";
import { getApePriceGetterAddress } from "utils/addressHelpers";
import { getBalanceNumber } from "utils/formatBalance";
import multicall from "utils/multicall";

const fetchLpPrices = async (chainId, farmsConfig: Farm[]) => {
  const apePriceGetterAddress = getApePriceGetterAddress(chainId);
  const tokensToCall = Object.keys(farmsConfig).filter(
    (token) => farmsConfig[token].lpAddresses[chainId] !== undefined
  );
  const calls = tokensToCall.map((token) => {
    return {
      address: apePriceGetterAddress,
      name: "getLPPrice",
      params: [farmsConfig[token].lpAddresses[chainId], 18],
    };
  });
  const tokenPrices = await multicall(apePriceGetterABI, calls, chainId);
  const mappedTokenPrices = tokensToCall.map((token, i) => {
    return {
      symbol: farmsConfig[token].lpSymbol,
      address: farmsConfig[token].lpAddresses,
      price: getBalanceNumber(tokenPrices[i], 18),
      decimals: 18,
      pid: farmsConfig[token].pid,
    };
  });
  return mappedTokenPrices;
};

export default fetchLpPrices;
