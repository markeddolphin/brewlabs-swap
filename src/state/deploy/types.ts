import { ChainId } from "@brewlabs/sdk";
import { SerializedToken } from "config/constants/types";

export interface DeployConfig {
  chainId: ChainId;
  address: string;
  payingToken: SerializedToken;
  serviceFee: string;
  depositFeeLimit?: number;
  commissionFeeLimit?: number;
  brewsFee?: number;
}
