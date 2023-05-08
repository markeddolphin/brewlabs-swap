import { ChainId, WNATIVE } from "@brewlabs/sdk";
import { CHAIN_KEYS } from "config/constants/networks";
import { ASSET_PATH } from "config/constants/endpoints";
import { BAD_SRCS, BAD_SRCS_SUSHI } from "config/constants/lists";
import { AppId } from "config/constants/types";

const getTokenLogoURL = (address: string, chainId: ChainId, appId?: AppId, tokenSymbol?: string) => {
  return appId === AppId.APESWAP
    ? BAD_SRCS.includes(tokenSymbol)
      ? `https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${tokenSymbol?.toUpperCase()}.png`
      : `https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${tokenSymbol?.toUpperCase()}.svg`
    : appId === AppId.PANCAKESWAP
    ? `https://pancakeswap.finance/images/tokens/${address}.png`
    : appId === AppId.SUSHISWAP
    ? Object.keys(BAD_SRCS_SUSHI).includes(address)
      ? BAD_SRCS_SUSHI[address]
      : `https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64,q_auto/tokens/1/${address}.jpg`
    : `${ASSET_PATH}/${CHAIN_KEYS[chainId]}/assets/${address ?? WNATIVE[chainId].address}/logo.png`;
  // `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`
};

export default getTokenLogoURL;
