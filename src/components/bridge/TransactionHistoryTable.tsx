import { SerializedToken } from "config/constants/types";
import { ChainId } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { getExplorerLink } from "lib/bridge/helpers";
import { truncateHash } from "utils";
import { CHAIN_ICONS } from "config/constants/networks";
import { useUserHistory } from "hooks/bridge/useUserHistory";
import CrossChainIcons from "../CrossChainIcons";
import Button from "components/Button";

type TransactionCardProps = {
  chainId: ChainId;
  fromToken: SerializedToken;
  toToken: SerializedToken;
  timestamp: string;
  amount: string;
  sendingTx: string;
  receivingTx?: string;
  status: boolean;
  user: string;
  message: {
    txHash: string;
    messageId: string;
  };
};

const dateToString = (timestamp: string) => {
  return new Date(parseInt(timestamp, 10) * 1000).toLocaleTimeString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PAGE_SIZE = 10;
const History = () => {
  const { allTransfers, curPage, loadMoreTransfers } = useUserHistory();

  if (!allTransfers.length) {
    return null;
  }

  return (
    <section className="mb-32 pb-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="font-brand text-3xl text-slate-600 dark:text-slate-400">Transaction history</h2>
          <p className="mt-2 text-sm text-gray-700">
            View all the transactions that has taken place on the Brewlabs Bridge.
          </p>
        </div>
      </div>

      <div className="mt-4 block font-brand dark:text-gray-500 md:hidden">
        {allTransfers.slice(0, PAGE_SIZE * curPage).map((entry: TransactionCardProps) => (
          <div key={entry.timestamp} className="ml-8 border-l border-brand py-6 xs:ml-16">
            <div className="-ml-4 flex items-end gap-x-2">
              <CrossChainIcons
                slim
                chainOne={CHAIN_ICONS[entry.fromToken.chainId]}
                chainTwo={CHAIN_ICONS[entry.toToken.chainId]}
              />
              <h6 className="font-brand text-xl font-bold">{dateToString(entry.timestamp)}</h6>
            </div>

            <div className="grid grid-flow-row">
              <ul className="mt-4 pl-6">
                <li>
                  <span className="font-bold">User: </span>
                  {truncateHash(entry.user ?? "")}
                </li>
                <li className="mb-4">
                  <span className="font-bold">Amount: </span>
                  {ethers.utils.formatUnits(entry.amount, entry.fromToken.decimals).toString()}{" "}
                </li>
              </ul>
              <ul className="mt-4 pl-6">
                <li>
                  <span className="font-bold">Sending Tx: </span>
                  <a
                    href={getExplorerLink(entry.fromToken.chainId, "transaction", entry.sendingTx)}
                    className="text-gray-500 dark:text-gray-500"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {truncateHash(entry.sendingTx)}
                  </a>
                </li>

                <li>
                  <span className="font-bold">Receiving Tx: </span>
                  <a
                    href={getExplorerLink(entry.toToken.chainId, "transaction", entry.receivingTx ?? "")}
                    className="dark:text-gray-500"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {truncateHash(entry.receivingTx ?? "")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 hidden flex-col dark:text-gray-500 md:flex">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-brand">
                <thead className="bg-gray-50 text-sm font-semibold dark:bg-zinc-900 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-6">
                      Direction
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left">
                      User
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900 dark:bg-opacity-80">
                  {allTransfers.slice(0, PAGE_SIZE * curPage).map((entry: TransactionCardProps) => (
                    <tr key={entry.timestamp}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                        <CrossChainIcons
                          slim
                          chainOne={CHAIN_ICONS[entry.fromToken.chainId]}
                          chainTwo={CHAIN_ICONS[entry.toToken.chainId]}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {ethers.utils.formatUnits(entry.amount, entry.fromToken.decimals).toString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{truncateHash(entry.user ?? "")}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{dateToString(entry.timestamp)}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm sm:pr-6">
                        <ul>
                          <li>
                            Sending Tx:{" "}
                            <a
                              href={getExplorerLink(entry.fromToken.chainId, "transaction", entry.sendingTx)}
                              className="underline dark:text-gray-500"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {truncateHash(entry.sendingTx)}
                            </a>
                          </li>

                          <li>
                            Receiving Tx:{" "}
                            <a
                              href={getExplorerLink(entry.toToken.chainId, "transaction", entry.receivingTx ?? "")}
                              className="underline dark:text-gray-500"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {truncateHash(entry.receivingTx ?? "")}
                            </a>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        {allTransfers.length > PAGE_SIZE * curPage && (
          <Button onClick={loadMoreTransfers}>Load more transactions</Button>
        )}
      </div>
    </section>
  );
};

export default History;
