import { Currency, Token } from "@brewlabs/sdk";
import React, { useMemo } from "react";
import { AppId } from "config/constants/types";
import useHttpLocations from "../../hooks/useHttpLocations";
import { WrappedTokenInfo } from "../../state/lists/hooks";
import getTokenLogoURL from "../../utils/getTokenLogoURL";
import Logo from "./Logo";

export default function CurrencyLogo({
  currency,
  size = "24px",
  style,
  appId,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
  appId?: AppId;
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined);

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return [getTokenLogoURL(currency.wrapped.address, currency.chainId)];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address, currency.chainId)];
      }
      return [getTokenLogoURL(currency.address, currency.chainId, appId, currency.symbol)];
    }

    return [];
  }, [currency, uriLocations, appId]);

  // if (currency === ETHER) {
  //   return <BinanceIcon width={size} style={style} />
  // }

  return (
    <Logo
      width={size}
      height={size}
      srcs={srcs}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
      className="rounded-full"
    />
  );
}
