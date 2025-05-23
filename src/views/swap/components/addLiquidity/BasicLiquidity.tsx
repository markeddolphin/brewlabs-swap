import { useMemo } from "react";
import { TokenAmount, NATIVE_CURRENCIES, ROUTER_ADDRESS_MAP, EXCHANGE_MAP, Token } from "@brewlabs/sdk";
import { BigNumber } from "@ethersproject/bignumber";
import { Tooltip as ReactTooltip } from "react-tooltip";
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
import { getBep20Contract, getBrewlabsRouterContract } from "utils/contractHelpers";
import { useTransactionAdder } from "state/transactions/hooks";
import { CurrencyLogo } from "@components/logo";
import useTokenMarketChart, { defaultMarketData } from "@hooks/useTokenMarketChart";
import useTotalSupply from "@hooks/useTotalSupply";
import { getChainLogo } from "utils/functions";
import { BurnSVG, InfoSVG, LockFillSVG, PoolFeeSVG, checkCircleSVG } from "@components/dashboard/assets/svgs";
import { FREEZER_CHAINS, ZERO_ADDRESS } from "config/constants";
import WarningModal from "@components/warningModal";

export default function BasicLiquidity() {
  const { account, chainId, library } = useActiveWeb3React();
  const { data: signer } = useSigner();
  const { addLiquidityStep, setAddLiquidityStep }: any = useContext(SwapContext);

  const liquidityProviderFee = 0.25;
  const tokenHoldersFee = 0.0;
  const brewlabsFee = 0.05;
  const tokenOwnerFee = 0.0;

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const { dependentField, currencies, pair, currencyBalances, parsedAmounts, noLiquidity, error } = useDerivedMintInfo(
    undefined,
    undefined
  );

  const { onFieldAInput, onFieldBInput, onCurrencySelection } = useMintActionHandlers(noLiquidity);

  const currencyA = currencies[Field.CURRENCY_A];
  const currencyB = currencies[Field.CURRENCY_B];

  const routerAddr = ROUTER_ADDRESS_MAP[EXCHANGE_MAP[chainId][0]?.key][chainId];
  const isValid = !error;

  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");
  const [burnWarningOpen, setBurnWarningOpen] = useState<boolean>(false);

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

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], routerAddr);
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], routerAddr);

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

  const onBurnLiquidity = () => {
    setBurnWarningOpen(true);
  };

  const onBurn = async () => {
    setAttemptingTxn(true);
    try {
      const tokenContract = getBep20Contract(chainId, pair?.liquidityToken.address, signer);
      const balance = await tokenContract.balanceOf(account);
      const tx = await tokenContract.transfer(ZERO_ADDRESS, balance);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
    setAttemptingTxn(false);
  };

  const onNext = () => {
    if (addLiquidityStep === "CreateBasicLiquidityPool") {
      onAdd();
    } else {
      setAddLiquidityStep("DeployYieldFarm");
    }
  };

  const [baseToken, quoteToken] =
    currencies[Field.CURRENCY_B] === NATIVE_CURRENCIES[chainId]
      ? [currencies[Field.CURRENCY_B], currencies[Field.CURRENCY_A]]
      : [currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]];

  const tokenMarketData = useTokenMarketChart(chainId);
  const { usd: baseTokenPrice } = tokenMarketData[baseToken?.wrapped.address.toLowerCase()] || defaultMarketData;
  const quoteTotalSupply = useTotalSupply(quoteToken as Token);
  const [marketcap, poolTokenPrice] = useMemo(() => {
    if (
      !baseTokenPrice ||
      !quoteTotalSupply ||
      !parsedAmounts ||
      !parsedAmounts[Field.CURRENCY_A] ||
      !parsedAmounts[Field.CURRENCY_B]
    )
      return [0, 0];
    const [numerator, denominator] =
      baseToken === currencies[Field.CURRENCY_A]
        ? [Number(parsedAmounts[Field.CURRENCY_A].toExact()), Number(parsedAmounts[Field.CURRENCY_B].toExact())]
        : [Number(parsedAmounts[Field.CURRENCY_B].toExact()), Number(parsedAmounts[Field.CURRENCY_A].toExact())];
    const marketcap = (baseTokenPrice * numerator * Number(quoteTotalSupply.toExact())) / denominator;
    // const price = marketcap / Number(quoteTotalSupply.toExact());
    return [marketcap, marketcap / Number(quoteTotalSupply.toExact())];
  }, [baseTokenPrice, quoteTotalSupply, parsedAmounts]);

  const data = [
    {
      key: "Estimated token price",
      value: `$${poolTokenPrice.toFixed(2)}`,
    },
    {
      key: "Estimated pool starting marketcap",
      value: `$${marketcap.toFixed(2)}`,
    },
    {
      key: "Pool fee for liquidity providers",
      value: `${(Math.round(liquidityProviderFee * 100) / 100).toFixed(2)}%`,
    },
    {
      key: "Pool fee for Brewlabs protocol",
      value: "0.05%",
    },
    {
      key: "Total fixed pool fee",
      value: `${(
        Math.round((tokenOwnerFee + tokenHoldersFee + liquidityProviderFee + brewlabsFee) * 100) / 100
      ).toFixed(2)}%`,
    },
  ];

  const dynamicData = [
    {
      key: "Pool fee directed to referral/burn address ",
      value: `0.00%`,
    },
    {
      key: "Pool fee directed to staking pool ",
      value: `0.00%`,
    },
    {
      key: "Pool fee directed to project team",
      value: `0.00%`,
    },
  ];

  function getName(currencyA, currencyB) {
    return (currencyA && currencyA.symbol) + "-" + (currencyB && currencyB.symbol);
  }

  return (
    <>
      <WarningModal
        type={"burn"}
        open={burnWarningOpen}
        setOpen={setBurnWarningOpen}
        data={{ pair: { name: getName(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]) } }}
        onClick={onBurn}
      />
      {addLiquidityStep === "CreateBasicLiquidityPool" || addLiquidityStep === "CreateBundleLiquidityPool" ? (
        <>
          <div className="font-brand text-xl text-white">{`${
            addLiquidityStep === "CreateBundleLiquidityPool" ? "Step 1/2: " : ""
          }Create basic liquidity pool`}</div>

          <div>
            {!txHash ? (
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
              </div>
            ) : (
              <div className="primary-shadow flex items-center rounded-[30px] bg-[#18181B] p-[12px_24px]">
                <img src={getChainLogo(chainId)} alt={""} className="h-6 w-6 rounded-full" />
                <div className="mx-3 text-primary [&>*:first-child]:!h-4">{checkCircleSVG}</div>
                <div className="flex items-center justify-center">
                  {currencies[Field.CURRENCY_A] && <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="30px" />}
                  {currencies[Field.CURRENCY_B] && (
                    <div className="-ml-2">
                      <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size="30px" />
                    </div>
                  )}
                </div>
                <div className="ml-2 font-brand text-white">
                  {getName(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B])}
                </div>
              </div>
            )}
            <div className="primary-shadow mb-6 mt-3 rounded-3xl px-3 py-3 font-brand text-xs font-bold text-gray-400 xsm:px-5 sm:px-8 sm:text-sm ">
              <div className="mb-3 flex justify-between">
                <div className="text-base text-gray-300 sm:text-xl">New pool metrics</div>
                <div className="flex min-w-[60px] items-center justify-center">
                  {currencies[Field.CURRENCY_A] && <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="30px" />}
                  {currencies[Field.CURRENCY_B] && (
                    <div className="-ml-2">
                      <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size="30px" />
                    </div>
                  )}
                </div>
              </div>
              {data.map((item, i) => (
                <div
                  key={item.key}
                  className={`mt-1 flex justify-between ${data.length - 1 === i ? "text-white" : ""}`}
                >
                  <div>{item.key}</div>
                  <div className="ml-2 flex min-w-[60px] justify-center">
                    <div>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="primary-shadow mb-6 mt-3 rounded-3xl px-3 py-3 font-brand text-xs font-bold text-gray-400 xsm:px-5 sm:px-8 sm:text-sm ">
              <div className="flex items-center text-base text-gray-300">
                <div className="mr-1 scale-[110%] text-[#FFFFFFB0]" id={"dynamicpoolfees"}>
                  <InfoSVG />
                </div>
                <div>Dynamic pool fees</div>
              </div>
              {dynamicData.map((item, i) => (
                <div
                  key={item.key}
                  className={`mt-1 flex justify-between ${data.length - 1 === i ? "text-white" : ""}`}
                >
                  <div>{item.key}</div>
                  <div className="ml-2 flex min-w-[60px] justify-center">
                    <div>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!txHash ? (
            approvalA === ApprovalState.NOT_APPROVED ||
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
                  <SolidButton
                    onClick={approveACallback}
                    disabled={approvalA === ApprovalState.PENDING}
                    pending={approvalA === ApprovalState.PENDING}
                  >
                    {approvalA === ApprovalState.PENDING
                      ? `Approving ${currencies[Field.CURRENCY_A]?.symbol}`
                      : `Approve ${currencies[Field.CURRENCY_A]?.symbol}`}
                  </SolidButton>
                )}
                {approvalB !== ApprovalState.APPROVED && (
                  <SolidButton
                    onClick={approveBCallback}
                    disabled={approvalB === ApprovalState.PENDING}
                    pending={approvalB === ApprovalState.PENDING}
                  >
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
                pending={attemptingTxn}
              >
                {error
                  ? error
                  : addLiquidityStep === "CreateBasicLiquidityPool"
                  ? noLiquidity
                    ? attemptingTxn
                      ? "Creating..."
                      : "Create pool"
                    : attemptingTxn
                    ? "Adding..."
                    : "Add liquidity"
                  : "Next: Select yield farm metrics"}
              </SolidButton>
            )
          ) : (
            <div className="mb-4">
              <SolidButton className="w-full">
                <div className="mx-auto flex w-fit items-center">
                  Set dynamic pool fees <div className="ml-2 scale-75 text-tailwind">{PoolFeeSVG}</div>
                </div>
              </SolidButton>
              <div className="mt-3 flex flex-col justify-between sm:flex-row">
                <a
                  href={`https://freezer.brewlabs.info/${FREEZER_CHAINS[chainId]}/pair-lock/new?pairAddress=${
                    pair?.liquidityToken.address || ZERO_ADDRESS
                  }`}
                  target="_blank"
                >
                  <SolidButton className="mb-2 mr-0 flex-1 text-xs sm:mb-0 sm:mr-3">
                    <div className="mx-auto flex w-fit items-center">
                      <div className="flex-1">
                        Lock liquidity for {getName(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B])}
                      </div>
                      <div className="-mt-0.5 ml-1 scale-75 text-tailwind">{LockFillSVG}</div>
                    </div>
                  </SolidButton>
                </a>
                <SolidButton
                  className="flex-1 !bg-[#D9563A] text-xs hover:!bg-opacity-80"
                  onClick={() => onBurnLiquidity()}
                  disabled={attemptingTxn}
                  pending={attemptingTxn}
                >
                  <div className="mx-auto flex w-fit items-center">
                    <div className="flex-1">
                      Burn liquidity for {getName(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B])}
                    </div>
                    <div className="-mt-0.5 ml-1 scale-75 text-tailwind">{BurnSVG}</div>
                  </div>
                </SolidButton>
              </div>
            </div>
          )}
          <OutlinedButton
            className="mt-1 font-bold"
            small
            onClick={() => setAddLiquidityStep("CreateNewLiquidityPool")}
            // onClick={() => setTxHash("ASDFASD")}
          >
            Back
          </OutlinedButton>
        </>
      ) : (
        // <DeployYieldFarm
        //   onAddLiquidity={onAdd}
        //   pair={pair}
        //   attemptingTxn={attemptingTxn}
        //   hash={txHash}
        //   currencies={currencies}
        //   onBurn={onBurn}
        // ></DeployYieldFarm>
        ""
      )}
      <ReactTooltip anchorId={"dynamicpoolfees"} place="right" content="Available once pool is deployed." />
    </>
  );
}
