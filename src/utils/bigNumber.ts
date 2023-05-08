import BigNumber from "bignumber.js";
import { BigNumber as EthersBigNumber, FixedNumber } from "@ethersproject/bignumber";

export const BIG_ZERO = new BigNumber(0);
export const BIG_ONE = new BigNumber(1);
export const BIG_TWO = new BigNumber(2);
export const BIG_NINE = new BigNumber(9);
export const BIG_TEN = new BigNumber(10);

export const FIXED_ZERO = FixedNumber.from(0);
export const FIXED_ONE = FixedNumber.from(1);
export const FIXED_TWO = FixedNumber.from(2);

export const ethersToSerializedBigNumber = (ethersBn: EthersBigNumber): string => ethersToBigNumber(ethersBn).toJSON();

export const ethersToBigNumber = (ethersBn: EthersBigNumber): BigNumber => new BigNumber(ethersBn.toString());
