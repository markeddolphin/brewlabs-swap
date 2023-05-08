import { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { CurrencyAmount, Price, WNATIVE, Currency } from "@brewlabs/sdk";
import { useSigner } from "wagmi";
import { ethers, BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { MaxUint256 } from "@ethersproject/constants";
import { TransactionResponse } from "@ethersproject/providers";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useTranslation } from "contexts/localization";
import { AggregationRouterV5, slippageWithTVL, slippageDefault } from "config/constants";
import { usdToken } from "config/constants/tokens";
import contracts from "config/constants/contracts";
import AggregaionRouterV2Abi from "config/abi/swap/AggregationRouterV5.json";
import { useUserSlippageTolerance } from "state/user/hooks";
import { Field } from "state/swap/actions";
import {
  useSwapState,
  useSwapActionHandlers,
  useDerivedSwapInfo,
  tryParseAmount,
  useDefaultsFromURLSearch,
} from "state/swap/hooks";

import { calculateTotalGas } from "utils";
import { getBrewlabsAggregationRouterAddress, addressWithout0x } from "utils/addressHelpers";
import { quote, swap, ETHER_ADDRESS } from "utils/aggregator";
import { BIG_ONE } from "utils/bigNumber";
import { getTokenInfo } from "utils/getTokenInfo";
import { getBrewlabsAggregationRouterContract, getBep20Contract, getVerificationContract } from "utils/contractHelpers";
import maxAmountSpend from "utils/maxAmountSpend";

import CurrencyInputPanel from "components/currencyInputPanel";
import CurrencyOutputPanel from "components/currencyOutputPanel";
import { PrimarySolidButton } from "components/button/index";
import Button from "components/Button";
import SubNav from "./components/nav/SubNav";
import ChainSelect from "./components/ChainSelect";
import History from "./components/History";
import SwitchIconButton from "./components/SwitchIconButton";
import SettingModal from "./components/modal/SettingModal";
import Modal from "components/Modal";
import ConfirmationModal from "./components/modal/ConfirmationModal";
import ApproveStatusBar from "./components/ApproveStatusBar";
import { SwapContext } from "contexts/SwapContext";

type TxResponse = TransactionResponse | null;

export default function SwapPanel({ type = "swap", disableChainSelect = false }) {
  const { account, library, chainId } = useActiveWeb3React();
  const { data: signer } = useSigner();

  const { t } = useTranslation();

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [txConfirmInfo, setTxConfirmInfo] = useState({ type: "confirming", tx: "" });

  const {
    quoteData,
    outputAmount,
    slippageInput,
    autoMode,
    basePrice,
    quotePrice,
    onTyping,
    parsedAmount,
    buyTax,
    sellTax,
    slippage,
    verified,
    apporveStep,
    setQuoteData,
    setOutputAmount,
    setSlippageInput,
    setAutoMode,
    setBasePrice,
    setQuotePrice,
    setTyping,
    setParsedAmount,
    setBuyTax,
    setSellTax,
    setSlippage,
    setVerified,
    setApproveStep,
  }: any = useContext(SwapContext);
  // swap state
  const { typedValue } = useSwapState();
  const { currencies, currencyBalances, parsedAmount: inputAmount, inputError } = useDerivedSwapInfo();
  const [quoteError, setQuoteError] = useState<string | undefined>();
  const { onUserInput, onSwitchTokens, onCurrencySelection } = useSwapActionHandlers();

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const [userSlippageTolerance] = useUserSlippageTolerance();

  useEffect(() => {
    setTyping(true);
    const timer = setTimeout(() => {
      setTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [typedValue]);

  useEffect(() => {
    if (onTyping) return;
    const inputedValue = !typedValue || typedValue === "" || typedValue === "." ? "0" : typedValue;
    const _amount = parseUnits(inputedValue, currencies[Field.INPUT]?.decimals);
    setParsedAmount(_amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTyping, typedValue, currencies[Field.INPUT]]);

  // get the max amounts user can swap
  const maxAmounts = maxAmountSpend(currencyBalances[Field.INPUT]);
  const atMaxAmount = maxAmounts?.equalTo(inputAmount ?? "0");

  const aggregatorAddress = getBrewlabsAggregationRouterAddress(chainId);
  const [approval, approveCallback] = useApproveCallback(inputAmount, AggregationRouterV5[chainId]);

  const price = useMemo(() => {
    if (
      !inputAmount ||
      !outputAmount ||
      !currencies[Field.INPUT] ||
      !currencies[Field.OUTPUT] ||
      inputAmount.equalTo(0)
    )
      return undefined;
    return new Price(currencies[Field.INPUT], currencies[Field.OUTPUT], inputAmount.raw, outputAmount.raw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], inputAmount, outputAmount]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT] || !parsedAmount || parsedAmount?.isZero()) {
        setQuoteData({});
        setOutputAmount(undefined);
        return;
      }

      const data = await quote(chainId, currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmount);
      if (data) {
        if (!data.statusCode) {
          setQuoteError(undefined);
          setQuoteData(data);
          const formattedAmount = formatUnits(data.toTokenAmount, data.toToken.decimals);
          const _outputAmount = tryParseAmount(formattedAmount, currencies[Field.OUTPUT]);
          setOutputAmount(_outputAmount);
        } else {
          setQuoteError(data.description);
          setQuoteData({});
          const _outputAmount = tryParseAmount("0", currencies[Field.OUTPUT]);
          setOutputAmount(_outputAmount);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmount]);

  useEffect(() => {
    if (currencies[Field.INPUT]) {
      const oneEther = parseUnits(BIG_ONE.toString(), currencies[Field.INPUT].decimals);
      if (currencies[Field.INPUT].equals(usdToken[chainId])) {
        const usdPrice = new Price(
          currencies[Field.INPUT],
          usdToken[chainId],
          oneEther.toString(),
          oneEther.toString()
        );
        setBasePrice(usdPrice);
      } else {
        const fetchData = async () => {
          const data = await quote(chainId, currencies[Field.INPUT], usdToken[chainId], oneEther);
          if (!data.statusCode) {
            setQuoteError(undefined);
            const _price = new Price(
              currencies[Field.INPUT],
              usdToken[chainId],
              oneEther.toString(),
              data.toTokenAmount
            );
            setBasePrice(_price);
          } else {
            setQuoteError(data.description);
          }
        };
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT]]);

  useEffect(() => {
    if (currencies[Field.OUTPUT]) {
      const oneEther = parseUnits(BIG_ONE.toString(), currencies[Field.OUTPUT].decimals);
      if (currencies[Field.OUTPUT].equals(usdToken[chainId])) {
        const usdPrice = new Price(
          currencies[Field.OUTPUT],
          usdToken[chainId],
          oneEther.toString(),
          oneEther.toString()
        );
        setQuotePrice(usdPrice);
      } else {
        const fetchData = async () => {
          const data = await quote(chainId, currencies[Field.OUTPUT], usdToken[chainId], oneEther);
          if (!data.statusCode) {
            setQuoteError(undefined);
            const _price = new Price(
              currencies[Field.OUTPUT],
              usdToken[chainId],
              oneEther.toString(),
              data.toTokenAmount
            );
            setQuotePrice(_price);
          } else {
            setQuoteError(data.description);
          }
        };
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.OUTPUT]]);

  useEffect(() => {
    if (currencies[Field.INPUT] && currencies[Field.OUTPUT]) {
      const fetchData = async () => {
        try {
          const baseTokenInfo = await getTokenInfo(chainId, currencies[Field.INPUT]);
          const tokenInfo = await getTokenInfo(chainId, currencies[Field.OUTPUT]);

          setBuyTax(tokenInfo?.BuyTax ?? 0);
          setSellTax(tokenInfo?.SellTax ?? 0);
          const totalTax =
            (Math.max(baseTokenInfo.BuyTax, baseTokenInfo.SellTax) + Math.max(tokenInfo.BuyTax, tokenInfo.SellTax)) *
            100;
          if (totalTax && !isNaN(totalTax)) {
            setSlippage(Math.floor(totalTax + slippageWithTVL));
          }
        } catch (err) {
          console.error(err);
          setSlippage(slippageDefault);
        }
      };
      // fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT]]);

  useEffect(() => {
    if (currencies[Field.OUTPUT]) {
      const checkVerification = async () => {
        try {
          const verificationContract = getVerificationContract(chainId, library);
          const balance = await verificationContract.balanceOf(
            currencies[Field.OUTPUT].isNative ? WNATIVE[chainId].address : currencies[Field.OUTPUT].address
          );
          if (balance.toNumber()) {
            setVerified(true);
          } else {
            setVerified(false);
          }
        } catch (err) {
          console.error(err);
          setVerified(false);
        }
      };
      checkVerification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.OUTPUT]]);

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const handleApprove = async () => {
    setAttemptingTxn(true);
    let tx: any = { hash: "" };
    setOpenConfirmationModal(true);
    setTxConfirmInfo({
      type: "confirming",
      tx: tx.hash,
    });
    try {
      tx = await approveCallback();
      setApproveStep(1);
      setTxConfirmInfo({
        type: "confirming",
        tx: tx.hash,
      });
      await tx.wait();
      setTxConfirmInfo({
        type: "confirmed",
        tx: tx.hash,
      });
      setTimeout(() => {
        setOpenConfirmationModal(false);
      }, 5000);
      setApproveStep(2);
    } catch (err: any) {
      // if (err?.code === 4001) {
      //   toast.error(t("Transaction rejected."));
      // } else {
      //   toast.error(t("Please try again. Confirm the transaction and make sure you are paying enough gas!"));
      // }
      setTxConfirmInfo({
        type: "failed",
        tx: tx.hash,
      });
      setTimeout(() => {
        setOpenConfirmationModal(false);
      }, 5000);
    } finally {
      setAttemptingTxn(false);
    }
  };

  const handleSwap = async () => {
    setAttemptingTxn(true);
    try {
      if (!currencies[Field.INPUT].isNative) {
        const tokenContract = getBep20Contract(chainId, currencies[Field.INPUT].address, signer);
        const allowance = await tokenContract.allowance(account, aggregatorAddress);
        if (allowance.lt(parsedAmount)) {
          const tx = await tokenContract.approve(aggregatorAddress, MaxUint256);
          const receipt = await tx.wait();
          if (!receipt.status) console.error("Failed to approve token");
        }
      }

      const aggregatorContract = getBrewlabsAggregationRouterContract(chainId, signer);
      const treasuryFee = await aggregatorContract.treasuryFee();
      const strategyFeeNumerator = await aggregatorContract.strategyFeeNumerator();
      const strategyFeeDenominator = await aggregatorContract.strategyFeeDenominator();
      const strategyFee = parsedAmount.mul(strategyFeeNumerator).div(strategyFeeDenominator);

      const swapTransaction = await swap(
        chainId,
        currencies[Field.INPUT],
        currencies[Field.OUTPUT],
        parsedAmount.sub(strategyFee),
        account,
        autoMode ? slippage / 100 : userSlippageTolerance / 100
      );

      const txData = swapTransaction.tx;
      let estimatedGasLimit: BigNumber;
      let args: any[];
      let tx: TxResponse = null;
      const inter = new ethers.utils.Interface(AggregaionRouterV2Abi);
      const decodedInput = inter.parseTransaction({ data: txData.data, value: txData.value });
      const value = currencies[Field.INPUT].isNative ? parsedAmount.add(treasuryFee) : treasuryFee;
      if (decodedInput.name === "swap") {
        let callData = decodedInput.args.data.replace(
          addressWithout0x(AggregationRouterV5[chainId]),
          addressWithout0x(aggregatorAddress)
        );
        args = [decodedInput.args.executor, decodedInput.args.desc, decodedInput.args.permit, callData, parsedAmount];

        estimatedGasLimit = await aggregatorContract.estimateGas.swapAggregateCall(...args, { value });
        tx = await aggregatorContract.swapAggregateCall(...args, {
          value,
          gasLimit: calculateTotalGas(estimatedGasLimit),
        });
      } else if (decodedInput.name === "unoswap") {
        args = [
          decodedInput.args.srcToken,
          currencies[Field.OUTPUT].address ?? ETHER_ADDRESS,
          parsedAmount,
          0,
          decodedInput.args.pools,
        ];

        estimatedGasLimit = await aggregatorContract.estimateGas.unoswapAggregateCall(...args, { value });
        tx = await aggregatorContract.unoswapAggregateCall(...args, {
          value,
          gasLimit: calculateTotalGas(estimatedGasLimit),
        });
      } else {
        args = [
          currencies[Field.INPUT].address ?? ETHER_ADDRESS,
          currencies[Field.OUTPUT].address ?? ETHER_ADDRESS,
          account,
          parsedAmount,
          0,
          decodedInput.args.pools,
        ];

        estimatedGasLimit = await aggregatorContract.estimateGas.uniswapV3SwapAggregateCall(...args, { value });
        tx = await aggregatorContract.uniswapV3SwapAggregateCall(...args, {
          value,
          gasLimit: calculateTotalGas(estimatedGasLimit),
        });
      }
      setTxConfirmInfo({
        type: "confirming",
        tx: tx.hash,
      });
      const receipt = await tx.wait();
      if (receipt?.status) {
        setTxConfirmInfo({
          type: "confirmed",
          tx: tx.hash,
        });
      }
    } catch (err: any) {
      if (err?.code === "ACTION_REJECTED") {
        toast.error(t("Transaction rejected."));
      } else {
        toast.error(t("Please try again. Confirm the transaction and make sure you are paying enough gas!"));
      }
    } finally {
      setAttemptingTxn(false);
      onUserInput(Field.INPUT, "");
    }
  };

  const handleInputCurrencySelect = (currency: Currency) => {
    onCurrencySelection(Field.INPUT, currency);
  }

  const handleOutputCurrencySelect = (currency: Currency) => {
    onCurrencySelection(Field.OUTPUT, currency);
  }

  return (
    <>
      <ConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        type={txConfirmInfo.type}
        tx={txConfirmInfo.tx}
      />

      <div className="rounded-2xl border border-gray-600">
        <CurrencyInputPanel
          label={t("Sell")}
          value={typedValue}
          onUserInput={handleTypeInput}
          onMax={() => onUserInput(Field.INPUT, maxAmounts?.toExact())}
          showMaxButton={!atMaxAmount}
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
          value={outputAmount?.toSignificant(6) ?? "0.0"}
          onUserInput={() => null}
          currency={currencies[Field.OUTPUT]}
          balance={currencyBalances[Field.OUTPUT]}
          data={quoteData}
          slippage={autoMode ? slippage : userSlippageTolerance}
          price={price}
          buyTax={buyTax}
          sellTax={sellTax}
          currencies={currencies}
          disableInput={false}
        />
      </div>
      {account &&
        (Object.keys(contracts.aggregator).includes(chainId.toString()) ? (
          <>
            {quoteError ? (
              <button className="btn-outline btn" disabled={true}>
                {t(quoteError)}
              </button>
            ) : inputError ? (
              <button className="btn-outline btn" disabled={true}>
                {t(inputError)}
              </button>
            ) : currencyBalances[Field.INPUT] === undefined ? (
              <button className="btn-outline btn" disabled={true}>
                {t("Loading")}
              </button>
            ) : approval <= ApprovalState.PENDING ? (
              <>
                <ApproveStatusBar step={apporveStep} url={currencies[Field.INPUT]} />
                <PrimarySolidButton
                  onClick={() => {
                    handleApprove();
                  }}
                >
                  {approval === ApprovalState.PENDING ? (
                    <span>{t("Approve %asset%", { asset: currencies[Field.INPUT]?.symbol })}</span>
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
                  handleSwap();
                }}
                disabled={attemptingTxn || !outputAmount}
              >
                {t("Swap")}
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
