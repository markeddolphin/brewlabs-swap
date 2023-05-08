import { ChainId, Currency, Token } from "@brewlabs/sdk";
import { BigNumber } from "ethers";
import { Address } from "wagmi";

export interface SerializedToken {
  chainId: ChainId;
  isNative: boolean;
  isToken: boolean;
  address?: string;
  decimals: number;
  symbol: string;
  name: string;
  logo?: string;
  projectLink?: string;
}

export enum Category {
  "ALL" = 0,
  "POOL",
  "FARM",
  "INDEXES",
  "ZAPPER",
  "MY_POSITION",
}

export enum PoolCategory {
  "COMMUNITY" = "Community",
  "CORE" = "Core",
  "BINANCE" = "Binance", // Pools using native BNB behave differently than pools using a token
  "AUTO" = "Auto",
  "LOCKUP" = "Lockup",
  "LOCKUP_V2" = "Lockup_V2",
  "MULTI" = "Multi",
  "MULTI_LOCKUP" = "Multi_Lockup",
}

export enum Version {
  "V1" = "V1",
  "V2" = "V2",
  "V3" = "V3",
}

export enum Chef {
  MASTERCHEF,
  MASTERCHEF_V2,
}

interface FarmConfigBaseProps {
  pid: number | null;
  type?: Category;
  farmId?: number;
  poolId?: number;
  v1pid?: number;
  chainId?: ChainId;
  version?: Version;
  lpSymbol: string;
  lpDecimals?: number;
  lpAddress: string;
  contractAddress?: string;
  multiplier?: string;
  isCommunity?: boolean;
  isCustody?: boolean;
  lpManager?: string;
  sortOrder?: number;
  enableEmergencyWithdraw?: boolean;
  disableHarvest?: boolean;
  isServiceFee?: boolean;
  compound?: boolean;
  compoundRelection?: boolean;
  unverified?: boolean;
  featured?: boolean;
  isFinished?: boolean;
  dual?: {
    rewardPerBlock: number;
    earnLabel: string;
    endBlock: number;
  };
  externalSwap?: string;
  deployer?: string;
}

export interface SerializedFarmConfig extends FarmConfigBaseProps {
  apr?: number;
  token: SerializedToken;
  quoteToken: SerializedToken;
  earningToken?: SerializedToken;
  reflectionToken?: SerializedToken;
  availableRewards?: number;
  availableReflections?: number[];
}

export interface DeserializedFarmConfig extends FarmConfigBaseProps {
  apr?: number;
  token: Currency;
  quoteToken: Currency;
  earningToken?: Currency;
  reflectionToken?: Currency;
  availableRewards?: number;
  availableReflections?: number[];
}

export interface BridgeToken extends SerializedToken {
  mode?: string;
  mediator?: string;
  helperContractAddress?: string;
}
export interface BridgeDirectionConfig {
  bridgeDirectionId: number;
  version?: Version;
  homeChainId: ChainId;
  foreignChainId: ChainId;
  homeToken: BridgeToken;
  foreignToken: BridgeToken;
  foreignMediatorAddress: string;
  homeMediatorAddress: string;
  foreignAmbAddress: string;
  homeAmbAddress: string;
  foreignGraphName: string;
  homeGraphName: string;
  claimDisabled: false;
  tokensClaimDisabled: any[];
  homePerformanceFee?: string;
  foreignPerformanceFee?: string;
}

export type PageMeta = {
  title: string;
  description?: string;
  image?: string;
};

export type NetworkConfig = {
  id: ChainId | 0;
  name: string;
  image: string;
};

type LinkOfTextAndLink = string | { text: string; url: string };
type DeviceLink = {
  desktop?: LinkOfTextAndLink;
  mobile?: LinkOfTextAndLink;
};
type LinkOfDevice = string | DeviceLink;

export type WalletConfig<T = unknown> = {
  id: string;
  title: string;
  description: string;
  icon: string;
  connectorId: T;
  deepLink?: string;
  installed?: boolean;
  guide?: LinkOfDevice;
  downloadLink?: LinkOfDevice;
  mobileOnly?: boolean;
  qrCode?: () => Promise<string>;
};

export interface BrewlabsToken {
  id: Address;
  name?: string;
  symbol?: string;
  decimals?: number;
}

export interface BrewlabsPair {
  id: Address;
  token0: BrewlabsToken;
  token1: BrewlabsToken;
  token0Owner?: Address;
  token1Owner?: Address;
  referrer?: Address;
  volumeToken0: BigNumber;
  volumeToken1: BigNumber;
  volumeUSD: BigNumber;
}
export interface Address {
  1?: string;
  56?: string;
  97?: string;
  137?: string;
  250?: string;
  43114?: string;
  25?: string;
}

export enum AppId {
  PANCAKESWAP = "pancakeswap",
  APESWAP = "apeswap",
  // KNIGHT = "knight",
  SUSHISWAP = "sushiswap",
}
