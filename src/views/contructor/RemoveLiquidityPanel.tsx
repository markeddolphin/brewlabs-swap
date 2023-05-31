import { useCallback, useContext, useMemo, useState } from "react";
import { EXCHANGE_MAP, ROUTER_ADDRESS_MAP, WNATIVE } from "@brewlabs/sdk";
import { TransactionResponse } from "alchemy-sdk";
import { BigNumber, Contract, ethers } from "ethers";
import { splitSignature } from "ethers/lib/utils";
import { toast } from "react-toastify";
import { useAccount, useSigner } from "wagmi";

import { NETWORKS } from "config/constants/networks";
import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { ApprovalState } from "hooks/useApproveCallback";
import { useApproveCallback } from "hooks/useApproveCallback";
import useDebouncedChangeHandler from "hooks/useDebouncedChangeHandler";
import { usePairContract } from "hooks/useContract";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import useTransactionDeadline from "hooks/useTransactionDeadline";
import { getExplorerLink, getNetworkLabel } from "lib/bridge/helpers";
import { useBurnActionHandlers, useDerivedBurnInfo } from "state/burn/hooks";
import { Field } from "state/burn/actions";
import { useUserSlippageTolerance } from "state/user/hooks";
import { useTransactionAdder } from "state/transactions/hooks";
import { calculateGasMargin, calculateSlippageAmount, isAddress } from "utils";
import { getLpManagerAddress } from "utils/addressHelpers";
import { getLpManagerContract, getBrewlabsRouterContract } from "utils/contractHelpers";
import { formatAmount } from "utils/formatApy";
import { getChainLogo, getExplorerLogo } from "utils/functions";
import { getNetworkGasPrice } from "utils/getGasPrice";
import getTokenLogoURL from "utils/getTokenLogoURL";

import StyledButton from "views/directory/StyledButton";
import OutlinedButton from "views/swap/components/button/OutlinedButton";
import SolidButton from "views/swap/components/button/SolidButton";

import StyledSlider from "./StyledSlider";

