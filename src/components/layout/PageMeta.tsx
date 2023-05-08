import Head from "next/head";
import { useRouter } from "next/router";
import { ChainId } from "@brewlabs/sdk";
import { DEFAULT_META, getCustomMeta } from "config/constants/meta";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useBrewsCoingeckoPrice, useBrewsUsdPrice } from "hooks/useUsdPrice";

export const PageMeta: React.FC = () => {
  const { pathname } = useRouter();
  const { chainId } = useActiveChainId();
  const brewsPriceCoingecko = useBrewsCoingeckoPrice();
  const brewsPriceUsd = useBrewsUsdPrice();

  let brewsPriceUsdDisplay = brewsPriceUsd ? `$${brewsPriceUsd.toFixed(4)}` : "...";
  if (chainId !== ChainId.BSC_MAINNET || !brewsPriceUsd) {
    brewsPriceUsdDisplay = brewsPriceCoingecko ? `$${brewsPriceCoingecko.toFixed(4)}` : "...";
  }

  const pageMeta = getCustomMeta(pathname) || {};
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta };
  let pageTitle = brewsPriceUsdDisplay ? [title, brewsPriceUsdDisplay].join(" | ") : title;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  );
};

export default PageMeta;
