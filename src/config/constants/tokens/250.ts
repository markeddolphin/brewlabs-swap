import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { FANTOM } = ChainId;
const tokens = {
  ftm: NATIVE_CURRENCIES[ChainId.FANTOM],
  wftm: WNATIVE[ChainId.FANTOM],
  usdc: new Token(
    FANTOM,
    "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    6,
    "USDC",
    "USD Coin",
    "https://www.centre.io/"
  ),
  eth: new Token(FANTOM, "0x74b23882a30290451A17c44f4F05243b6b58C76d", 18, "ETH", "Ethereum", "https://weth.io/"),
};

export default tokens;
