import { ChainId, WNATIVE } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { CHAIN_ICONS, EXPLORER_LOGO, EXPLORER_NAMES, EXPLORER_URLS } from "config/constants/networks";
import { getNativeSybmol } from "lib/bridge/helpers";
import { DEX_LOGOS } from "config/constants/swap";

export function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const BigNumberFormat = (str: any, decimals: number = 2) => {
  const length = Math.floor(Math.log10(str));
  if (Number(str) >= 1000000000000000)
    return `${numberWithCommas((str / Math.pow(10, length)).toFixed(decimals))}e+${length - 12}T`;
  else if (Number(str) >= 1000000000000) return `${numberWithCommas((str / 1000000000000).toFixed(decimals))}T`;
  else if (Number(str) >= 1000000000) return `${numberWithCommas((str / 1000000000).toFixed(decimals))}B`;
  else if (Number(str) >= 1000000) return `${numberWithCommas((str / 1000000).toFixed(decimals))}M`;
  else if (Number(str) >= 1000) return `${numberWithCommas((str / 1000).toFixed(decimals))}K`;
  else return `${numberWithCommas(str.toFixed(decimals))}`;
};

export function getBlockExplorerLink(
  data: string | number,
  type: "transaction" | "token" | "address" | "block" | "countdown",
  chainId: ChainId = ChainId.ETHEREUM
): string {
  switch (type) {
    case "transaction": {
      return `${EXPLORER_URLS[chainId]}/tx/${data}`;
    }
    case "token": {
      return `${EXPLORER_URLS[chainId]}/token/${data}`;
    }
    case "block": {
      return `${EXPLORER_URLS[chainId]}/block/${data}`;
    }
    case "countdown": {
      return `${EXPLORER_URLS[chainId]}/block/countdown/${data}`;
    }
    default: {
      return `${EXPLORER_URLS[chainId]}/address/${data}`;
    }
  }
}

export const getBlockExplorerLogo = (chainId: ChainId = ChainId.ETHEREUM) => {
  return `/images/explorer/${EXPLORER_NAMES[chainId].toLowerCase()}.png`;
};

export const makeBigNumber = (amount, decimals) => {
  let decimalCount = amount.split(".")[1]?.length;
  decimalCount = decimalCount ? decimalCount : 0;
  const subDecimals = decimalCount - decimals;
  let _amount = amount;
  if (subDecimals > 0) _amount = _amount.slice(0, amount.length - subDecimals);
  return ethers.utils.parseUnits(_amount, decimals);
};

export const formatDollar = (value, decimals = 2) => {
  if (value < 0) return "-$" + (-value).toFixed(decimals);
  return "$" + value.toFixed(decimals);
};

export const sumOfArray = (arr) => {
  let total = 0;
  for (let i = 0; i < arr.length; i++) total += arr[i];
  return total;
};

export const priceFormat = (str) => {
  const strlist = Number(str).toFixed(14).split(".");
  let c = 0;
  let value = "";
  if (strlist.length > 1) {
    while (strlist[1][c++] === "0");
    const temp = strlist[1].slice(0, c + 4);
    value = strlist[1].substring(temp.length - 5, temp.length - 1);
  }
  return { count: c - 1, value };
};

export const getChainLogo = (chainId) => CHAIN_ICONS[chainId] ?? "/images/networks/unkown.png";
export const getExplorerLogo = (chainId) => EXPLORER_LOGO[chainId] ?? "/images/networks/unkown.png";
export const getDexLogo = (exchange) => DEX_LOGOS[exchange];

export const getIndexName = (tokens) => {
  // if (tokens.length === 2)
  return tokens
    .map((t) => t.symbol.replace(WNATIVE[t.chainId].symbol, getNativeSybmol(t.chainId)).toUpperCase())
    .join("-");
  // return tokens
  // .map((t, index) => (index > 0 ? t.symbol.substring(0, 1) : t.symbol.replace("WBNB", "BNB").replace("WETH", "ETH")))
  // .join("-");
};

export const formatIPFSString = (url) => {
  let _url = url;
  if (url.includes("ipfs://")) _url = "https://maverickbl.mypinata.cloud/ipfs/" + _url.replace("ipfs://", "");
  else if (url.includes("https://ipfs.io/ipfs/"))
    _url = "https://maverickbl.mypinata.cloud/ipfs/" + _url.replace("https://ipfs.io/ipfs/", "");
  else if (url.includes("ipfs://ipfs/"))
    _url = "https://maverickbl.mypinata.cloud/ipfs/" + _url.replace("ipfs://ipfs/", "");
  return _url;
};

export const getRarityColor = (rarity) => {
  switch (rarity) {
    case "common":
      return "text-white";
    case "rare":
      return "text-[#1A82FF]";
  }
};
