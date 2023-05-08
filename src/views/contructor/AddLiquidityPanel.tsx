import ChainSelect from "views/directory/DeployerModal/ChainSelect";
import RouterSelect from "views/directory/DeployerModal/RouterSelect";
import { useActiveChainId } from "hooks/useActiveChainId";
import CurrencyInputPanel from "components/currencyInputPanel";
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from "state/mint/hooks";
import { Field } from "state/mint/actions";
import { TokenAmount } from "@brewlabs/sdk";
import maxAmountSpend from "utils/maxAmountSpend";
import { getExplorerLogo, routers } from "utils/functions";
import { useEffect, useState } from "react";
import router from "next/router";
import { useTranslation } from "contexts/localization";
import SolidButton from "views/swap/components/button/SolidButton";
import OutlinedButton from "views/swap/components/button/OutlinedButton";
import { ONE_BIPS, ROUTER_ADDRESS } from "config/constants";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { getLpManagerAddress } from "utils/addressHelpers";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAccount, useConnect, useSigner } from "wagmi";
import { calculateGasMargin, calculateSlippageAmount } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getLpManagerContract, getBrewlabsRouterContract } from "utils/contractHelpers";
import useTransactionDeadline from "hooks/useTransactionDeadline";
import { useUserSlippageTolerance } from "state/user/hooks";
import { BigNumber, TransactionResponse } from "alchemy-sdk";
import { wrappedCurrency } from "utils/wrappedCurrency";
import { useTransactionAdder } from "state/transactions/hooks";
import Modal from "components/Modal";
import WalletSelector from "components/wallet/WalletSelector";
import { toast } from "react-toastify";
import { useCurrencySelectRoute } from "./useCurrencySelectRoute";

