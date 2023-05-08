import { Currency, CurrencyAmount } from "@brewlabs/sdk";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import BigNumber from "bignumber.js";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useTokenMarketChart, { defaultMarketData } from "hooks/useTokenMarketChart";
import { getBlockExplorerLink, getBlockExplorerLogo } from "utils/functions";

import CurrencySelectButton from "components/CurrencySelectButton";
import NumericalInput from "./NumericalInput";
import TradeCard from "./TradeCard";

interface CurrencyOutputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onCurrencySelect?: (currency: Currency) => void;
  label?: string;
  currency?: Currency | null;
  balance: CurrencyAmount | undefined;
  data?: any;
  slippage?: number;
  price?: any;
  buyTax?: number;
  sellTax?: number;
  currencies: any;
  disableInput: boolean;
}

const CurrencyOutputPanel = ({
  value,
  onUserInput,
  onCurrencySelect,
  label,
  currency,
  balance,
  data,
  slippage,
  price,
  buyTax,
  sellTax,
  currencies,
  disableInput,
}: CurrencyOutputPanelProps) => {
  const { chainId } = useActiveWeb3React();
  const tokenAddress = currency?.wrapped?.address?.toLowerCase();
  const tokenMarketData = useTokenMarketChart([tokenAddress], chainId);
  const { usd: tokenPrice, usd_24h_change: priceChange24h } = tokenMarketData[tokenAddress] || defaultMarketData;

  return (
    <>
      <div className="px-4 py-2 sm:ml-2 lg:ml-6">
        <div>{label}</div>
        <div className="mt-1 overflow-hidden">
          <div className="flex justify-between">
            <NumericalInput
              value={value}
              onUserInput={(val) => {
                onUserInput(val);
              }}
              decimals={currency?.decimals}
              disable={disableInput}
            />
            <CurrencySelectButton inputCurrencySelect={false} currencies={currencies} />
          </div>
          <div className="flex justify-between">
            <div className="ml-1 text-sm opacity-40">
              {value && tokenPrice ? new BigNumber(value).times(tokenPrice).toFixed(2) : "0.00"} USD
            </div>
            {currency && (
              <div className="ml-1">
                <div className="flex items-center justify-end">
                  <div className="mr-2 text-sm opacity-40">Balance: {balance ? balance.toSignificant(6) : "0.00"}</div>
                  <a
                    href={getBlockExplorerLink(currency?.wrapped?.address, "token", chainId)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={getBlockExplorerLogo(chainId)} alt="" className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        {priceChange24h && (
          <div className="ml-1 flex items-center gap-1 text-sm opacity-40">
            {priceChange24h > 0 ? (
              <>
                {priceChange24h.toFixed(3)}% <ArrowTrendingUpIcon className="h-3 w-3 dark:text-primary" />
              </>
            ) : (
              <>
                {Math.abs(priceChange24h).toFixed(3)}% <ArrowTrendingDownIcon className="h-3 w-3 dark:text-danger" />
              </>
            )}
            24HR
          </div>
        )}
      </div>
      {data && Object.keys(data).length ? (
        <div className="mx-6 mt-3 mb-2">
          <TradeCard
            data={data}
            slippage={slippage}
            price={price}
            buyTax={buyTax}
            sellTax={sellTax}
          />
        </div>
      ) : null}
    </>
  );
};

export default CurrencyOutputPanel;
