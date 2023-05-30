import React, { KeyboardEvent, useCallback, useState, useMemo, useContext } from "react";
import { Currency, NATIVE_CURRENCIES, Token } from "@brewlabs/sdk";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import BigNumber from "bignumber.js";
import clsx from "clsx";

import { MORALIS_CHAIN_NAME } from "config/constants/networks";
import { factoryTokens, popularTokens } from "config/constants/tokens";
import { DashboardContext } from "contexts/DashboardContext";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useDebounce from "hooks/useDebounce";
import { useAllTokens, useToken, useFoundOnInactiveList } from "hooks/Tokens";
import useTokenComparator from "hooks/useTokenComparator";
import useTokenMarketChart, { defaultMarketData } from "hooks/useTokenMarketChart";
import useWalletTokens from "hooks/useWalletTokens";
import { useGlobalState } from "state";
import { Field } from "state/swap/actions";
import { Field as LiquidityField } from "state/mint/actions";
import { useSwapActionHandlers } from "state/swap/hooks";
import { useCurrencyBalance, useNativeBalances } from "state/wallet/hooks";
import { isAddress } from "utils";

import { CurrencyLogo } from "components/logo";
import { PrimaryOutlinedButton } from "components/button/index";
import { filterTokens, useSortedTokensByQuery } from "components/searchModal/filtering";
import UserDashboard from "components/dashboard/UserDashboard";

import NavButton from "./dashboard/NavButton";

interface CurrencySelectorProps {
  inputType: "input" | "output";
  selectedCurrency?: Currency | null;
  otherSelectedCurrency?: Currency | null;
  filteredCurrencies?: Token[];
  onUserInput: any;
  type: string;
  onCurrencySelect: any;
}

const tabs = [
  {
    name: "All",
  },
  {
    name: "Popular",
  },
  {
    name: "Wallet",
  },
  {
    name: "Brewlabs factory",
  },
];

