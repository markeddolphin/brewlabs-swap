import { ChainId } from "@brewlabs/sdk";
import { CallOverrides, ethers } from "ethers";
import { Fragment, Interface } from "ethers/lib/utils";
import { getMulticallContract } from "utils/contractHelpers";
import { provider } from "./wagmi";

export type MultiCallResponse<T> = T | null;
export interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean;
}
/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
interface MulticallV2Params {
  abi: any[];
  calls: Call[];
  chainId?: ChainId;
  options?: MulticallOptions;
  provider?: ethers.providers.Provider;
}

export interface CallV3 extends Call {
  abi: any[];
  allowFailure?: boolean;
}

interface MulticallV3Params {
  calls: CallV3[];
  chainId?: ChainId;
  allowFailure?: boolean;
  overrides?: CallOverrides;
}

export type MultiCallV2 = <T = any>(params: MulticallV2Params) => Promise<T>;
export type MultiCall = <T = any>(abi: any[], calls: Call[], chainId?: ChainId) => Promise<T>;

const multicall: MultiCall = async (abi: any[], calls: Call[], chainId = ChainId.ETHEREUM) => {
  const multi = getMulticallContract(chainId, provider({ chainId }));
  if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`);
  const itf = new Interface(abi);

  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }));
  const { returnData } = await multi.callStatic.aggregate(calldata);

  const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call));

  return res as any;
};

const multicallv2 = async <T = any>(
  chainId: ChainId,
  abi: any[],
  calls: Call[],
  options: MulticallOptions = { requireSuccess: true }
): Promise<MultiCallResponse<T>> => {
  const { requireSuccess } = options;
  const multi = getMulticallContract(chainId);
  const itf = new ethers.utils.Interface(abi);

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)]);
  const returnData = await multi.tryAggregate(requireSuccess, calldata);
  const res = returnData.map((call, i) => {
    const [result, data] = call;
    return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
  });

  return res;
};

const multicallv3 = async ({ calls, chainId = ChainId.ETHEREUM, allowFailure, overrides }: MulticallV3Params) => {
  const multi = getMulticallContract(chainId, provider({ chainId }));
  if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`);
  const interfaceCache = new WeakMap();
  const _calls = calls.map(({ abi, address, name, params, allowFailure: _allowFailure }) => {
    let itf = interfaceCache.get(abi);
    if (!itf) {
      itf = new Interface(abi);
      interfaceCache.set(abi, itf);
    }
    if (!itf.fragments.some((fragment: Fragment) => fragment.name === name))
      console.error(`${name} missing on ${address}`);
    const callData = itf.encodeFunctionData(name, params ?? []);
    return {
      target: address.toLowerCase(),
      allowFailure: allowFailure || _allowFailure,
      callData,
    };
  });

  const result = await multi.callStatic.aggregate3(_calls, ...(overrides ? [overrides] : []));

  return result.map((call: any, i: number) => {
    const { returnData, success } = call;
    if (!success || returnData === "0x") return null;
    const { abi, name } = calls[i];
    const itf = interfaceCache.get(abi);
    const decoded = itf?.decodeFunctionResult(name, returnData);
    return decoded;
  });
};

export default multicall;
export { multicallv2, multicallv3 };
