// compare two token amounts with highest one coming first
import { Token, TokenAmount } from "@brewlabs/sdk";
import { useMemo } from "react";

export const balanceComparator = (balanceA?: TokenAmount, balanceB?: TokenAmount) => {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1;
  }
  if (balanceA && balanceA.greaterThan("0")) {
    return -1;
  }
  if (balanceB && balanceB.greaterThan("0")) {
    return 1;
  }
  return 0;
};

export const getTokenComparator = (balances: {
  [tokenAddress: string]: TokenAmount | undefined;
}): ((tokenA: Token, tokenB: Token) => number) => {
  return function sortTokens(tokenA: Token, tokenB: Token): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = balances[tokenA.address];
    const balanceB = balances[tokenB.address];

    const balanceComp = balanceComparator(balanceA, balanceB);
    if (balanceComp !== 0) return balanceComp;

    if (tokenA.symbol && tokenB.symbol) {
      // sort by symbol
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1;
    }
    return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0;
  };
};
