import { useState, useMemo, useCallback, useContext } from "react";
import { CurrencyAmount, Percent, FACTORY_ADDRESS_MAP, INIT_CODE_HASH_MAP, Price, ChainId } from "@brewlabs/sdk";
import { useSigner } from "wagmi";
import { ApprovalState, useApproveCallbackFromTrade } from "hooks/useApproveCallback";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useTranslation } from "contexts/localization";
import { PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN, ALLOWED_PRICE_IMPACT_HIGH } from "config/constants";
import contracts from "config/constants/contracts";
import { useUserSlippageTolerance, useUserTransactionTTL } from "state/user/hooks";
import { Field } from "state/swap/actions";
import { useSwapState, useSwapActionHandlers, useDerivedSwapInfo } from "state/swap/hooks";

import maxAmountSpend from "utils/maxAmountSpend";
import { computeTradePriceBreakdown, warningSeverity } from "utils/prices";

import { TailSpin } from "react-loader-spinner";
import CurrencyInputPanel from "components/currencyInputPanel";
import CurrencyOutputPanel from "components/currencyOutputPanel";
import { PrimarySolidButton } from "components/button/index";
import Button from "components/Button";
import History from "./components/History";
import SwitchIconButton from "./components/SwitchIconButton";
import ConfirmationModal from "./components/modal/ConfirmationModal";
import { SwapContext } from "contexts/SwapContext";
import useSwapCallback from "@hooks/swap/useSwapCallback";
import { useSwapAggregator } from "@hooks/swap/useSwapAggregator";
import useWrapCallback, { WrapType } from "@hooks/swap/useWrapCallback";
import WarningModal from "@components/warningModal";

