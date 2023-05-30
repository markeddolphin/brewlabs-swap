import { useMemo } from "react";
// Imports below migrated from Exchange useContract.ts
import { Contract } from "@ethersproject/contracts";
import { ChainId, WNATIVE } from "@brewlabs/sdk";
import { useAccount, useSigner } from "wagmi";

import ENS_PUBLIC_RESOLVER_ABI from "config/abi/ens-public-resolver.json";
import ENS_ABI from "config/abi/ens-registrar.json";
import { ERC20_BYTES32_ABI } from "config/abi/erc20";
import ERC20_ABI from "config/abi/erc20.json";
import WETH_ABI from "config/abi/weth.json";
import LpTokenAbi from "config/abi/lpToken.json";
import multiCallAbi from "config/abi/Multicall.json";
import ConstructorABI from "config/abi/tokenTransfer.json";
import ExternalMasterChefABI from "config/abi/externalMasterchef.json";

// import { useAppId } from 'state/zap/hooks'
import { Chef } from "config/constants/types";

import {
  getBep20Contract,
  getMasterchefContract,
  getErc721Contract,
  getSingleStakingContract,
  getLockupStakingContract,
  getContract,
  getIndexContract,
  getBrewlabsFeeManagerContract,
  getFarmFactoryContract,
  getFarmImplContract,
} from "utils/contractHelpers";
import {
  getAddress,
  getExternalMasterChefAddress,
  getMulticallAddress,
  getTokenTransferAddress,
} from "utils/addressHelpers";

import { useActiveChainId } from "./useActiveChainId";
import { useAppId } from "state/zap/hooks";

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const { chainId } = useActiveChainId();
  const { data: signer } = useSigner();
  return useMemo(() => getBep20Contract(chainId, address, signer ?? undefined), [address, signer, chainId]);
};

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const { chainId } = useActiveChainId();
  const { data: signer } = useSigner();
  return useMemo(() => getErc721Contract(chainId, address, signer ?? undefined), [address, signer, chainId]);
};

export const useMasterchef = (address: string) => {
  const { chainId } = useActiveChainId();
  const { data: signer } = useSigner();
  return useMemo(() => getMasterchefContract(chainId, address, signer ?? undefined), [address, signer, chainId]);
};

export const useFarmContract = (address: string) => {
  const { chainId } = useActiveChainId();
  const { data: signer } = useSigner();
  return useMemo(() => getFarmImplContract(chainId, address, signer ?? undefined), [address, signer, chainId]);
};

export const useSingleStaking = (chainId: ChainId, contractAddress: string) => {
  const { data: signer } = useSigner();
  return useMemo(
    () => getSingleStakingContract(chainId, contractAddress, signer ?? undefined),
    [chainId, contractAddress, signer]
  );
};
export const useLockupStaking = (chainId: ChainId, contractAddress: string) => {
  const { data: signer } = useSigner();
  return useMemo(
    () => getLockupStakingContract(chainId, contractAddress, signer ?? undefined),
    [chainId, contractAddress, signer]
  );
};

export const useIndexContract = (chainId: ChainId, contractAddress: string) => {
  const { data: signer } = useSigner();
  return useMemo(
    () => getIndexContract(chainId, contractAddress, signer ?? undefined),
    [chainId, contractAddress, signer]
  );
};

export const useFarmFactoryContract = (chainId: ChainId) => {
  const { data: signer } = useSigner();
  return useMemo(() => getFarmFactoryContract(chainId, signer ?? undefined), [chainId, signer]);
};
// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { address: account } = useAccount();
  const { chainId } = useActiveChainId();
  const { data: signer } = useSigner();

  return useMemo(() => {
    if (!address || !ABI || (withSignerIfPossible && !signer)) return null;
    try {
      return getContract(chainId, address, ABI, withSignerIfPossible ? signer : undefined);
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, ABI, signer, withSignerIfPossible, account]);
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveChainId();
  return useContract(chainId ? WNATIVE[chainId].address : undefined, WETH_ABI, withSignerIfPossible);
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveChainId();
  let address: string | undefined;
  if (chainId) {
    // eslint-disable-next-line default-case
    switch (chainId) {
      case ChainId.BSC_MAINNET:
      case ChainId.BSC_TESTNET:
      case ChainId.ETHEREUM:
        address = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, LpTokenAbi, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveChainId();
  return useContract(getMulticallAddress(chainId), multiCallAbi, false);
}

export function useTokenTransferContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveChainId();
  return useContract(getTokenTransferAddress(chainId), ConstructorABI, withSignerIfPossible);
}

export const useBrewlabsFeeManager = (chainId: ChainId) => {
  const { data: signer } = useSigner();
  return useMemo(() => getBrewlabsFeeManagerContract(chainId, signer ?? undefined), [chainId, signer]);
};
export function useExternalMasterchef(withSignerIfPossible?: boolean, chef = Chef.MASTERCHEF): Contract | null {
  const [appId] = useAppId();
  return useContract(getExternalMasterChefAddress(appId, chef), ExternalMasterChefABI, withSignerIfPossible);
}
