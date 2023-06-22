import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { BSC_TESTNET } = ChainId;
const tokens = {
  bnb: NATIVE_CURRENCIES[ChainId.BSC_TESTNET],
  wbnb: WNATIVE[ChainId.BSC_TESTNET],
  busd: new Token(
    BSC_TESTNET,
    "0x2995bD504647b5EeE414A78be1d7b24f49f00FFE",
    18,
    "BUSD",
    "Binance USD",
    "https://www.paxos.com/busd/"
  ),
  test: new Token(
    BSC_TESTNET,
    "0x8428b19C97acCD93fA10f19cbbdfF4FB71C4D175",
    18,
    "TEST",
    "TestToken"
  ),
  tokenA: new Token(
    BSC_TESTNET,
    "0xC15BA1a077F6B2ecF51b8AAfbC31E04dC9CbC578",
    18,
    "TOKENA",
    "TOKENA"
  ),
  tokenB: new Token(
    BSC_TESTNET,
    "0x9C7C28A281B7F30796dC4d1831AF5FCB422a554A",
    18,
    "TOKENB",
    "TOKENB"
  ),
  tokenC: new Token(
    BSC_TESTNET,
    "0xB8Dc3ef9eB65A2d66ee4a133C836929c952c9D37",
    18,
    "TOKENC",
    "TOKENC"
  )
};

export default tokens;