export default function SwapPanel({ type = "swap", disableChainSelect = false }) {
  const { account, chainId } = useActiveWeb3React();

  const { t } = useTranslation();

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [txConfirmInfo, setTxConfirmInfo] = useState({ type: "confirming", tx: "" });
  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // ----------------- ROUTER SWAP --------------------- //

  const { autoMode, buyTax, sellTax, slippage }: any = useContext(SwapContext);
  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const { currencies, currencyBalances, parsedAmount, inputError, v2Trade } = useDerivedSwapInfo();
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  const { onUserInput, onSwitchTokens, onCurrencySelection } = useSwapActionHandlers();

  // txn values
  const [deadline] = useUserTransactionTTL();
  const [userSlippageTolerance] = useUserSlippageTolerance();

  const noLiquidity = useMemo(() => {
    if (chainId === ChainId.BSC_TESTNET || chainId === ChainId.POLYGON)
      return currencies[Field.INPUT] && currencies[Field.OUTPUT] && !trade;
    return true; // use aggregator for non bsc testnet & polygon network
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], trade]);

  const [approval, approveCallback] = useApproveCallbackFromTrade(
    parsedAmount,
    trade,
    userSlippageTolerance,
    noLiquidity
  );

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);

  const { callback: swapCallbackUsingRouter, error: swapCallbackError }: any = useSwapCallback(
    trade,
    userSlippageTolerance,
    deadline,
    recipient
  );

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const confirmPriceImpactWithoutFee = (priceImpactWithoutFee: Percent) => {
    if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
      return (
        window.prompt(
          `This swap has a price impact of at least ${PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(
            0
          )}%. Please type the word "confirm" to continue with this swap.`
        ) === "confirm"
      );
    }
    if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
      return window.confirm(
        `This swap has a price impact of at least ${ALLOWED_PRICE_IMPACT_HIGH.toFixed(
          0
        )}%. Please confirm that you would like to continue with this swap.`
      );
    }
    return true;
  };

  const handleApproveUsingRouter = async () => {
    try {
      const response = await approveCallback();
      await response.wait();
    } catch (e) {}
  };

  const handleSwapUsingRouter = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return;
    }
    if (!swapCallbackUsingRouter) {
      return;
    }
    setAttemptingTxn(true);
    swapCallbackUsingRouter()
      .then((hash) => {
        setAttemptingTxn(false);
        onUserInput(Field.INPUT, "");
      })
      .catch((error) => {
        setAttemptingTxn(false);
        onUserInput(Field.INPUT, "");
      });
  }, [priceImpactWithoutFee, swapCallbackUsingRouter]);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact());
    }
  }, [maxAmountInput, onUserInput]);

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
      if (value === "") onUserInput(Field.OUTPUT, "");
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // ----------------- AGGREGATION SWAP --------------------- //

  const {
    callback: swapCallbackUsingAggregator,
    query,
    error: aggregationCallbackError,
  } = useSwapAggregator(currencies, parsedAmount, recipient);

  const handleSwapUsingAggregator = async () => {
    if (!swapCallbackUsingAggregator) {
      return;
    }
    setAttemptingTxn(true);

    swapCallbackUsingAggregator()
      .then((hash) => {
        setAttemptingTxn(false);
        onUserInput(Field.INPUT, "");
      })
      .catch((error) => {
        setAttemptingTxn(false);
        onUserInput(Field.INPUT, "");
      });
  };

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: noLiquidity
          ? parsedAmount
          : independentField === Field.INPUT
          ? parsedAmount
          : trade?.inputAmount,
        [Field.OUTPUT]: noLiquidity
          ? query?.outputAmount
          : independentField === Field.OUTPUT
          ? parsedAmount
          : trade?.outputAmount,
      };

  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput));

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const price = useMemo(() => {
    if (
      !parsedAmounts ||
      !parsedAmounts[Field.INPUT] ||
      !parsedAmounts[Field.OUTPUT] ||
      !currencies[Field.INPUT] ||
      !currencies[Field.OUTPUT] ||
      parsedAmounts[Field.INPUT].equalTo(0)
    )
      return undefined;
    return new Price(
      currencies[Field.INPUT],
      currencies[Field.OUTPUT],
      parsedAmounts[Field.INPUT].raw,
      parsedAmounts[Field.OUTPUT].raw
    );
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmounts[Field.INPUT]]);

  const onConfirm = () => {
    if (noLiquidity) {
      handleSwapUsingAggregator();
    } else {
      handleSwapUsingRouter();
    }
  };

  return (
    <>
      <WarningModal open={warningOpen} setOpen={setWarningOpen} type={"highpriceimpact"} onClick={onConfirm} />
      <ConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        type={txConfirmInfo.type}
        tx={txConfirmInfo.tx}
      />

      <div className="rounded-2xl border border-gray-600">
        <CurrencyInputPanel
          label={t("Sell")}
          value={formattedAmounts[Field.INPUT]}
          onUserInput={handleTypeInput}
          onMax={handleMaxInput}
          showMaxButton={!atMaxAmountInput}
          currency={currencies[Field.INPUT]}
          balance={currencyBalances[Field.INPUT]}
          currencies={currencies}
        />
      </div>

      <SwitchIconButton
        onSwitch={() => {
          onSwitchTokens();
          onUserInput(Field.INPUT, "");
        }}
      />

      <div className="mb-6 rounded-2xl border border-dashed border-gray-600">
        <CurrencyOutputPanel
          label={t("Buy")}
          value={formattedAmounts[Field.OUTPUT]}
          onUserInput={handleTypeOutput}
          currency={currencies[Field.OUTPUT]}
          balance={currencyBalances[Field.OUTPUT]}
          data={parsedAmounts[Field.INPUT] && !showWrap ? query : undefined}
          slippage={autoMode ? slippage : userSlippageTolerance}
          price={price}
          buyTax={buyTax}
          sellTax={sellTax}
          currencies={currencies}
          noLiquidity={noLiquidity}
        />
      </div>
      {account &&
        (Object.keys(contracts.aggregator).includes(chainId.toString()) ? (
          <>
            {inputError ? (
              <button className="btn-outline btn" disabled={true}>
                {t(inputError)}
              </button>
            ) : currencyBalances[Field.INPUT] === undefined ? (
              <button className="btn-outline btn" disabled={true}>
                {t("Loading")}
              </button>
            ) : showWrap ? (
              <PrimarySolidButton disabled={Boolean(wrapInputError)} onClick={onWrap}>
                {wrapInputError ??
                  (wrapType === WrapType.WRAP ? "Wrap" : wrapType === WrapType.UNWRAP ? "Unwrap" : null)}
              </PrimarySolidButton>
            ) : approval <= ApprovalState.PENDING ? (
              <>
                <PrimarySolidButton
                  onClick={() => {
                    handleApproveUsingRouter();
                  }}
                  pending={approval === ApprovalState.PENDING}
                  disabled={approval === ApprovalState.PENDING}
                >
                  {approval === ApprovalState.PENDING ? (
                    <span>{t("Approving %asset%", { asset: currencies[Field.INPUT]?.symbol })}</span>
                  ) : approval === ApprovalState.UNKNOWN ? (
                    <span>{t("Loading", { asset: currencies[Field.INPUT]?.symbol })}</span>
                  ) : (
                    t("Approve %asset%", { asset: currencies[Field.INPUT]?.symbol })
                  )}
                </PrimarySolidButton>
              </>
            ) : (
              <PrimarySolidButton
                onClick={() => {
                  if (priceImpactSeverity === 3) setWarningOpen(true);
                  else onConfirm();
                }}
                pending={attemptingTxn}
                disabled={
                  attemptingTxn ||
                  (!noLiquidity && (!!swapCallbackError || priceImpactSeverity > 3)) ||
                  (noLiquidity && !!aggregationCallbackError)
                }
              >
                {attemptingTxn
                  ? "Swapping..."
                  : !noLiquidity
                  ? !!swapCallbackError
                    ? swapCallbackError
                    : priceImpactSeverity > 3
                    ? "Price Impact Too High"
                    : "Swap"
                  : !!aggregationCallbackError
                  ? aggregationCallbackError
                  : "Swap"}
              </PrimarySolidButton>
            )}
          </>
        ) : (
          <Button disabled={!0}>{t("Coming Soon")}</Button>
        ))}

      <History />
    </>
  );
}
