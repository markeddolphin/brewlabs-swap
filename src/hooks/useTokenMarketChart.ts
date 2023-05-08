import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { CG_API, CG_PRO_API } from "config/constants/endpoints";
import CG_ASSET_PLATFORMS from "config/constants/tokens/CGAssetPlatforms.json";
import { ChainId } from "@brewlabs/sdk";

export interface TokenMarketData {
  [address: string]: {
    usd: number;
    usd_24h_change: number | null;
  };
}

export const defaultMarketData = {
  usd: 0,
  usd_24h_change: null,
};

const useTokenMarketChart = (tokenAddresses: string[], chainId: ChainId): TokenMarketData => {
  const assetPlatformId = CG_ASSET_PLATFORMS.find((platform) => platform.chain_identifier === chainId)?.id;
  const [data, setData] = useState(
    Object.assign({}, ...tokenAddresses.map((address) => ({ [address]: defaultMarketData })))
  );

  useEffect(() => {
    if (!assetPlatformId || tokenAddresses.length === 0) return;
    axios
      .get(
        `${CG_API}/simple/token_price/${assetPlatformId}?contract_addresses=${tokenAddresses.join(
          ","
        )}&vs_currencies=usd&include_24hr_change=true`
      )
      .then((res) => {
        if (res.data) {
          setData(res.data);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetPlatformId, JSON.stringify(tokenAddresses)]);

  return data;
};

export default useTokenMarketChart;
