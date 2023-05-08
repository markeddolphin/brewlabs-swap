import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { CRONOS } = ChainId;
const tokens = {
  cro: NATIVE_CURRENCIES[ChainId.CRONOS],
  wcro: WNATIVE[ChainId.CRONOS],
  usdc: new Token(CRONOS, "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59", 6, "USDC", "USD Coin", "https://cronos.org/"),
};

export default tokens;
