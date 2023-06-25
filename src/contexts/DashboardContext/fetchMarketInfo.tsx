import axios from "axios";
import { LIVECOIN_APIS, TOKENLIST_URI } from "config/constants";
import { customTokensForDeploy } from "config/constants/tokens";

export async function fetchMarketInfo() {
  let i;
  for (i = 0; i < LIVECOIN_APIS.length; i++) {
    try {
      const response = await fetch(new Request("https://api.livecoinwatch.com/overview/history"), {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          "x-api-key": LIVECOIN_APIS[i],
        }),
        body: JSON.stringify({
          currency: "USD",
          start: Date.now() - 1000 * 3600 * 24,
          end: Date.now(),
        }),
      });
      let result = await response.json();
      let temp: any = [];
      for (let i = 0; i < result.length; i++) {
        temp.push(result[i].cap);
      }
      return temp;
    } catch (error) {
      console.log(error);
    }
  }
  if (i === LIVECOIN_APIS.length) {
    return [];
  }
}

export async function fetchTokenList(chainId: number) {
  try {
    if (!TOKENLIST_URI[chainId]) {
      return customTokensForDeploy[chainId] ?? [];
    }
    const result = await axios.get(TOKENLIST_URI[chainId]);
    return [...(customTokensForDeploy[chainId] ?? []), ...result.data.tokens];
  } catch (error) {
    console.log(error);
    return [];
  }
}
