import { Currency, TokenAmount, NATIVE_CURRENCIES, ROUTER_ADDRESS_MAP, EXCHANGE_MAP } from "@brewlabs/sdk";
import { utils } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { TransactionResponse } from "@ethersproject/providers";
import DeployYieldFarm from "./DeployYieldFarm";
import CurrencyInputPanel from "components/currencyInputPanel";
import React, { useContext, useState } from "react";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import SolidButton from "../button/SolidButton";
import OutlinedButton from "../button/OutlinedButton";
import { SwapContext } from "contexts/SwapContext";

import { useSigner } from "wagmi";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { useUserSlippageTolerance } from "state/user/hooks";
import { Field } from "state/mint/actions";
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from "state/mint/hooks";
import { calculateSlippageAmount, calculateGasMargin } from "utils";
import { maxAmountSpend } from "utils/maxAmountSpend";
import { wrappedCurrency } from "utils/wrappedCurrency";
import { getBrewlabsRouterContract } from "utils/contractHelpers";
import { ROUTER_ADDRESS, ZERO_ADDRESS } from "config/constants";
import { useTransactionAdder } from "state/transactions/hooks";
import { CurrencyLogo } from "@components/logo";

export default function BasicLiquidity() {
  const { account, chainId, library } = useActiveWeb3React();
  const { data: signer } = useSigner();
  const { addLiquidityStep, setAddLiquidityStep }: any = useContext(SwapContext);

  const liquidityProviderFee = 0.25;
  const tokenHoldersFee = 0.0;
  const referralFee = 0.0;
  const brewlabsFee = 0.05;
  const tokenOwnerFee = 0.0;
  const FEE_PRECISION = 100;

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(undefined, undefined);

  const { onFieldAInput, onFieldBInput, onCurrencySelection } = useMintActionHandlers(noLiquidity);

  const currencyA = currencies[Field.CURRENCY_A];
  const currencyB = currencies[Field.CURRENCY_B];

  const routerAddr = ROUTER_ADDRESS_MAP[EXCHANGE_MAP[chainId][0]?.key][chainId];
  const isValid = !error;

  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const [allowedSlippage] = useUserSlippageTolerance();
  const deadline = 1000;

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      };
    },
    {}
  );

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? "0"),
      };
    },
    {}
  );

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[chainId]);
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[chainId]);

  const addTransaction = useTransactionAdder();

  const onAdd = async () => {
    if (!chainId || !library || !account) return;
    const router = getBrewlabsRouterContract(chainId, routerAddr, signer);

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts;

    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    };

    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline;

    let estimate;
    let method: (...args: any) => Promise<TransactionResponse>;
    let args: Array<string | string[] | number>;
    let value: BigNumber | null;
    if (currencyA === NATIVE_CURRENCIES[chainId] || currencyB === NATIVE_CURRENCIES[chainId]) {
      const tokenBIsETH = currencyB === NATIVE_CURRENCIES[chainId];
      estimate = router.estimateGas.addLiquidityETH;
      method = router.addLiquidityETH;
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? "", // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadlineFromNow,
      ];
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString());
    } else {
      estimate = router.estimateGas.addLiquidity;
      method = router.addLiquidity;
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? "",
        wrappedCurrency(currencyB, chainId)?.address ?? "",
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadlineFromNow,
      ];
      value = null;
    }

    setAttemptingTxn(true);
    // const aa = await estimate(...args, value ? { value } : {})
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          });

          setTxHash(response.hash);
        })
      )
      .catch((e) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e);
        }
      });
    // setAttemptingTxn(true);
    // setTimeout(() => {
    //   setAttemptingTxn(false);
    //   setTxHash("aaaa");
    // }, 2000);
  };

  const onNext = () => {
    if (addLiquidityStep === 2) {
      onAdd();
    } else {
      setAddLiquidityStep(4);
    }
  };

  const data = [
    {
      key: "Estimated token price",
      value: "$0.42",
    },
    {
      key: "Estimated pool starting marketcap",
      value: "$204,000.00",
    },
    {
      key: "Pool fee for token owner",
      value: tokenOwnerFee.toFixed(2) + "%",
    },
    {
      key: "Pool fee for liquidity providers",
      value: liquidityProviderFee.toFixed(2) + "%",
    },
    // {
    //   key: "Pool fee for token holders",
    //   value: tokenHoldersFee.toFixed(2) + "%",
    // },
    {
      key: "Pool fee for Brewlabs protocol",
      value: "0.05%",
    },
    {
      key: "Total pool fee",
      value: (tokenOwnerFee + tokenHoldersFee + liquidityProviderFee + brewlabsFee).toFixed(2) + "%",
    },
  ];

  return (
    <>
      {addLiquidityStep < 4 ? (
        <>
          <div className="font-['Roboto'] text-xl text-white">{`${
            addLiquidityStep === 3 ? "Step 1/2: " : ""
          }Create basic liquidity pool`}</div>

          <div className="px-0 sm:px-4">
            <div className="mt-6 rounded-2xl border border-gray-600">
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                onMax={() => {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? "");
                }}
                onCurrencySelect={onCurrencySelection}
                currency={currencies[Field.CURRENCY_A]}
                balance={currencyBalances[Field.CURRENCY_A]}
                type={"liquidity"}
                currencies={currencies}
                showMaxButton
              ></CurrencyInputPanel>
            </div>

            <div className="z-10 -my-2 flex justify-center">
              <div className="rounded-lg bg-primary px-1">
                <PlusSmallIcon className="h-6 w-6 dark:text-gray-900" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-600">
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onFieldBInput}
                onMax={() => {
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? "");
                }}
                onCurrencySelect={onCurrencySelection}
                currency={currencies[Field.CURRENCY_B]}
                balance={currencyBalances[Field.CURRENCY_B]}
                currencies={currencies}
                type={"liquidity"}
                inputCurrencySelect={false}
                showMaxButton
              ></CurrencyInputPanel>
            </div>

            <div className="mb-6 mt-3 rounded-3xl border border-gray-300 px-5 py-3 font-['Roboto'] text-xs font-bold text-gray-400 sm:px-8 sm:text-sm ">
              <div className="mb-3 flex justify-between">
                <div className="text-base text-gray-300 sm:text-xl">New pool metrics</div>
                <div className="flex min-w-[100px] items-center">
                  {currencies[Field.CURRENCY_A] && <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="30px" />}
                  {currencies[Field.CURRENCY_B] && (
                    <div className="-ml-2">
                      <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="30px" />
                    </div>
                  )}
                </div>
              </div>
              {data.map((item) => (
                <div key={item.key} className="mt-1 flex justify-between">
                  <div>{item.key}</div>
                  <div className="ml-2 flex min-w-[120px]">
                    <div className="ml-[12px]">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {approvalA === ApprovalState.NOT_APPROVED ||
          approvalA === ApprovalState.PENDING ||
          approvalB === ApprovalState.NOT_APPROVED ||
          approvalB === ApprovalState.PENDING ? (
            <div
              className={`grid ${
                approvalA === ApprovalState.APPROVED || approvalB === ApprovalState.APPROVED
                  ? "grid-cols-1"
                  : "grid-cols-2"
              } gap-2`}
            >
              {approvalA !== ApprovalState.APPROVED && (
                <SolidButton onClick={approveACallback} disabled={approvalA === ApprovalState.PENDING}>
                  {approvalA === ApprovalState.PENDING
                    ? `Approving ${currencies[Field.CURRENCY_A]?.symbol}`
                    : `Approve ${currencies[Field.CURRENCY_A]?.symbol}`}
                </SolidButton>
              )}
              {approvalB !== ApprovalState.APPROVED && (
                <SolidButton onClick={approveBCallback} disabled={approvalB === ApprovalState.PENDING}>
                  {approvalB === ApprovalState.PENDING
                    ? `Approving ${currencies[Field.CURRENCY_B]?.symbol}`
                    : `Approve ${currencies[Field.CURRENCY_B]?.symbol}`}
                </SolidButton>
              )}
            </div>
          ) : (
            <SolidButton
              onClick={onNext}
              disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
            >
              {error
                ? error
                : addLiquidityStep === 2
                ? noLiquidity
                  ? attemptingTxn ? "Creating..." : "Create pool"
                  : attemptingTxn ? "Adding..." : "Add liquidity"
                : "Next: Select yield farm metrics"}
            </SolidButton>
          )}
          <OutlinedButton className="mt-1 font-bold" small onClick={() => setAddLiquidityStep(1)}>
            Back
          </OutlinedButton>
        </>
      ) : (
        <DeployYieldFarm
          onAddLiquidity={onAdd}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          currencies={currencies}
        ></DeployYieldFarm>
      )}
    </>
  );
}
