import { ChainId, Currency } from "@brewlabs/sdk";
import { SerializedToken, Version } from "config/constants/types";
import { BigNumber } from "ethers";

interface IndexConfigBaseProps {
  pid: number;
  chainId: ChainId;
  address: string;
  name?: string;
  category?: number;
  nft?: string;
  indexNft?: string;
  deployerNft?: string;
  deployerNftId?: number;
  numTokens: number;
  fee?: number;
  depositFee: string;
  commissionFee: string;
  createdAt: string;
  sortOrder?: number;
  version?: Version;
  isCustody?: boolean;
  isServiceFee?: boolean;
  isFinished?: boolean;
  visible?: boolean;
  owner?: string;
  deployer?: string;
  feeWallet?: string;
}

export interface SerializedIndexConfig extends IndexConfigBaseProps {
  tokens: SerializedToken[];
}

export interface DeserializedIndexConfig extends IndexConfigBaseProps {
  tokens: Currency[];
}

export interface IndexHistory {
  method: string;
  amounts: string[];
  usdAmount: string;
  tokenId?: number;
  txHash: string;
  blockNumber: number;
  timestamp: number;
}

export type NFTInfo = {
  tokenId: number;
  level?: number;
  amounts: string[];
  usdAmount: string;
};

export interface DeserializedIndex extends DeserializedIndexConfig {
  totalStaked: string[];
  performanceFee?: string;
  userData?: {
    allowance: boolean; // nft allowance
    ethBalance: BigNumber;
    indexNftItems: NFTInfo[];
    deployerNftItem?: NFTInfo;
    stakedUsdAmount: string;
    stakedBalances: BigNumber[];
    histories: IndexHistory[];
  };
  tvl?: number;
  TVLData?: number[];
  performanceFees?: number[];
  commissions?: number[];
  tokenPrices?: number[];
  priceChanges?: any;
  priceHistories?: any;
  pFee3Histories?: number[][];
  price3Histories?: any;
}

export interface SerializedIndex extends SerializedIndexConfig {
  totalStaked: string[];
  performanceFee?: string;
  userData?: {
    allowance: boolean; // nft allowance
    ethBalance: string;
    indexNftItems: NFTInfo[];
    deployerNftItem?: NFTInfo;
    stakedUsdAmount: string;
    stakedBalances: string[];
    histories: IndexHistory[];
  };
  TVLData?: number[];
  performanceFees?: number[];
  commissions?: number[];
  tokenPrices?: number[];
  priceChanges?: any;
  priceHistories?: any;
  pFee3Histories?: number[][];
  price3Histories?: any;
}
