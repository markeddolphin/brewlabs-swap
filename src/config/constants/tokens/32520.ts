import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { BRISE } = ChainId;
const tokens = {
    cro: NATIVE_CURRENCIES[ChainId.BRISE],
    wbrise: WNATIVE[ChainId.BRISE],
    usdc: new Token(
      BRISE,
      '0xcf2DF9377A4e3C10e9EA29fDB8879d74C27FCDE7',
      18,
      'USDC',
      'USD Coin',
      'https://bitgert.com/',
    ),
    usdt: new Token(
      BRISE,
      '0xDe14b85cf78F2ADd2E867FEE40575437D5f10c06',
      18,
      'USDT',
      'Tether USD',
      'https://bitgert.com/',
    ),
};

export default tokens;
