import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import tokens from "config/constants/tokens/1";
import Link from "next/link";
import { useState } from "react";
import { getChainLogo, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

const headers = ["Network", "Pair", "Last Price", "24h Change", "24h High", "24h Low", "24h Volume", ""];
export default function PairList() {
  const pairs = [
    {
      chainId: 1,
      token0: tokens.wbtc,
      token1: tokens.usdc,
      lastPrice: 30025.07,
      change: 5.7,
      high: 30450.04,
      low: 28180.07,
      volume: 4428.136,
    },
    {
      chainId: 1,
      token0: tokens.wbtc,
      token1: tokens.usdc,
      lastPrice: 30025.07,
      change: 5.7,
      high: 30450.04,
      low: 28180.07,
      volume: 4428.136,
    },
    {
      chainId: 1,
      token0: tokens.wbtc,
      token1: tokens.usdc,
      lastPrice: 30025.07,
      change: 5.7,
      high: 30450.04,
      low: 28180.07,
      volume: 4428.136,
    },
  ];
  const width = ["w-[55px]", "w-[140px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[30px]"];
  return (
    <div className="primary-shadow rounded-md bg-[#18181B] p-[10px_16px_24px_16px]">
      <div className="font-roboto text-xl font-bold text-white">TRADING PAIRS</div>
      <div className="mt-2 hidden justify-between px-4 font-brand text-sm text-[#ffffff75] md:flex">
        {headers.map((data, i) => {
          return (
            <div key={i} className={`${width[i]} text-center`}>
              {data}
            </div>
          );
        })}
      </div>
      <div className="hidden flex-col md:flex">
        {pairs.map((data, i) => {
          return (
            <div
              key={i}
              className="mt-2 flex h-[54px] cursor-pointer items-center justify-between rounded-md border border-transparent bg-[#29292C] px-4 font-brand text-white transition hover:border-brand"
            >
              <div className={`${width[0]} flex justify-center`}>
                <img src={getChainLogo(data.chainId)} alt={""} />
              </div>
              <div className={`flex items-center ${width[1]} justify-center`}>
                <img
                  src={getTokenLogoURL(data.token0.address, data.token0.chainId)}
                  alt={""}
                  className="mr-1.5 h-6 w-6 rounded-full"
                />
                <div>
                  {data.token0.symbol}/{data.token1.symbol}
                </div>
              </div>
              <div className={`${data.change >= 0 ? "text-green" : "text-danger"} ${width[2]} flex justify-center`}>
                ${numberWithCommas(data.lastPrice.toFixed(2))}
              </div>
              <div className={`${data.change >= 0 ? "text-green" : "text-danger"} ${width[3]} flex justify-center`}>
                {data.change.toFixed(1)}%
              </div>
              <div className={`${width[4]} flex justify-center`}>${numberWithCommas(data.high.toFixed(2))}</div>
              <div className={`${width[5]} flex justify-center`}>${numberWithCommas(data.low.toFixed(2))}</div>
              <div className={`${width[6]} flex justify-center`}>{numberWithCommas(data.volume.toFixed(2))}</div>
              <Link className={`${width[7]} flex justify-center`} href={"/constructor"}>
                <ArrowDownOnSquareIcon className="h-5" />
              </Link>
            </div>
          );
        })}
      </div>
      <div className="block w-full md:hidden">
        {pairs.map((data, i) => {
          return (
            <div
              key={i}
              className="mt-2.5 w-full cursor-pointer rounded-md border border-transparent bg-[#29292C] p-4 text-sm hover:border-primary"
            >
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={getTokenLogoURL(data.token0.address, data.token0.chainId)}
                    alt={""}
                    className="mr-1.5 h-7 w-7 rounded-full"
                  />
                  <div className="text-lg text-white">
                    {data.token0.symbol}/{data.token1.symbol}
                  </div>
                </div>
                <img src={getChainLogo(data.chainId)} alt={""} className="h-8 w-8 rounded-full" />
              </div>
              <div className="flex flex-wrap justify-between">
                <div className={`${data.change >= 0 ? "text-green" : "text-danger"} mr-4 mt-2`}>
                  Last Price: ${numberWithCommas(data.lastPrice.toFixed(2))}
                </div>
                <div className={`${data.change >= 0 ? "text-green" : "text-danger"} mt-2`}>
                  24H Change: {data.change.toFixed(1)}%
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="mr-4 mt-2">24H High: ${numberWithCommas(data.high.toFixed(2))}</div>
                <div className="mt-2">24H Low: ${numberWithCommas(data.low.toFixed(2))}</div>
              </div>
              <div className="mt-2">24H Volume: {numberWithCommas(data.volume.toFixed(2))}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
