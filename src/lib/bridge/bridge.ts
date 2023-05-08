import { ChainId } from "@brewlabs/sdk";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import { BridgeToken, Version } from "config/constants/types";
import { bridgeConfigs } from "config/constants/bridge";
import { provider } from "utils/wagmi";
import { fetchTokenName } from "./token";
import { getMediatorAddress, getNetworkLabel } from "./helpers";

const getToName = async (fromToken: BridgeToken, toChainId: ChainId, toAddress: string) => {
  const { name } = fromToken;
  if (toAddress === ethers.constants.AddressZero) {
    const fromName = name || (await fetchTokenName(fromToken));
    return `${fromName} on ${+toChainId === 100 ? "GC" : getNetworkLabel(toChainId)}`;
  }
  return fetchTokenName({ chainId: toChainId, address: toAddress });
};

const fetchToTokenDetails = async (bridgeDirectionId: number, fromToken: BridgeToken, toChainId: ChainId) => {
  const { chainId: fromChainId, address: fromAddress } = fromToken;

  const fromMediatorAddress = getMediatorAddress(bridgeDirectionId, fromChainId);
  const toMediatorAddress = getMediatorAddress(bridgeDirectionId, toChainId);

  const fromEthersProvider = await provider({ chainId: fromChainId });
  const toEthersProvider = await provider({ chainId: toChainId });
  const abi = [
    "function isRegisteredAsNativeToken(address) view returns (bool)",
    "function bridgedTokenAddress(address) view returns (address)",
    "function nativeTokenAddress(address) view returns (address)",
  ];
  const fromMediatorContract = new Contract(fromMediatorAddress, abi, fromEthersProvider);
  const isNativeToken = await fromMediatorContract.isRegisteredAsNativeToken(fromAddress);

  if (isNativeToken) {
    const toMediatorContract = new Contract(toMediatorAddress, abi, toEthersProvider);

    const toAddress = await toMediatorContract.bridgedTokenAddress(fromAddress);

    const toName = await getToName(fromToken, toChainId, toAddress);
    return {
      name: toName,
      chainId: toChainId,
      address: toAddress,
      mode: "erc677",
      mediator: toMediatorAddress,
    };
  }
  const toAddress = await fromMediatorContract.nativeTokenAddress(fromAddress);

  const toName = await getToName(fromToken, toChainId, toAddress);
  return {
    name: toName,
    chainId: toChainId,
    address: toAddress,
    mode: "erc20",
    mediator: toMediatorAddress,
  };
};

export const fetchToToken = async (bridgeDirectionId: number, fromToken: BridgeToken, toChainId: ChainId) => {
  const toToken = await fetchToTokenDetails(bridgeDirectionId, fromToken, toChainId);
  return toToken;
};

export const fetchToAmount = async (
  bridgeDirectionId: number,
  feeType: string,
  fromToken: any,
  toToken: any,
  fromAmount: BigNumber,
  feeManagerAddress: string
) => {
  if (fromAmount.lte(0) || !fromToken || !toToken) return BigNumber.from(0);
  const { version, homeChainId, homeMediatorAddress } =
    bridgeConfigs.find((bridge) => bridge.bridgeDirectionId === bridgeDirectionId) ?? bridgeConfigs[0];

  const isHome = homeChainId === toToken.chainId;
  const tokenAddress = isHome ? toToken.address : fromToken.address;
  const mediatorAddress = isHome ? toToken.mediator : fromToken.mediator;
  if (mediatorAddress !== homeMediatorAddress || !tokenAddress || !feeManagerAddress) {
    return fromAmount;
  }

  try {
    const ethersProvider = await provider({ chainId: version ? fromToken.chainId : homeChainId });
    const abi = ["function calculateFee(bytes32, address, uint256) view returns (uint256)"];
    const feeManagerContract = new Contract(feeManagerAddress, abi, ethersProvider);

    const fee = await feeManagerContract.calculateFee(feeType, tokenAddress, fromAmount);

    return fromAmount.sub(fee);
  } catch (amountError) {
    console.error({ amountError });
    return fromAmount;
  }
};

