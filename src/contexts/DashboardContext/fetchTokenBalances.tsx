import axios from "axios";
import { getMulticallContract } from "utils/contractHelpers";
import { ChainId, WNATIVE } from "@brewlabs/sdk";
import { UNMARSHAL_API_KEYS, UNMARSHAL_CHAIN_NAME } from "config";
import { DEX_GURU_WETH_ADDR } from "config/constants";

async function getNativeBalance(address: string, chainId: number) {
  let ethBalance = 0;
  const multicallContract = getMulticallContract(chainId);
  ethBalance = await multicallContract.getEthBalance(address);
  return ethBalance;
}

export async function fetchTokenBalances(address: string, chainId: number) {
  let data: any = [];
  if (chainId === 56) {
    data = await axios.post("https://pein-api.vercel.app/api/tokenController/getTokenBalances", { address, chainId });
    data = data.data;
  } else if (chainId === 137 || chainId === 1) {
    let offset = 0;
    let tokens = [];
    let apiKeyIndex = 0;
    do {
      const query = new URLSearchParams({
        pageSize: "100",
        auth_key: "K82WDxM7Ej3y9u8VSmLYa8pdeqTVqziA2VGQaSRq",
        offset: offset.toString(),
      }).toString();

      const resp = await fetch(
        `https://api.unmarshal.com/v2/${UNMARSHAL_CHAIN_NAME[chainId]}/address/${address}/assets?${query}`,
        {
          method: "GET",
        }
      );
      if (resp.status === 429) {
        apiKeyIndex++;
        if (apiKeyIndex === UNMARSHAL_API_KEYS.length) break;
        continue;
      }
      const data = await resp.json();
      offset = data.next_offset;
      if (!data.assets) break;
      tokens = [...tokens, ...data.assets];
      if (!offset) break;
    } while (1);
    data = tokens.map((token) => {
      return {
        address:
          token.contract_address === "0x0000000000000000000000000000000000001010"
            ? DEX_GURU_WETH_ADDR
            : token.contract_address,
        balance: token.balance / Math.pow(10, token.contract_decimals),
        decimals: token.contract_decimals,
        name: token.contract_name,
        symbol: token.contract_ticker_symbol,
      };
    });
  }
  if (chainId === ChainId.BSC_MAINNET) {
    const ethBalance = await getNativeBalance(address, chainId);
    data.push({
      address: DEX_GURU_WETH_ADDR,
      balance: ethBalance / Math.pow(10, 18),
      decimals: 18,
      name: "Binance",
      symbol: "BNB",
    });
  }
  if (!data.length) {
    data.push({
      address: DEX_GURU_WETH_ADDR,
      balance: 0,
      decimals: 18,
      name: WNATIVE[chainId].name,
      symbol: WNATIVE[chainId].symbol,
    });
  }
  return data;
}
