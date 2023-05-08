import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { GOERLI } = ChainId;
const tokens = {
  eth: NATIVE_CURRENCIES[GOERLI],
  weth: WNATIVE[GOERLI],
  usdc: new Token(
    GOERLI,
    "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    6,
    "USDC",
    "USD Coin",
  ),
  test: new Token(
    GOERLI,
    "0x8057dfc6e2Da586C56211249E96B01a1E705eF00",
    18,
    "TEST",
    "TestToken"
  ),
};

export default tokens;
