import BigNumber from "bignumber.js";
import { DeserializedFarm, SerializedBigNumber } from "./farms/types";
import { SerializedPool } from "./pools/types";
import { SerializedIndex } from "./indexes/types";
import { DeployConfig } from "./deploy/types";
import { SwapState } from "./swap/reducer";
import { ListsState } from "./lists/reducer";
import { MulticallState } from "./multicall/reducer";
import { TransactionState } from "./transactions/reducer";
import { UserState } from "./user/reducer";
import { Address, AppId, DeserializedFarmConfig, SerializedFarmConfig } from "config/constants/types";
import { AnyAction } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";

export interface SerializedDeposit {
  amount: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  unlockTime?: number;
}

export interface DeserializedDeposit {
  amount: BigNumber;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  unlockTime?: number;
}
export interface BlockState {
  currentBlock: number;
  initialBlock: number;
}
export interface SerializedFarmsState {
  data: SerializedFarm[];
  userDataLoaded: boolean;
}
export interface DeserializedFarmsState {
  data: DeserializedFarm[];
  userDataLoaded: boolean;
}

export interface PoolsState {
  data: SerializedPool[];
  userDataLoaded: boolean;
  dataFetched: boolean;
}
export interface IndexesState {
  data: SerializedIndex[];
  userDataLoaded: boolean;
}

export interface DeployState {
  farm: DeployConfig[];
  pool: DeployConfig[];
  indexes: DeployConfig[];
}

interface SerializedZapFarmUserData {
  stakedBalance: string;
  earnings: string;
  totalRewards: string;
}

export interface SerializedPancakeFarm extends SerializedFarmConfig {
  appId?: AppId;
  tokenPriceBusd?: string;
  quoteTokenPriceBusd?: string;
  tokenAmountTotal?: SerializedBigNumber;
  quoteTokenAmountTotal?: SerializedBigNumber;
  lpTotalInQuoteToken?: SerializedBigNumber;
  lpTotalSupply?: SerializedBigNumber;
  tokenPriceVsQuote?: SerializedBigNumber;
  poolWeight?: SerializedBigNumber;
  totalRewards?: SerializedBigNumber;
  userData?: SerializedZapFarmUserData;
  totalSupply?: string;
}

export interface SerializedZapState {
  data: {
    [AppId.PANCAKESWAP]: SerializedPancakeFarm[];
    [AppId.APESWAP]: Farm[];
    [AppId.SUSHISWAP]: any[];
  };
  userDataLoaded: boolean;
  loadingKeys: Record<string, boolean>;
  poolLength?: number;
  regularCakePerBlock?: number;
  bananaPrice: string;
  FarmLpAprs: {
    [AppId.PANCAKESWAP]: any;
    [AppId.APESWAP]: FarmLpAprsType;
    [AppId.SUSHISWAP]: any;
  };
  appId: AppId;
}

export interface State {
  block: BlockState;
  farms: SerializedFarmsState;
  pools: PoolsState;
  indexes: IndexesState;
  deploy: DeployState;
  zap: SerializedZapState;
  lists: ListsState;
  multicall: MulticallState;
  user: UserState;
  swap: SwapState;
  transactions: TransactionState;
  lpTokenPrices: LpTokenPricesState;
}

//zap
export interface LpTokenPrices {
  symbol: string;
  pid: number;
  address: Address;
  price: number;
  decimals: number;
}

export interface LpTokenPricesState {
  isInitialized: boolean;
  isLoading: boolean;
  data: LpTokenPrices[];
}

enum QuoteToken {
  "BNB" = "BNB",
  "CAKE" = "CAKE",
  "BANANA" = "BANANA",
  "SYRUP" = "SYRUP",
  "BUSD" = "BUSD",
  "TWT" = "TWT",
  "UST" = "UST",
  "ETH" = "ETH",
  "USDT" = "USDT",
}

interface FarmStyles {
  deprecated: any;
  warning: any;
  featured: any;
  inactive: any;
}

export interface FarmConfig {
  pid: number;
  chainId?: number;
  appId?: AppId;
  lpSymbol: string;
  lpAddresses: Address;
  tokenSymbol: string;
  style?: keyof FarmStyles;
  image?: string;
  displayApr?: boolean;
  tokenAddresses: Address;
  quoteTokenSymbol: QuoteToken;
  quoteTokenAdresses: Address;
  multiplier?: string;
  isCommunity?: boolean;
  dual?: {
    rewardPerBlock: number;
    earnLabel: string;
    endBlock: number;
  };
  projectLink?: string;
}

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber;
  totalInQuoteToken?: BigNumber;
  quoteTokenAmount?: BigNumber;
  lpTotalInQuoteToken?: BigNumber;
  tokenPriceVsQuote?: BigNumber;
  poolWeight?: BigNumber;
  totalLpStakedUsd?: string;
  apr?: string;
  apy?: string;
  lpApr?: string;
  bananaPrice?: number;
  lpValueUsd?: number;
  userData?: {
    stakedBalance: BigNumber;
    earnings: BigNumber;
  };
  tokenDecimals?: number;
  quoteTokenDecimals?: number;
}

export interface FarmLpAprsType {
  chainId: number;
  lpAprs: {
    pid: number;
    lpApr: number;
  }[];
}

interface SerializedFarmUserData {
  allowance: string;
  tokenBalance: string;
  stakedBalance: string;
  earnings: string;
  reflections: string;
}

export interface SerializedFarm extends SerializedFarmConfig {
  tokenAmountTotal?: SerializedBigNumber;
  lpTotalInQuoteToken?: SerializedBigNumber;
  totalStaked?: SerializedBigNumber;
  lpTotalSupply?: SerializedBigNumber;
  tokenPriceVsQuote?: SerializedBigNumber;
  rewardPerBlock?: SerializedBigNumber;
  poolWeight?: SerializedBigNumber;
  depositFee?: string;
  withdrawFee?: string;
  performanceFee?: string;
  userData?: SerializedFarmUserData;
  totalSupply?: string;
}

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>;

export interface DeserializedZapFarmUserData {
  stakedBalance: BigNumber;
  earnings: BigNumber;
  totalRewards: BigNumber;
}

export interface DeserializedPancakeFarm extends DeserializedFarmConfig {
  appId?: AppId;
  tokenPriceBusd?: string;
  quoteTokenPriceBusd?: string;
  tokenAmountTotal?: BigNumber;
  quoteTokenAmountTotal?: BigNumber;
  lpTotalInQuoteToken?: BigNumber;
  lpTotalSupply?: BigNumber;
  tokenPriceVsQuote?: BigNumber;
  poolWeight?: BigNumber;
  totalRewards?: BigNumber;
  userData?: DeserializedZapFarmUserData;
  totalSupply?: string;
}