export default function AddLiquidityPanel({
  onBack,
  fetchLPTokens,
  selectedChainId,
  currencyA: currencyA_ = undefined,
  currencyB: currencyB_ = undefined,
}) {
  const { chainId, isWrongNetwork } = useActiveChainId();
  const { library }: any = useActiveWeb3React();
  const { address: account } = useAccount();
  const { data: signer } = useSigner();

  const { independentField, typedValue, otherTypedValue } = useMintState();
  const deadline = useTransactionDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();
  const addTransaction = useTransactionAdder();
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false);
  const { isLoading } = useConnect();
  const [openWalletModal, setOpenWalletModal] = useState(false);

  const {
    dependentField,
    currencies,
    currencyBalances,
    parsedAmounts,
    noLiquidity,
    poolTokenPercentage,
    liquidityMinted,
    price,
    pair,
    error,
  } = useDerivedMintInfo(currencyA_ ?? undefined, currencyB_ ?? undefined);
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute();

  const lpManager = getLpManagerAddress(chainId);

  const currencyA = currencies[Field.CURRENCY_A];
  const currencyB = currencies[Field.CURRENCY_B];

  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    lpManager === "" ? ROUTER_ADDRESS[chainId] : lpManager
  );
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    lpManager === "" ? ROUTER_ADDRESS[chainId] : lpManager
  );

  const { onFieldAInput, onFieldBInput, onCurrencySelection } = useMintActionHandlers(noLiquidity);
  const { t } = useTranslation();

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

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

  useEffect(() => {
    if (chainId && isWrongNetwork === false && router.query?.currency) {
      if (currencyA_?.symbol !== router.query.currency[0] && currencyA_?.address !== router.query.currency[0]) {
        handleCurrencyASelect(currencyA);
      }
      if (currencyB_?.symbol !== router.query.currency[1] && currencyB_?.address !== router.query.currency[1]) {
        handleCurrencyBSelect(currencyB);
      }
    }
  }, [chainId, isWrongNetwork, currencyA_, currencyB_]);

  const isValid = !error;
  async function onAdd() {
    if (!chainId || !library || !account) return;
    const gasPrice = await getNetworkGasPrice(library, chainId);

    const router = getBrewlabsRouterContract(chainId, signer);
    const lpManagerContract = getLpManagerContract(chainId, signer);

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts;
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    };

    let estimate;
    let method: (...args: any) => Promise<TransactionResponse>;
    let args: Array<string | string[] | number>;
    let value: BigNumber | null;
    if (currencyA.isNative || currencyB.isNative) {
      const tokenBIsETH = currencyB.isNative;
      if (lpManager === "") {
        estimate = router.estimateGas.addLiquidityETH;
        method = router.addLiquidityETH;
        args = [
          wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? "", // token
          (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
          amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
          amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
          account,
          deadline.toHexString(),
        ];
      } else {
        estimate = lpManagerContract.estimateGas.addLiquidityETH;
        method = lpManagerContract.addLiquidityETH;
        args = [
          wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? "", // token
          (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
          noLiquidity ? 0 : allowedSlippage, // slippage
        ];
      }
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString());
    } else {
      if (lpManager === "") {
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
          deadline.toHexString(),
        ];
      } else {
        estimate = lpManagerContract.estimateGas.addLiquidity;
        method = lpManagerContract.addLiquidity;
        args = [
          wrappedCurrency(currencyA, chainId)?.address ?? "",
          wrappedCurrency(currencyB, chainId)?.address ?? "",
          parsedAmountA.raw.toString(),
          parsedAmountB.raw.toString(),
          noLiquidity ? 0 : allowedSlippage,
        ];
      }
      value = null;
    }

    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then((response) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          });

          // setTxHash(response.hash);
          toast.success("Liquidity was added");

          fetchLPTokens(chainId);
          onBack();
        })
      )
      .catch((err) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err);
        }
      });
  }

  return (
    <div>
      <Modal open={openWalletModal} onClose={() => !isLoading && setOpenWalletModal(false)}>
        <WalletSelector onDismiss={() => setOpenWalletModal(false)} />
      </Modal>
      <div className="mt-3">
        <ChainSelect />
      </div>
      <div className="-mt-2">
        <RouterSelect />
      </div>
      <div className="my-2 rounded-[30px] border border-[#FFFFFF80]">
        <CurrencyInputPanel
          label={t("TokenA")}
          value={formattedAmounts[Field.CURRENCY_A]}
          onUserInput={onFieldAInput}
          onMax={() => {
            onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? "");
          }}
          showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
          onCurrencySelect={(field, currency) => {
            if (currencyA_) {
              handleCurrencyASelect(currency);
            } else onCurrencySelection(field, currency);
          }}
          currency={currencies[Field.CURRENCY_A]}
          balance={currencyBalances[Field.CURRENCY_A]}
          type={"liquidity"}
          currencies={currencies}
        />
      </div>
      <div className="relative z-10 mx-auto -mb-4 -mt-4 flex h-7 w-10 items-center justify-center rounded-[10px] bg-primary text-2xl leading-none text-black">
        <div className="-mt-1">+</div>
      </div>
      <div className="my-2 rounded-[30px] border border-dashed border-[#FFFFFF80]">
        <CurrencyInputPanel
          label={t("TokenB")}
          value={formattedAmounts[Field.CURRENCY_B]}
          onUserInput={onFieldBInput}
          onMax={() => {
            onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? "");
          }}
          showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
          onCurrencySelect={(field, currency) => {
            if (currencyB_) {
              handleCurrencyBSelect(currency);
            } else onCurrencySelection(field, currency);
          }}
          currency={currencies[Field.CURRENCY_B]}
          balance={currencyBalances[Field.CURRENCY_B]}
          inputCurrencySelect={false}
          type={"liquidity"}
          currencies={currencies}
        />
      </div>
      {currencyA && currencyB ? (
        <div className="mt-6 rounded-[30px] border border-[#FFFFFF80] px-3 py-4 font-roboto font-bold text-[#FFFFFF80] sm:px-8">
          <div className="text-xl text-[#FFFFFFBF] text-white">Create</div>
          <div className="text-sm">
            <div className="mt-2 flex flex-wrap justify-between">
              <div className="w-full xsm:w-[60%]">Approximate LP tokens</div>
              <div className="w-full xsm:w-[40%]">
                {liquidityMinted ? liquidityMinted.toSignificant(6) : "0.000"}
                &nbsp;{currencyA.symbol}-{currencyB.symbol}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap justify-between xsm:mt-0">
              <div className="w-full xsm:w-[60%]">Share of pool</div>
              <div className="w-full xsm:w-[40%]">
                {noLiquidity && price
                  ? "100"
                  : (poolTokenPercentage?.lessThan(ONE_BIPS) ? "<0.01" : poolTokenPercentage?.toFixed(2)) ?? "0"}
                %
              </div>
            </div>
            <div className="mt-2 flex flex-wrap justify-between xsm:mt-0">
              <div className="w-full xsm:w-[60%]">Liquidity token address</div>
              {pair ? (
                <div className="relative flex w-full items-center xsm:w-[40%]">
                  <img
                    src={getExplorerLogo(chainId)}
                    alt={""}
                    className="absolute left-0 top-[1px] h-4 w-4 rounded-full xsm:-left-6"
                  />
                  <a
                    className="ml-6 mr-0 max-w-[200px] flex-1 overflow-hidden text-ellipsis underline xsm:ml-0 sm:mr-4"
                    target={"_blank"}
                    href={`https://${chainId === 1 ? "etherscan.io" : "bscscan.com"}/token/${
                      pair.liquidityToken.address
                    }`}
                    rel="noreferrer"
                  >
                    {pair.liquidityToken.address}
                  </a>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="mb-3 mt-6">
        {isValid &&
          (approvalA === ApprovalState.NOT_APPROVED ||
            approvalA === ApprovalState.PENDING ||
            approvalB === ApprovalState.NOT_APPROVED ||
            approvalB === ApprovalState.PENDING) && (
            <div className="flex w-full justify-between">
              {approvalA !== ApprovalState.APPROVED && (
                <SolidButton
                  onClick={approveACallback}
                  disabled={approvalA === ApprovalState.PENDING}
                  className={`${approvalB !== ApprovalState.APPROVED ? "w-[48%]" : "w-full"}`}
                >
                  {approvalA === ApprovalState.PENDING
                    ? t("Enabling %asset%", { asset: currencies[Field.CURRENCY_A]?.symbol })
                    : t("Enable %asset%", { asset: currencies[Field.CURRENCY_A]?.symbol })}
                </SolidButton>
              )}
              {approvalB !== ApprovalState.APPROVED && (
                <SolidButton
                  onClick={approveBCallback}
                  disabled={approvalB === ApprovalState.PENDING}
                  className={`${approvalA !== ApprovalState.APPROVED ? "w-[48%]" : "w-full"}`}
                >
                  {approvalB === ApprovalState.PENDING
                    ? t("Enabling %asset%", { asset: currencies[Field.CURRENCY_B]?.symbol })
                    : t("Enable %asset%", { asset: currencies[Field.CURRENCY_B]?.symbol })}
                </SolidButton>
              )}
            </div>
          )}
        {!(
          isValid &&
          (approvalA === ApprovalState.NOT_APPROVED ||
            approvalA === ApprovalState.PENDING ||
            approvalB === ApprovalState.NOT_APPROVED ||
            approvalB === ApprovalState.PENDING)
        ) ? (
          <SolidButton
            className={`w-full ${
              !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                ? "bg-[#ed5249]"
                : "bg-primary"
            }`}
            onClick={() => {
              onAdd();
              if (error === "Connect Wallet") setOpenWalletModal(true);
            }}
            disabled={
              (!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED) &&
              error !== "Connect Wallet"
            }
          >
            {error ?? t("Supply")}
          </SolidButton>
        ) : (
          ""
        )}
      </div>
      <OutlinedButton small onClick={onBack}>
        Back
      </OutlinedButton>
    </div>
  );
}
