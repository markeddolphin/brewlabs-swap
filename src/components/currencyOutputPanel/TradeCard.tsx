import React, { useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { ETH_ADDRESSES } from "config/constants";
import { useCurrency } from "hooks/Tokens";
import { tryParseAmount } from "state/swap/hooks";
import { useTranslation } from "contexts/localization";
import { formatDecimals } from "utils/formatBalance";

interface TradeCardProps {
  data: any;
  slippage: number;
  price: any;
  buyTax?: number;
  sellTax?: number;
}

const TradeCard: React.FC<TradeCardProps> = ({ data, slippage, price, buyTax, sellTax }) => {
  const { t } = useTranslation();

  const [priceInverted, setPriceInverted] = useState<boolean>(false);
  const [tradePanelToggled, setTradePanelToggled] = useState<boolean>(undefined);

  const currency = useCurrency(ETH_ADDRESSES.includes(data.toToken.address) ? "ETH" : data.toToken.address);
  const minAmount = BigNumber.from(data.toTokenAmount)
    .mul(10000 - slippage)
    .div(10000);
  const formattedMinAmount = formatUnits(minAmount, data.toToken.decimals);
  const minCurrencyAmount = tryParseAmount(formattedMinAmount, currency);
  const minimumReceived = Number(minCurrencyAmount?.toExact());
  const formattedMiniumReceived =
    minimumReceived > 1
      ? formatDecimals(Math.floor(minimumReceived).toString())
      : formatDecimals(minCurrencyAmount?.toSignificant());

  useEffect(() => {
    if (!price) setTradePanelToggled(undefined);
  }, [price]);

  const formattedPrice = formatDecimals(price?.toSignificant(6) ?? "0.0");
  const formattedInvertedPrice = formatDecimals(price?.invert()?.toSignificant(6) ?? "0.0");

  return (
    <>
      {price ? (
        <div className="rounded-xl border border-amber-300 px-2 py-1 select-none">
          <div className="mr-2 flex cursor-pointer justify-between">
            <div className="flex items-center gap-1" style={{ marginRight: "4px" }}>
              <ExclamationCircleIcon className="h-5 w-5 dark:text-primary" data-tooltip-target="tooltip-default" />
              {!tradePanelToggled}
              <p className="text-[13px]" onClick={() => setPriceInverted(!priceInverted)}>
                {priceInverted ? (
                  formattedPrice.includes("sub") ? (
                    <>
                      1 {price.baseCurrency.symbol} = 0.0
                      <span style={{ fontSize: "11px" }}>
                        <sub>{formattedPrice[3] === "0" ? formattedPrice[9] : formattedPrice.slice(8, 10)}</sub>
                      </span>
                      {formattedPrice.slice(16)} {price.quoteCurrency.symbol}
                    </>
                  ) : (
                    `1 ${price.baseCurrency.symbol} = ${formattedPrice} ${price.quoteCurrency.symbol}`
                  )
                ) : formattedInvertedPrice.includes("sub") ? (
                  <>
                    1 {price.quoteCurrency.symbol} = 0.0
                    <span style={{ fontSize: "11px" }}>
                      <sub>
                        {formattedInvertedPrice[3] === "0"
                          ? formattedInvertedPrice[9]
                          : formattedInvertedPrice.slice(8, 10)}
                      </sub>
                    </span>
                    {formattedInvertedPrice.slice(16)} {price.baseCurrency.symbol}
                  </>
                ) : (
                  `1 ${price.quoteCurrency.symbol} = ${formattedInvertedPrice} ${price.baseCurrency.symbol}`
                )}
              </p>
            </div>
            <div
              className="flex items-center gap-2 hover:opacity-70"
              onClick={() => setTradePanelToggled(!tradePanelToggled)}
            >
              <button className="hidden rounded rounded-2xl bg-primary px-3 text-xs text-black sm:block btn-protocol-shadow">
                {data.protocols[0][0][0].name.split("_")[0]}
              </button>
              <ChevronDownIcon className="h-4 w-4 dark:text-primary" />
            </div>
          </div>
          {tradePanelToggled ? (
            <div className="mt-1 flex justify-between">
              <div className="min-w-[190px]">
                <div className="ml-1">
                  <span className="flex justify-between">
                    <p className="text-[11px]">
                      <span className="text-primary">Buy</span>&nbsp;tax
                    </p>
                    <p className="text-[11px]">{buyTax ? `${buyTax}%` : "-"}</p>
                  </span>
                  <span className="flex justify-between">
                    <p className="text-[11px]">
                      <span className="text-primary">Sell</span>&nbsp;tax
                    </p>
                    <p className="text-[11px]">{sellTax ? `${sellTax}%` : "-"}</p>
                  </span>
                  <span className="flex justify-between">
                    <p className="text-[11px]">{t("Minimum Received")}</p>
                    <p className="text-[11px]">
                      {formattedMiniumReceived.includes("sub") ? (
                        <>
                          0.0
                          <span style={{ fontSize: "9px" }}>
                            <sub>
                              {formattedMiniumReceived[3] === "0"
                                ? formattedMiniumReceived[9]
                                : formattedMiniumReceived.slice(8, 10)}
                            </sub>
                          </span>
                          {formattedMiniumReceived.slice(16)}
                        </>
                      ) : (
                        formattedMiniumReceived
                      )}
                      &nbsp;
                      {data.toToken.symbol}
                    </p>
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default TradeCard;
