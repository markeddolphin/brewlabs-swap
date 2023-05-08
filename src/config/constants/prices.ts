import { ChainId } from "@brewlabs/sdk";
import { tokens } from "./tokens";

const prices = [
  { ...tokens[ChainId.BSC_MAINNET].btcb, symbol: "BTC" },
  tokens[ChainId.ETHEREUM].eth,
  tokens[ChainId.BSC_MAINNET].bnb,
  tokens[ChainId.BSC_MAINNET].brews,
  tokens[ChainId.ETHEREUM].wpt,
  tokens[ChainId.ETHEREUM].gcc,
  tokens[ChainId.BSC_MAINNET].vlk,
  tokens[ChainId.BSC_MAINNET].roo,
  tokens[ChainId.ETHEREUM].balto,
  tokens[ChainId.BSC_MAINNET].bvst,
  tokens[ChainId.BSC_MAINNET].dtt,
];

export default prices;
