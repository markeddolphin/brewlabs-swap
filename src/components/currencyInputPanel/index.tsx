import { Currency, CurrencyAmount } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useTokenPrice from "hooks/useTokenPrice";
import { getBlockExplorerLink, getBlockExplorerLogo } from "utils/functions";

import CurrencySelectButton from "components/CurrencySelectButton";
import NumericalInput from "./NumericalInput";

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  currency: Currency | null;
  balance: CurrencyAmount | undefined;
  type?: string;
  onCurrencySelect?: any;
  inputCurrencySelect?: boolean;
  currencies?: any;
}

const CurrencyInputPanel = ({
  value,
  onUserInput,
  onMax,
  label,
  currency,
  balance,
  type = "swap",
  onCurrencySelect,
  inputCurrencySelect = true,
  currencies,
}: CurrencyInputPanelProps) => {
  const { chainId } = useActiveWeb3React();
  let tokenPrice, wrappedPrice;
  wrappedPrice = useTokenPrice(currency?.chainId, currency?.wrapped?.address);
  tokenPrice = wrappedPrice;

  return (
    <div className="px-4 py-2 sm:ml-2 lg:ml-6">
      <span>{label}</span>
      <div className="mt-1 overflow-hidden">
        <div className="flex justify-between">
          <NumericalInput
            value={value}
            onUserInput={(val) => {
              onUserInput(val);
            }}
            decimals={currency?.decimals}
          />
          <CurrencySelectButton
            inputCurrencySelect={inputCurrencySelect}
            onUserInput={onUserInput}
            type={type}
            onCurrencySelect={onCurrencySelect}
            currencies={currencies}
          />
        </div>
        <div className="flex justify-between">
          <div className="ml-1 text-sm opacity-40">
            {value && tokenPrice ? new BigNumber(value).times(tokenPrice).toFixed(2) : "0.00"} USD
          </div>
          {currency && (
            <div className="ml-1">
              <div className="flex items-center justify-end">
                <div className="mr-2 cursor-pointer text-sm opacity-40 hover:opacity-80" onClick={onMax}>
                  Balance: {currency ? balance?.toSignificant(6) : "0.00"}
                </div>
                <a
                  href={getBlockExplorerLink(currency?.wrapped?.address, "token", chainId)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={getBlockExplorerLogo(chainId)} alt="Ether scan logo" className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyInputPanel;