const getDefaultTokenLimits = async (decimals: number, mediatorContract: Contract, toMediatorContract: Contract) => {
  let [minPerTx, maxPerTx, dailyLimit] = await Promise.all([
    mediatorContract.minPerTx(ethers.constants.AddressZero),
    toMediatorContract.executionMaxPerTx(ethers.constants.AddressZero),
    mediatorContract.executionDailyLimit(ethers.constants.AddressZero),
  ]);

  if (decimals < 18) {
    const factor = BigNumber.from(10).pow(18 - decimals);

    minPerTx = minPerTx.div(factor);
    maxPerTx = maxPerTx.div(factor);
    dailyLimit = dailyLimit.div(factor);

    if (minPerTx.eq(0)) {
      minPerTx = BigNumber.from(1);
      if (maxPerTx.lte(minPerTx)) {
        maxPerTx = BigNumber.from(100);
        if (dailyLimit.lte(maxPerTx)) {
          dailyLimit = BigNumber.from(10000);
        }
      }
    }
  } else {
    const factor = BigNumber.from(10).pow(decimals - 18);

    minPerTx = minPerTx.mul(factor);
    maxPerTx = maxPerTx.mul(factor);
    dailyLimit = dailyLimit.mul(factor);
  }

  return {
    minPerTx,
    maxPerTx,
    remainingLimit: dailyLimit,
    dailyLimit,
  };
};

export const fetchTokenLimits = async (
  bridgeDirectionId: number,
  fromToken: BridgeToken,
  toToken: BridgeToken,
  currentDay: number
) => {
  const isDedicatedMediatorToken = fromToken.mediator !== getMediatorAddress(bridgeDirectionId, fromToken.chainId);

  const abi = isDedicatedMediatorToken
    ? [
        "function getCurrentDay() view returns (uint256)",
        "function minPerTx() view returns (uint256)",
        "function executionMaxPerTx() view returns (uint256)",
        "function dailyLimit() view returns (uint256)",
        "function totalSpentPerDay(uint256) view returns (uint256)",
        "function executionDailyLimit() view returns (uint256)",
        "function totalExecutedPerDay(uint256) view returns (uint256)",
      ]
    : [
        "function getCurrentDay() view returns (uint256)",
        "function minPerTx(address) view returns (uint256)",
        "function executionMaxPerTx(address) view returns (uint256)",
        "function dailyLimit(address) view returns (uint256)",
        "function totalSpentPerDay(address, uint256) view returns (uint256)",
        "function executionDailyLimit(address) view returns (uint256)",
        "function totalExecutedPerDay(address, uint256) view returns (uint256)",
      ];

  try {
    const fromMediatorContract = new Contract(
      fromToken.mediator ?? ethers.constants.AddressZero,
      abi,
      await provider({ chainId: fromToken.chainId })
    );
    const toMediatorContract = new Contract(
      toToken.mediator ?? ethers.constants.AddressZero,
      abi,
      await provider({ chainId: toToken.chainId })
    );

    const fromTokenAddress = fromToken.address;
    const toTokenAddress = toToken.address;

    if (toTokenAddress === ethers.constants.AddressZero || fromTokenAddress === ethers.constants.AddressZero)
      return getDefaultTokenLimits(fromToken.decimals, fromMediatorContract, toMediatorContract);

    const [minPerTx, dailyLimit, totalSpentPerDay, maxPerTx, executionDailyLimit, totalExecutedPerDay] =
      isDedicatedMediatorToken
        ? await Promise.all([
            fromMediatorContract.minPerTx(),
            fromMediatorContract.dailyLimit(),
            fromMediatorContract.totalSpentPerDay(currentDay),
            toMediatorContract.executionMaxPerTx(),
            toMediatorContract.executionDailyLimit(),
            toMediatorContract.totalExecutedPerDay(currentDay),
          ])
        : await Promise.all([
            fromMediatorContract.minPerTx(fromTokenAddress),
            fromMediatorContract.dailyLimit(fromTokenAddress),
            fromMediatorContract.totalSpentPerDay(fromTokenAddress, currentDay),
            toMediatorContract.executionMaxPerTx(toTokenAddress),
            toMediatorContract.executionDailyLimit(toTokenAddress),
            toMediatorContract.totalExecutedPerDay(toTokenAddress, currentDay),
          ]);

    const remainingExecutionLimit = executionDailyLimit.sub(totalExecutedPerDay);
    const remainingRequestLimit = dailyLimit.sub(totalSpentPerDay);
    const remainingLimit = remainingRequestLimit.lt(remainingExecutionLimit)
      ? remainingRequestLimit
      : remainingExecutionLimit;

    return {
      minPerTx,
      maxPerTx,
      remainingLimit,
      dailyLimit: dailyLimit.lt(executionDailyLimit) ? dailyLimit : executionDailyLimit,
    };
  } catch (error) {
    console.error({ tokenLimitsError: error });
    return {
      minPerTx: BigNumber.from(0),
      maxPerTx: BigNumber.from(0),
      remainingLimit: BigNumber.from(0),
      dailyLimit: BigNumber.from(0),
    };
  }
};