const CurrencyRow = ({
  currency,
  marketData,
  inputType,
  onUserInput,
  type,
  onCurrencySelect,
}: {
  currency: Currency;
  marketData: any;
  inputType: "input" | "output";
  onUserInput: any;
  type: string;
  onCurrencySelect: any;
}) => {
  const { account } = useActiveWeb3React();

  const { usd_24h_change: priceChange24h, usd: tokenPrice } = marketData;
  const balance = useCurrencyBalance(account, currency);
  const { onCurrencySelection } = useSwapActionHandlers();
  const [, setSidebarContent] = useGlobalState("userSidebarContent");
  const [userSidebarOpen, setUserSidebarOpen] = useGlobalState("userSidebarOpen");

  return (
    <button
      className="flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent px-4 py-4 hover:bg-gradient-to-r"
      onClick={() => {
        if (type === "liquidity") {
          const input =
            inputType === "input"
              ? type === "liquidity"
                ? LiquidityField.CURRENCY_A
                : Field.INPUT
              : type === "liquidity"
              ? LiquidityField.CURRENCY_B
              : Field.OUTPUT;
          onUserInput("");
          onCurrencySelect(input, currency);
        } else {
          const input = inputType === "input" ? Field.INPUT : Field.OUTPUT;
          // onUserInput(input, "");
          if (onCurrencySelect) onCurrencySelect(input, currency);
          onCurrencySelection(input, currency);
        }

        if (userSidebarOpen === 2) {
          setUserSidebarOpen(0);

          // setSidebarContent(<UserDashboard />);

          return;
        }

        setSidebarContent(<UserDashboard />);
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <CurrencyLogo currency={currency} size="36px" />
        <div>
          <p className="text-start text-lg">{currency?.symbol}</p>
          <p className="flex items-center justify-start gap-1 text-sm">
            {priceChange24h > 0 ? (
              <span className="flex items-center text-green">
                {priceChange24h.toFixed(3)}% <ArrowTrendingUpIcon className="h-3 w-3" />
              </span>
            ) : (
              <span className="flex items-center text-danger">
                {Math.abs(priceChange24h).toFixed(3)}% <ArrowTrendingDownIcon className="h-3 w-3 dark:text-danger" />
              </span>
            )}
            <span className="text-primary">24HR</span>
          </p>
          <p className={`${priceChange24h > 0 ? "dark:text-green" : "dark:text-danger"} text-[10px]`}>
            {tokenPrice} USD = 1.00 {currency?.symbol}
          </p>
        </div>
      </div>
      {balance && !balance.equalTo(0) && (
        <div className="text-end">
          <p>{balance.toFixed(3)}</p>
          <p className="text-sm opacity-40">
            {new BigNumber(balance.toSignificant()).times(tokenPrice).toFixed(4)} USD
          </p>
        </div>
      )}
    </button>
  );
};

const CurrencySelector = ({
  inputType,
  filteredCurrencies,
  onUserInput,
  type,
  onCurrencySelect,
}: CurrencySelectorProps) => {
  const { chainId, account } = useActiveWeb3React();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 200);

  const [invertSearchOrder] = useState<boolean>(false);
  const { setViewType }: any = useContext(DashboardContext);
  const [, setSidebarContent] = useGlobalState("userSidebarContent");
  const [userSidebarOpen] = useGlobalState("userSidebarOpen");

  const allTokens = useAllTokens();

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery);

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim();
    return s === "" || s === "b" || s === "bn" || s === "bnb";
  }, [debouncedQuery]);

  const tokenComparator = useTokenComparator(invertSearchOrder);

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery);
  }, [allTokens, debouncedQuery]);

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator);
  }, [filteredTokens, tokenComparator]);

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery);

  const onInputAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      // Do something with e.target.value
      const input = e.target.value;
      const checksummedInput = isAddress(input);
      setSearchQuery(checksummedInput || input);
    }
  };

  const onInputEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === NATIVE_CURRENCIES[chainId].symbol.toLowerCase()) {
          // handleCurrencySelect(NATIVE_CURRENCIES[chainId]);
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            // handleCurrencySelect(filteredSortedTokens[0]);
          }
        }
      }
    },
    [filteredSortedTokens, debouncedQuery, chainId]
  );

  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery);
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery);

  const currencies =
    filteredCurrencies?.length > 0
      ? filterTokens(filteredCurrencies, debouncedQuery)
      : filteredInactiveTokens
      ? filteredSortedTokens.concat(filteredInactiveTokens)
      : filteredSortedTokens;

  const walletTokens = useWalletTokens(account, MORALIS_CHAIN_NAME[chainId]);
  const itemData: (Currency | undefined)[] = useMemo(() => {
    if (!chainId) return [];
    let formatted: (Currency | undefined)[] = showETH ? [NATIVE_CURRENCIES[chainId], ...currencies] : currencies;
    return formatted;
  }, [currencies, showETH, chainId]);

  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const ethBalance = useNativeBalances([account])[account];

  const listingTokens: (Currency | undefined)[] = useMemo(() => {
    switch (activeTab) {
      case 0:
        return itemData;
      case 1:
        if (!popularTokens[chainId]) return [];
        return itemData.filter((_token) =>
          popularTokens[chainId].find((__token) => _token?.address === __token?.address)
        );
      case 2:
        return itemData.filter(
          (_token) =>
            (_token?.isNative && ethBalance?.greaterThan(0)) ||
            walletTokens.find((__token) => _token?.symbol === __token?.symbol)
        );
      case 3:
        if (!factoryTokens[chainId]) return [];
        return itemData.filter((_token) =>
          factoryTokens[chainId].find((__token) => _token?.address === __token?.address)
        );
      default:
        return [];
    }
  }, [activeTab, chainId, itemData, ethBalance, walletTokens]);

  const tokenMarketData = useTokenMarketChart(
    listingTokens
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((currency) => currency?.wrapped?.address),
    chainId
  );

  const totalPages = useMemo(() => Math.ceil(listingTokens.length / rowsPerPage), [listingTokens, rowsPerPage]);

  const nextPage = () => {
    setPage((page + 1) % totalPages);
  };
  const prevPage = () => {
    setPage((page - 1) % totalPages);
  };

  const [viewSelect, setViewSelect] = useState(0);

  const onSelect = (i: number) => {
    setViewType(i);
    setSidebarContent(<UserDashboard />);
    setViewSelect(i);
  };

  return (
    <div className="relative w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-brand">
          <h2 className="text-3xl">Select token</h2>
        </div>
        {userSidebarOpen === 1 ? <NavButton value={viewSelect} setValue={onSelect} /> : ""}
      </div>

      <nav className="mb-4 flex space-x-4" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.name}
            onClick={() => {
              setPage(0);
              setActiveTab(index);
            }}
            className={clsx(
              index === activeTab ? "bg-gray-700 text-brand" : "bg-gray-800 text-gray-500 hover:text-gray-400",
              "rounded-2xl px-4 py-2 text-sm"
            )}
          >
            {tab.name}
          </button>
        ))}
      </nav>

      <input
        onChange={onInputAddress}
        onKeyDown={onInputEnter}
        type="text"
        placeholder="Search by contract address..."
        className="input-bordered input w-full"
      />

      <div className="mt-3 px-2">
        <div>
          {listingTokens.length > 0 ? (
            listingTokens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((currency, index) => {
              const tokenAddress = currency?.wrapped?.address?.toLowerCase();
              return (
                <CurrencyRow
                  key={index}
                  currency={currency}
                  inputType={inputType}
                  marketData={tokenMarketData[tokenAddress] || defaultMarketData}
                  onUserInput={onUserInput}
                  type={type}
                  onCurrencySelect={onCurrencySelect}
                />
              );
            })
          ) : (
            <>
              <img className="m-auto" alt="No results" src="/images/Brewlabs--no-results-found-transparent.gif" />
              <p className="my-7 flex justify-center text-2xl dark:text-primary">No Result Found</p>
            </>
          )}
        </div>
      </div>
      {listingTokens.length > 0 && (
        <div className="mb-2 mt-3 flex justify-center gap-5">
          <PrimaryOutlinedButton disabled={page === 0} onClick={prevPage}>
            Back
          </PrimaryOutlinedButton>
          <PrimaryOutlinedButton disabled={page === totalPages - 1} onClick={nextPage}>
            Next
          </PrimaryOutlinedButton>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
