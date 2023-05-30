import { ChainId, Currency } from "@brewlabs/sdk";

import FarmFactoryAbi from "config/abi/farm/factory.json";
import { tokens } from "config/constants/tokens";
import { serializeToken } from "state/user/hooks/helpers";
import { getFarmFactoryAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";

export const fetchFarmFactoryData = async (chainId: ChainId) => {
  const calls = [
    {
      address: getFarmFactoryAddress(chainId),
      name: "payingToken",
    },
    {
      address: getFarmFactoryAddress(chainId),
      name: "serviceFee",
    },
  ];

  const result = await multicall(FarmFactoryAbi, calls, chainId);
  return {
    chainId,
    payingToken: serializeToken(Object.values(tokens[chainId]).find((t: any) => t.address === result[0][0])),
    serviceFee: result[1][0].toString(),
  };
};
