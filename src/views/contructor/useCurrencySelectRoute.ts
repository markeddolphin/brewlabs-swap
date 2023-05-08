import { useActiveChainId } from "hooks/useActiveChainId";
import { useRouter } from "next/router";
import { useCallback } from "react";
import currencyId from "utils/currencyId";
import { brewsToken, usdToken } from "config/constants/tokens";
import { Currency, WNATIVE } from "@brewlabs/sdk";

export const useCurrencySelectRoute = (type = "add", selectedChainId = undefined) => {
  const router = useRouter();
  const { chainId: activeChainId } = useActiveChainId();
  const chainId = selectedChainId ?? activeChainId;

  const [currencyIdA, currencyIdB] = router.query.currency || [
    WNATIVE[chainId].symbol,
    brewsToken[chainId]?.address ?? usdToken[chainId]?.address,
  ];

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyA_ ? currencyId(currencyA_) : "";
      if (newCurrencyIdA === currencyIdB) {
        router.replace(`/${type}/${chainId}/${currencyIdB}/${currencyIdA}`, undefined, { shallow: true });
      } else if (currencyIdB) {
        router.replace(`/${type}/${chainId}/${newCurrencyIdA}/${currencyIdB}`, undefined, { shallow: true });
      } else {
        router.replace(`/${type}/${chainId}/${newCurrencyIdA}`, undefined, { shallow: true });
      }
    },
    [currencyIdB, router, currencyIdA, chainId, type]
  );
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyB_ ? currencyId(currencyB_) : "";
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.replace(`/${type}/${chainId}/${currencyIdB}/${newCurrencyIdB}`, undefined, { shallow: true });
        } else {
          router.replace(`/${type}/${chainId}/${newCurrencyIdB}`, undefined, { shallow: true });
        }
      } else {
        router.replace(`/${type}/${chainId}/${currencyIdA || WNATIVE[chainId].symbol}/${newCurrencyIdB}`, undefined, {
          shallow: true,
        });
      }
    },
    [currencyIdA, router, currencyIdB, chainId]
  );

  return {
    handleCurrencyASelect,
    handleCurrencyBSelect,
  };
};