export const relayTokens = async (
  signer: Signer,
  token: BridgeToken,
  receiver: string,
  amount: BigNumber,
  version?: Version,
  performanceFee?: string
) => {
  const { mode, mediator, address, helperContractAddress } = token;
  switch (mode) {
    case "NATIVE": {
      const abi = ["function wrapAndRelayTokens(address _receiver) public payable"];
      const helperContract = new Contract(helperContractAddress ?? ethers.constants.AddressZero, abi, signer);
      return helperContract.wrapAndRelayTokens(receiver, { value: amount.add(performanceFee ?? "0") });
    }
    case "dedicated-erc20": {
      if (version) {
        const abi = ["function relayTokens(address, uint256) public payable"];
        const mediatorContract = new Contract(mediator ?? ethers.constants.AddressZero, abi, signer);

        let gasLimit = await mediatorContract.estimateGas.relayTokens(receiver, amount, { value: performanceFee });
        gasLimit = gasLimit.mul(1200).div(1000);
        return mediatorContract.relayTokens(receiver, amount, { value: performanceFee });
      }

      const abi = performanceFee
        ? [`function relayTokensWithFee(address, address, uint256) public payable`]
        : ["function relayTokens(address, uint256)"];
      const mediatorContract = new Contract(mediator ?? ethers.constants.AddressZero, abi, signer);

      if (performanceFee) {
        let gasLimit = await mediatorContract.estimateGas.relayTokensWithFee(address, receiver, amount, {
          value: performanceFee,
        });
        gasLimit = gasLimit.mul(1200).div(1000);
        return mediatorContract.relayTokensWithFee(address, receiver, amount, { value: performanceFee, gasLimit });
      }

      let gasLimit = await mediatorContract.estimateGas.relayTokens(receiver, amount);
      gasLimit = gasLimit.mul(1200).div(1000);
      return mediatorContract.relayTokens(receiver, amount, { gasLimit });
    }
    case "erc20":
    default: {
      if (version) {
        const abi = ["function relayTokens(address, address, uint256) public payable"];
        const mediatorContract = new Contract(mediator ?? ethers.constants.AddressZero, abi, signer);

        let gasLimit = await mediatorContract.estimateGas.relayTokens(address, receiver, amount, {
          value: performanceFee,
        });
        gasLimit = gasLimit.mul(1200).div(1000);
        return mediatorContract.relayTokens(address, receiver, amount, { value: performanceFee, gasLimit });
      }

      const abi = performanceFee
        ? ["function relayTokensWithFee(address, address, uint256) public payable"]
        : ["function relayTokens(address, address, uint256)"];
      const mediatorContract = new Contract(mediator ?? ethers.constants.AddressZero, abi, signer);

      if (performanceFee) {
        let gasLimit = await mediatorContract.estimateGas.relayTokensWithFee(address, receiver, amount, {
          value: performanceFee,
        });
        gasLimit = gasLimit.mul(1200).div(1000);
        return mediatorContract.relayTokensWithFee(address, receiver, amount, { value: performanceFee, gasLimit });
      }

      let gasLimit = await mediatorContract.estimateGas.relayTokens(address, receiver, amount);
      gasLimit = gasLimit.mul(1200).div(1000);
      return mediatorContract.relayTokens(address, receiver, amount, { gasLimit });
    }
  }
};
