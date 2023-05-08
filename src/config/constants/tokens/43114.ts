import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { AVALANCHE } = ChainId;
const tokens = {
    avax: NATIVE_CURRENCIES[ChainId.AVALANCHE],
    wavax: WNATIVE[ChainId.AVALANCHE],
    usdc: new Token(
      AVALANCHE,
      '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      6,
      'USDC',
      'USD Coin',
      'https://www.centre.io/',
    ),
};

export default tokens;
