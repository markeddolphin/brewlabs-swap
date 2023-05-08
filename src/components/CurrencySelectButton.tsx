import { Currency } from "@brewlabs/sdk";
import CurrencySelector from "./CurrencySelector";
import { CurrencyLogo } from "./logo";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { useGlobalState } from "state";
import { Field } from "state/swap/actions";
import { Field as LiquidityField } from "state/mint/actions";
import { useDerivedSwapInfo } from "state/swap/hooks";
import { useEffect, useState } from "react";

const CurrencySelectButton = ({
  inputCurrencySelect,
  onUserInput,
  type,
  onCurrencySelect,
  currencies,
}: {
  inputCurrencySelect: boolean;
  onUserInput?: any;
  type?: any;
  onCurrencySelect?: any;
  currencies: any;
}) => {
  const [inputValue, setInputValue] = useState(null);
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [sidebarContent, setSidebarContent] = useGlobalState("userSidebarContent");

  useEffect(() => {
    setInputValue(
      inputCurrencySelect
        ? type === "liquidity"
          ? currencies[LiquidityField.CURRENCY_A]
          : currencies[Field.INPUT]
        : type === "liquidity"
        ? currencies[LiquidityField.CURRENCY_B]
        : currencies[Field.OUTPUT]
    );
  }, [currencies, inputCurrencySelect]);

  return (
    <button
      onClick={() => {
        setIsOpen(isOpen === 1 ? 1 : 2);
        setSidebarContent(
          <CurrencySelector
            inputType={inputCurrencySelect ? "input" : "output"}
            selectedCurrency={inputValue}
            onUserInput={onUserInput}
            type={type}
            onCurrencySelect={onCurrencySelect}
          />
        );
      }}
      className="btn font-brand font-light"
    >
      {inputValue ? (
        <span className="flex items-center justify-between gap-2 pr-8 text-2xl xsm:pr-1">
          <CurrencyLogo currency={inputValue} size="24px" />
          {inputValue?.symbol}
        </span>
      ) : (
        <span>Select Token</span>
      )}
      <ChevronDownIcon className="ml-2 mb-1 hidden h-5 w-5 dark:text-primary xsm:block" />
    </button>
  );
};

export default CurrencySelectButton;
