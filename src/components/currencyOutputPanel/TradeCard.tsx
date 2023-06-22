import React, { useEffect, useState, useMemo } from "react";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "contexts/localization";
import { formatDecimals } from "utils/formatBalance";
import { Adapters } from "config/constants/aggregator";
import useActiveWeb3React from "@hooks/useActiveWeb3React";
interface TradeCardProps {
  data: any;
  slippage: number;
  price: any;
  buyTax?: number;
  sellTax?: number;
  noLiquidity?: boolean;
}

const TradeCard: React.FC<TradeCardProps> = ({ data, slippage, price, buyTax, sellTax, noLiquidity }) => {
  const { chainId } = useActiveWeb3React();
  const { t } = useTranslation();

  const [priceInverted, setPriceInverted] = useState<boolean>(false);
  const [tradePanelToggled, setTradePanelToggled] = useState<boolean>(undefined);

  useEffect(() => {
    if (!price) setTradePanelToggled(undefined);
  }, [price]);

  const formattedPrice = formatDecimals(price?.toSignificant(6) ?? "0.0");
  const formattedInvertedPrice = formatDecimals(price?.invert()?.toSignificant(6) ?? "0.0");

  const adapters = useMemo(() => {
    if (!data) return [];
    const usedAdapters = Adapters[chainId].filter((x) => data.adapters.includes(x.address));
    return usedAdapters.filter((x, i) => usedAdapters.findIndex((y) => y.name == x.name) == i);
  }, [data, chainId]);

  return (
    <>
      {price ? (
        <div className="select-none rounded-xl border border-amber-300 px-2 py-1">
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
            <div className="flex items-center" onClick={() => setTradePanelToggled(!tradePanelToggled)}>
              {noLiquidity ? (
                <>
                {adapters.length > 1 && (
                  <button className="btn-protocol-shadow mr-2 hidden rounded rounded-2xl bg-primary px-3 text-xs text-black sm:block">
                    MULTI
                  </button>
                )}
                {adapters.map((adapter, index) => (
                  <img
                    className={`${index > 0 ? "-ml-2" : ""} h-6 w-6 rounded-full`}
                    src={adapter.logo}
                    alt={adapter.name}
                    key={index}
                  />
                ))}
                </>
              ) : (
                <img
                  className={`h-6 w-6 rounded-full`}
                  src={"/images/brewlabs.png"}
                  alt={"brewlabs"}
              />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TradeCard;