export default function RemoveLiquidityPanel({
  onBack,
  fetchLPTokens,
  selectedChainId,
  currencyA,
  currencyB,
  lpPrice = undefined,
}) {
  const { address: account } = useAccount();
  const { data: signer } = useSigner();

  const { chainId } = useActiveChainId();
  const { library }: any = useActiveWeb3React();
  const { canSwitch, switchNetwork } = useSwitchNetwork();
  const { pending, setPending }: any = useContext(DashboardContext);

  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(
    null
  );

  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB]);

  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined);

  const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts;

  const [allowedSlippage] = useUserSlippageTolerance();

  const routerAddr = ROUTER_ADDRESS_MAP[EXCHANGE_MAP[chainId][0]?.key][chainId]?.address;
  const lpManager = getLpManagerAddress(chainId);
  const deadline = useTransactionDeadline();

  const [isGetWETH, setIsGetWETH] = useState(false);
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    lpManager === "" ? routerAddr : lpManager
  );

  const { onUserInput: _onUserInput } = useBurnActionHandlers();
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address);

  const onUserInput = useCallback(
    (field: Field, value: string) => {
      return _onUserInput(field, value);
    },
    [_onUserInput]
  );

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString());
    },
    [onUserInput]
  );

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback
  );

  const addTransaction = useTransactionAdder();

  async function onRemove() {
    setPending(true);
    try {
      if (!chainId || !library || !account || !deadline) throw new Error("missing dependencies");

      if (!currencyAmountA || !currencyAmountB) {
        throw new Error("missing currency amounts");
      }
      const router = getBrewlabsRouterContract(chainId, routerAddr, signer);
      const gasPrice = await getNetworkGasPrice(library, chainId);

      const amountsMin = {
        [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
        [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
      };

      if (!currencyA || !currencyB) throw new Error("missing tokens");
      const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
      if (!liquidityAmount) throw new Error("missing liquidity amount");

      if (!tokenA || !tokenB) throw new Error("could not wrap");
      let methodNames: string[];
      let args: Array<string | string[] | number | boolean>;
      const currencyBIsETH = currencyB.wrapped.address === WNATIVE[selectedChainId].address;
      const currencyAIsETH = currencyA.wrapped.address === WNATIVE[selectedChainId].address;
      if (approval === ApprovalState.APPROVED) {
        // removeLiquidityETH
        if (!isGetWETH) {
          methodNames = ["removeLiquidityETH", "removeLiquidityETHSupportingFeeOnTransferTokens"];
          args = [
            currencyBIsETH ? tokenA.address : tokenB.address,
            liquidityAmount.raw.toString(),
            amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
            amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
            account,
            deadline.toHexString(),
          ];
        }
        // removeLiquidity
        else {
          methodNames = ["removeLiquidity"];
          args = [
            tokenA.address,
            tokenB.address,
            liquidityAmount.raw.toString(),
            amountsMin[Field.CURRENCY_A].toString(),
            amountsMin[Field.CURRENCY_B].toString(),
            account,
            deadline.toHexString(),
          ];
        }
      }

      const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
        methodNames.map((methodName) =>
          router.estimateGas[methodName](...args)
            .then(calculateGasMargin)
            .catch((err) => {
              console.error(`estimateGas failed`, methodName, args, err);
              return undefined;
            })
        )
      );

      const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
        BigNumber.isBigNumber(safeGasEstimate)
      );

      // all estimations failed...
      if (indexOfSuccessfulEstimation === -1) {
        console.error("This transaction would fail. Please contact support.");
      } else {
        const methodName = methodNames[indexOfSuccessfulEstimation];
        const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

        setPending(true);
        await router[methodName](...args, {
          gasLimit: safeGasEstimate,
          gasPrice,
        })
          .then((response: TransactionResponse) => {
            setPending(false);

            addTransaction(response, {
              summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
                currencyA?.symbol
              } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
            });
            toast.success("Liquidity was removed");

            fetchLPTokens(chainId);
            onBack();
            // setTxHash(response.hash);
          })
          .catch((err: Error) => {
            setPending(false);
            // we only care if the error is something _other_ than the user rejected the tx
            console.error(err);
          });
      }
    } catch (e) {
      console.log(e);
    }
    setPending(false);
  }

  async function onRemoveWithManager() {
    if (!chainId || !signer || !account || !deadline) throw new Error("missing dependencies");
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts;
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error("missing currency amounts");
    }

    const lpManagerContract = getLpManagerContract(chainId, signer);
    const gasPrice = await getNetworkGasPrice(library, chainId);

    if (!currencyA || !currencyB) throw new Error("missing tokens");
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error("missing liquidity amount");

    const currencyBIsETH = currencyB.isNative;
    const oneCurrencyIsETH = currencyA.isNative || currencyBIsETH;

    if (!tokenA || !tokenB) throw new Error("could not wrap");

    let methodNames: string[];
    let args: Array<string | string[] | number | boolean>;
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ["removeLiquidityETH", "removeLiquidityETHSupportingFeeOnTransferTokens"];
        args = [currencyBIsETH ? tokenA.address : tokenB.address, liquidityAmount.raw.toString()];
      }
      // removeLiquidity
      else {
        methodNames = ["removeLiquidity"];
        args = [tokenA.address, tokenB.address, liquidityAmount.raw.toString()];
      }
    } else {
      throw new Error("Attempting to confirm without approval. Please contact support.");
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        lpManagerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((err) => {
            console.error(`estimateGas failed`, methodName, args, err);
            return undefined;
          })
      )
    );

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate)
    );

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error("This transaction would fail. Please contact support.");
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation];
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

      setPending(true);
      await lpManagerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
        gasPrice,
      })
        .then((response: TransactionResponse) => {
          setPending(false);

          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
          });
          toast.success("Liquidity was removed");

          fetchLPTokens(chainId);
          onBack();
          // setTxHash(response.hash)
        })
        .catch((err: Error) => {
          setPending(false);
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(err);
        });
    }
  }

  async function onAttemptToApprove() {
    setPending(true);
    try {
      if (!pairContract || !pair || !library || !deadline) throw new Error("missing dependencies");
      const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
      if (!liquidityAmount) throw new Error("missing liquidity amount");

      // try to gather a signature for permission
      const nonce = await pairContract.nonces(account);

      const EIP712Domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ];
      const domain = {
        name: "Pancake LPs",
        version: "1",
        chainId,
        verifyingContract: pair.liquidityToken.address,
      };
      const Permit = [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ];
      const message = {
        owner: account,
        spender: lpManager === "" ? routerAddr : lpManager,
        value: liquidityAmount.raw.toString(),
        nonce: nonce.toHexString(),
        deadline: deadline.toNumber(),
      };
      const data = JSON.stringify({
        types: {
          EIP712Domain,
          Permit,
        },
        domain,
        primaryType: "Permit",
        message,
      });

      if (lpManager === "") {
        library
          .send("eth_signTypedData_v4", [account, data])
          .then(splitSignature)
          .then((signature) => {
            setSignatureData({
              v: signature.v,
              r: signature.r,
              s: signature.s,
              deadline: deadline.toNumber(),
            });
          })
          .catch((err) => {
            // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
            if (err?.code !== 4001) {
              approveCallback();
            }
          });
      } else {
        await approveCallback();
      }
    } catch (e) {
      console.log(e);
    }
    setPending(false);
  }

  const token0Address: any = isAddress(tokenA?.address);
  const token1Address: any = isAddress(tokenB?.address);

  return (
    <div>
      <div className="mt-[52px] flex justify-center font-roboto">
        <img
          src={getTokenLogoURL(token0Address, selectedChainId)}
          alt={""}
          className="h-20 w-20 rounded-full"
          onError={(e: any) => {
            e.target.src = `/images/dashboard/tokens/empty-token-${selectedChainId === 1 ? "eth" : "bsc"}.webp`;
          }}
        />
        <img
          src={getTokenLogoURL(token1Address, selectedChainId)}
          alt={""}
          className="-ml-5 h-20 w-20 rounded-full"
          onError={(e: any) => {
            e.target.src = `/images/dashboard/tokens/empty-token-${selectedChainId === 1 ? "eth" : "bsc"}.webp`;
          }}
        />
      </div>
      <div className="mr-6 mt-6 flex items-center justify-between">
        <div className="mr-5 flex-1">
          <StyledSlider value={innerLiquidityPercentage} setValue={setInnerLiquidityPercentage} />
        </div>
        <div className="relative">
          <div className="h-6 w-[70px]">
            <StyledButton type={"quinary"} onClick={() => setInnerLiquidityPercentage(100)}>
              <div className="text-xs leading-none">Max</div>
            </StyledButton>
          </div>
          <div className="absolute -bottom-[28px] right-0 whitespace-nowrap text-sm">
            {lpPrice ? (
              <>
                $
                {(
                  +formatAmount(+ethers.utils.formatEther(parsedAmounts[Field.LIQUIDITY]?.raw.toString() ?? "0"), 10) *
                  lpPrice
                ).toFixed(2)}
                &nbsp; USD
              </>
            ) : (
              <>
                {+formatAmount(ethers.utils.formatEther(parsedAmounts[Field.LIQUIDITY]?.raw.toString() ?? "0"), 6)}
                &nbsp; {tokenA?.symbol}-{tokenB?.symbol}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mx-0 mt-[60px] rounded-[30px] border border-[#FFFFFF80] px-4 py-4 font-bold text-[#FFFFFF80] sm:mx-4 sm:px-8">
        <div className="text-lg text-[#FFFFFFBF]">Receive</div>
        <div>
          <div className="flex flex-wrap items-center justify-between text-sm">
            <div className="w-full xsm:w-[50%]">
              {currencyA && currencyA.wrapped.address === WNATIVE[selectedChainId].address
                ? isGetWETH
                  ? `W${NETWORKS[selectedChainId].nativeCurrency.name}`
                  : NETWORKS[selectedChainId].nativeCurrency.name
                : tokenA?.symbol}
            </div>
            <div className="mt-1 flex w-full items-center justify-between xsm:mt-0 xsm:w-[50%]">
              <div className="flex items-center">
                <img
                  src={getTokenLogoURL(token0Address, selectedChainId)}
                  alt={""}
                  className="mr-2 h-5 w-5 rounded-full"
                  onError={(e: any) => {
                    e.target.src = `/images/dashboard/tokens/empty-token-${selectedChainId === 1 ? "eth" : "bsc"}.webp`;
                  }}
                />
                <div>{currencyAmountA && !currencyAmountA.equalTo(0) ? currencyAmountA.toFixed(3) : "0.000"}</div>
              </div>
              {currencyA && currencyA.wrapped.address === WNATIVE[selectedChainId].address ? (
                <div className="h-8 w-[110px]">
                  <StyledButton type={"quinary"} onClick={() => setIsGetWETH(!isGetWETH)}>
                    <div className="flex items-center justify-between">
                      <img
                        src={
                          !isGetWETH
                            ? getTokenLogoURL(WNATIVE[selectedChainId].address, selectedChainId)
                            : getChainLogo(selectedChainId)
                        }
                        alt={""}
                        className="mr-2 h-5 w-5 rounded-full"
                      />
                      <div className="text-xs leading-none">
                        GET{" "}
                        {!isGetWETH
                          ? `W${NETWORKS[selectedChainId].nativeCurrency.name}`
                          : NETWORKS[selectedChainId].nativeCurrency.name}
                      </div>
                    </div>
                  </StyledButton>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-between text-sm">
            <div className="w-full xsm:w-[50%]">
              {currencyB && currencyB.wrapped.address === WNATIVE[selectedChainId].address
                ? isGetWETH
                  ? `W${NETWORKS[selectedChainId].nativeCurrency.name}`
                  : NETWORKS[selectedChainId].nativeCurrency.name
                : tokenB?.symbol}
            </div>
            <div className="mt-1 flex w-full items-center justify-between xsm:mt-0 xsm:w-[50%]">
              <div className="flex items-center">
                <img
                  src={
                    currencyB && currencyB.wrapped.address === WNATIVE[selectedChainId].address
                      ? isGetWETH
                        ? getTokenLogoURL(currencyB.wrapped.address, selectedChainId)
                        : getChainLogo(selectedChainId)
                      : getTokenLogoURL(token1Address, selectedChainId)
                  }
                  alt={""}
                  className="mr-2 h-5 w-5 rounded-full"
                  onError={(e: any) => {
                    e.target.src = `/images/dashboard/tokens/empty-token-${selectedChainId === 1 ? "eth" : "bsc"}.webp`;
                  }}
                />
                <div>{currencyAmountB && !currencyAmountB.equalTo(0) ? currencyAmountB.toFixed(3) : "0.000"}</div>
              </div>
              {currencyB && currencyB.wrapped.address === WNATIVE[selectedChainId].address ? (
                <div className="h-8 w-[110px]">
                  <StyledButton type={"quinary"} onClick={() => setIsGetWETH(!isGetWETH)}>
                    <div className="flex items-center justify-between">
                      <img
                        src={
                          !isGetWETH
                            ? getTokenLogoURL(WNATIVE[selectedChainId].address, selectedChainId)
                            : getChainLogo(selectedChainId)
                        }
                        alt={""}
                        className="mr-2 h-5 w-5 rounded-full"
                      />
                      <div className="text-xs leading-none">
                        GET{" "}
                        {!isGetWETH
                          ? `W${NETWORKS[selectedChainId].nativeCurrency.name}`
                          : NETWORKS[selectedChainId].nativeCurrency.name}
                      </div>
                    </div>
                  </StyledButton>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap flex-wrap justify-between text-sm">
            <div className="w-full xsm:w-[50%]">Liquidity token address</div>
            <div className="mt-1 flex w-full items-center xsm:mt-0 xsm:w-[50%]">
              <img src={getExplorerLogo(selectedChainId)} alt={""} className="mr-2 h-5 w-5 rounded-full" />
              <a
                className="max-w-[200px] flex-1 overflow-hidden text-ellipsis underline"
                href={getExplorerLink(selectedChainId, "token", pair?.liquidityToken.address)}
                target={"_blank"}
                rel="noreferrer"
              >
                {pair?.liquidityToken.address}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-3">
          {selectedChainId === chainId ? (
            approval === ApprovalState.APPROVED ? (
              <SolidButton
                className="w-full"
                onClick={lpManager === "" ? onRemove : onRemoveWithManager}
                disabled={pending || !library || !account || !tokenA || !tokenB || !parsedAmounts[Field.LIQUIDITY]}
              >
                Remove Liquidity
              </SolidButton>
            ) : (
              <SolidButton
                className="w-full"
                onClick={() => onAttemptToApprove()}
                disabled={pending || !library || !account || !parsedAmounts[Field.LIQUIDITY]}
              >
                Enable
              </SolidButton>
            )
          ) : (
            <SolidButton className="w-full" onClick={() => switchNetwork(selectedChainId)}>
              Switch To {getNetworkLabel(selectedChainId)} Network
            </SolidButton>
          )}
        </div>
        <OutlinedButton small onClick={onBack}>
          Back
        </OutlinedButton>
      </div>
    </div>
  );
}
