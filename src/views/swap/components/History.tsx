import { useState } from "react";
import clsx from "clsx";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useSwapHistory } from "hooks/swap/useSwapHistory";
import { useCurrency } from "hooks/Tokens";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { ETH_ADDRESSES } from "config/constants";
import { getBlockExplorerLink, getBlockExplorerLogo } from "utils/functions";

import Card from "./Card";

const Row = (data: any) => {
  const {
    data: {
      _tokenIn: srcToken,
      _tokenOut: dstToken,
      _amountIn: spentAmount,
      _amountOut: returnAmount,
      transactionHash,
      source,
    },
  } = data;
  const inputCurrency = useCurrency(ETH_ADDRESSES.includes(srcToken) ? "ETH" : srcToken);
  const outputCurrency = useCurrency(ETH_ADDRESSES.includes(dstToken) ? "ETH" : dstToken);

  const amount =
    source === "aggregator" ? formatUnits(BigNumber.from(returnAmount), outputCurrency?.decimals) : returnAmount;
  const { chainId } = useActiveWeb3React();

  return (
    <div className="flex select-none items-center justify-between">
      <p className="flex">
        {inputCurrency?.symbol}&nbsp;<span className="dark:text-primary">SWAP</span>&nbsp;{outputCurrency?.symbol}
      </p>
      <p className="flex items-center justify-between gap-2">
        <span className="opacity-40">
          {Number(amount).toFixed(4)}&nbsp;{outputCurrency?.symbol}
        </span>
        <a href={getBlockExplorerLink(transactionHash, "transaction", chainId)} target="_blank" rel="noreferrer">
          <img src={getBlockExplorerLogo(chainId)} alt="" className="h-3 w-3" />
        </a>
      </p>
    </div>
  );
};

const History = () => {
  const logs = useSwapHistory();
  const { account, chainId } = useActiveWeb3React();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mx-auto flex w-fit items-center justify-between gap-2 px-1"
      >
        <span className="text-lg dark:text-gray-500">Show History</span>
        <ChevronUpIcon className={clsx("h-4 w-4 transition-all dark:text-gray-500", !isExpanded && "rotate-180")} />
      </button>
      {isExpanded && (
        <div className="mt-4 w-full rounded-xl border border-gray-700 p-3">
          <div className="mt-2">
            {logs.map((data, index) => {
              return <Row data={data} key={index} />;
            })}
          </div>
          <div className="flex items-center justify-center gap-2">
            <img src={getBlockExplorerLogo(chainId)} alt="Ether scan logo" className="h-4 w-4" />
            <a
              href={getBlockExplorerLink(account, "address", chainId)}
              target="_blank"
              rel="noreferrer"
              className="text-base"
            >
              Visit Wallet
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
