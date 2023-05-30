import { CurrencyAmount, JSBI, Percent } from "@brewlabs/sdk";
import { getAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";

import { BLOCKS_PER_DAY } from "config/constants";
import { Category } from "config/constants/types";

export function isAddress(value: any): string {
  try {
    return getAddress(value);
  } catch {
    return "";
  }
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export const truncateHash = (hash: string) => {
  if (!hash) return "here";
  const len = hash.length;
  return `${hash.substr(0, 6)}...${hash.substr(len - 4, len - 1)}`;
};

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

// add 50%
export function calculateTotalGas(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(5000))).div(BigNumber.from(10000));
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ];
}

export function filterPoolsByStatus(pools, currentBlocks, status) {
  let chosenPools = pools;
  switch (status) {
    case "finished":
      chosenPools = chosenPools.filter(
        (pool) =>
          pool.isFinished ||
          pool.multiplier === 0 ||
          (pool.type === Category.ZAPPER && pool.pid !== 0 && pool.multiplier === "0X")
      );
      break;
    case "new":
      chosenPools = chosenPools.filter(
        (pool) =>
          !pool.isFinished &&
          ((pool.type === Category.POOL &&
            (!pool.startBlock ||
              +pool.startBlock === 0 ||
              +pool.startBlock + BLOCKS_PER_DAY[pool.chainId] > currentBlocks[pool.chainId])) ||
            (pool.type === Category.FARM &&
              (!pool.startBlock ||
                +pool.startBlock > currentBlocks[pool.chainId] ||
                +pool.startBlock + BLOCKS_PER_DAY[pool.chainId] > currentBlocks[pool.chainId])) ||
            (pool.type === Category.INDEXES && new Date(pool.createdAt).getTime() + 86400 * 1000 >= Date.now()))
      );
      break;
    default:
      chosenPools = chosenPools.filter(
        (pool) =>
          !pool.isFinished &&
          ((pool.type === Category.POOL && +pool.startBlock > 0) ||
            (pool.type === Category.FARM &&
              pool.multiplier > 0 &&
              +pool.startBlock > 0 &&
              +pool.startBlock < currentBlocks[pool.chainId]) ||
            pool.type === Category.INDEXES ||
            (pool.type === Category.ZAPPER && pool.pid !== 0 && pool.multiplier !== "0X"))
      );
  }

  return chosenPools;
}
