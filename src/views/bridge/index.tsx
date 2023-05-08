import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { ChainId } from "@brewlabs/sdk";
import { BigNumber, ethers } from "ethers";
import Skeleton from "react-loading-skeleton";
import { useAccount } from "wagmi";

import { bridgeConfigs } from "config/constants/bridge";
import { NetworkOptions, SUPPORTED_CHAIN_IDS } from "config/constants/networks";
import { BridgeToken } from "config/constants/types";
import { BridgeContextState, useBridgeContext } from "contexts/BridgeContext";
import { useFromChainId } from "hooks/bridge/useBridgeDirection";
import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useTokenPrices } from "hooks/useTokenPrice";
import { formatValue } from "lib/bridge/helpers";
import { fetchTokenBalance } from "lib/bridge/token";

import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import PageWrapper from "components/layout/PageWrapper";
import ChainSelector from "components/ChainSelector";
import CryptoCard from "components/cards/CryptoCard";
import InputNumber from "components/inputs/InputNumber";
import WordHighlight from "components/text/WordHighlight";
import { useGlobalState, setGlobalState } from "state";

import BridgeDragButton from "components/bridge/BridgeDragButton";
import BridgeDragTrack from "components/bridge/BridgeDragTrack";
import BridgeLoadingModal from "components/bridge/BridgeLoadingModal";
import ConfirmBridgeMessage from "components/bridge/ConfirmBridgeMessage";
import History from "components/bridge/TransactionHistoryTable";

const useDelay = (fn: any, ms: number) => {
  const timer: any = useRef(0);

  const delayCallBack = useCallback(
    (...args: any) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(fn.bind(this, ...args), ms || 0);
    },
    [fn, ms]
  );

  return delayCallBack;
};

const percents = ["MAX", "10%", "25%", "50%", "75%"];

const Bridge: NextPage = () => {
  const { theme } = useTheme();
  const supportedNetworks = useSupportedNetworks();
  const fromChainId = useFromChainId();
  const { address: account } = useAccount();

  const scrollRef = useRef(null);
  const [isStuck, setIsStuck] = useState(false);

  const [networkFrom, setNetworkFrom] = useGlobalState("userBridgeFrom");
  const [networkTo, setNetworkTo] = useGlobalState("userBridgeTo");
  const [locked, setLocked] = useGlobalState("userBridgeLocked");
  const [bridgeFromToken, setBridgeFromToken] = useGlobalState("userBridgeFromToken");
  const [locking, setLocking] = useState(false);

  const [supportedFromTokens, setSupportedFromTokens] = useState<BridgeToken[]>([]);
  const [bridgeToToken, setBridgeToToken] = useState<BridgeToken>();
  const [toChains, setToChains] = useState<ChainId[]>();
  const [percent, setPercent] = useState(0);

  const [openFromChainModal, setOpenFromChainModal] = useState(false);

  const [balanceLoading, setBalanceLoading] = useState(false);
  const [toBalanceLoading, setToBalanceLoading] = useState(false);

  const {
    txHash,
    fromToken,
    setToken,
    fromBalance,
    fromAmount,
    setFromBalance,
    setAmount,
    amountInput,
    setAmountInput,
    toToken,
    toBalance,
    toAmount,
    toAmountLoading,
    setToBalance,
  }: BridgeContextState = useBridgeContext();
  const tokenPrices = useTokenPrices();

  useEffect(() => {
    if (fromChainId <= 0 || !SUPPORTED_CHAIN_IDS.includes(fromChainId)) return;
    const tmpTokens = [];
    tmpTokens.push(...bridgeConfigs.filter((c) => c.homeChainId === fromChainId).map((config) => config.homeToken));
    tmpTokens.push(
      ...bridgeConfigs.filter((c) => c.foreignChainId === fromChainId).map((config) => config.foreignToken)
    );
    tmpTokens.sort((a, b) => {
      if (a.name < b.symbol) return -1;
      if (a.symbol > b.symbol) return 1;
      return 0;
    });

    setNetworkFrom(NetworkOptions.find((c) => c.id === fromChainId)!);
    setSupportedFromTokens(tmpTokens);
  }, [fromChainId, setNetworkFrom]);

  useEffect(() => {
    if (bridgeFromToken?.chainId !== fromChainId) {
      setBridgeFromToken(supportedFromTokens[0]);
      setToken(supportedFromTokens[0]);
    }
  }, [fromChainId, bridgeFromToken, supportedFromTokens, setBridgeFromToken, setToken]);

  useEffect(() => {
    const chainIds = bridgeConfigs
      .filter((c) => c.homeChainId === fromChainId && c.homeToken.address === bridgeFromToken?.address)
      .map((config) => config.foreignChainId);
    chainIds.push(
      ...bridgeConfigs
        .filter((c) => c.foreignChainId === fromChainId && c.foreignToken.address === bridgeFromToken?.address)
        .map((config) => config.homeChainId)
    );
    setToChains(chainIds);
    if (chainIds.length === 0) {
      setBridgeToToken(undefined);
      return;
    }
    // set toChain
    let _toChainId = networkTo.id;
    if (!chainIds.includes(_toChainId)) {
      _toChainId = chainIds[0];
      setNetworkTo(NetworkOptions.find((c) => c.id === _toChainId)!);
    }

    // set toToken
    const config = bridgeConfigs.find(
      (c) =>
        (c.homeChainId === fromChainId &&
          c.homeToken.address === bridgeFromToken?.address &&
          c.foreignChainId === _toChainId) ||
        (c.foreignChainId === fromChainId &&
          c.foreignToken.address === bridgeFromToken?.address &&
          c.homeChainId === _toChainId)
    );

    if (config?.homeToken.address === bridgeFromToken?.address) {
      setBridgeToToken(config?.foreignToken);
    } else {
      setBridgeToToken(config?.homeToken);
    }
  }, [fromChainId, bridgeFromToken, networkTo.id, setNetworkTo]);

  useLayoutEffect(() => {
    watchScroll();
  }, []);

  useEffect(() => {
    if (fromToken && account) {
      (async () => {
        try {
          setBalanceLoading(true);
          const b = await fetchTokenBalance(fromToken, account);
          setFromBalance(b);
        } catch (fromBalanceError) {
          setFromBalance(BigNumber.from(0));
          console.error({ fromBalanceError });
        } finally {
          setBalanceLoading(false);
        }
      })();
    } else {
      setFromBalance(BigNumber.from(0));
    }
  }, [txHash, fromToken, account, setFromBalance, setBalanceLoading]);

  useEffect(() => {
    if (toToken && account) {
      (async () => {
        try {
          setToBalanceLoading(true);
          const b = await fetchTokenBalance(toToken, account);
          setToBalance(b);
        } catch (toBalanceError) {
          setToBalance(BigNumber.from(0));
          console.error({ toBalanceError });
        } finally {
          setToBalanceLoading(false);
        }
      })();
    } else {
      setToBalance(BigNumber.from(0));
    }
  }, [txHash, toToken, account, setToBalance, setToBalanceLoading]);

  const updateAmount = useCallback(() => setAmount(amountInput), [amountInput, setAmount]);
  const delayedSetAmount = useDelay(updateAmount, 500);

  const fromTokenSelected = (e: any) => {
    setBridgeFromToken(supportedFromTokens.find((token) => token.address === e.target.value));
    setToken(supportedFromTokens.find((token) => token.address === e.target.value)!);
  };

  const onPercentSelected = (index: number) => {
    const realPercentages = [100, 10, 25, 50, 75];
    if (fromBalance && fromToken) {
      setAmountInput(
        ethers.utils.formatUnits(fromBalance.mul(realPercentages[index]).div(100), fromToken.decimals).toString()
      );
      setAmount(
        ethers.utils.formatUnits(fromBalance.mul(realPercentages[index]).div(100), fromToken.decimals).toString()
      );
    }
    setPercent(index);
  };

  const watchScroll = () => {
    const observer = new IntersectionObserver(([e]) => setIsStuck(e.intersectionRatio < 1), {
      threshold: 1,
      rootMargin: "-112px 0px 0px 0px",
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Transfer tokens <WordHighlight content="cross-chain" /> with the Brewlabs bridge.
          </>
        }
        summary="Easily transfer tokens with confidence."
      />

      <BridgeLoadingModal />

      <Container>
        <div className="relative grid justify-center pb-64 md:h-auto md:grid-cols-11">
          <div ref={scrollRef} className="sticky top-28 mb-48 md:relative md:top-0 md:col-span-4 md:mb-0">
            <CryptoCard
              title="Bridge from"
              id="bridge_card_from"
              network={networkFrom}
              tokenPrice={tokenPrices[`c${bridgeFromToken?.chainId}_t${bridgeFromToken?.address?.toLowerCase()}`] ?? 0}
              modal={{
                buttonText: networkFrom.name,
                disableAutoCloseOnClick: true,
                openModal: openFromChainModal,
                onOpen: () => setOpenFromChainModal(true),
                onClose: () => setOpenFromChainModal(false),
                modalContent: (
                  <ChainSelector
                    bSwitchChain
                    networks={supportedNetworks}
                    currentChainId={networkFrom.id}
                    onDismiss={() => setOpenFromChainModal(false)}
                    selectFn={(selectedValue) => setGlobalState("userBridgeFrom", selectedValue)}
                  />
                ),
              }}
            >
              <div className="mx-auto mt-4 max-w-md">
                <div className="flex justify-between">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-400">
                    Token and Amount
                  </label>
                  {balanceLoading ? (
                    <Skeleton
                      width={80}
                      baseColor={theme === "dark" ? "#3e3e3e" : "#bac3cf"}
                      highlightColor={theme === "dark" ? "#686363" : "#747c87"}
                    />
                  ) : (
                    <label className="block text-sm font-medium text-gray-400">
                      {formatValue(fromBalance, fromToken?.decimals)}
                    </label>
                  )}
                </div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={bridgeFromToken?.address}
                      onChange={fromTokenSelected}
                      className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-amber-300 focus:ring-amber-300 md:text-sm"
                    >
                      {supportedFromTokens.map((token) => (
                        <option key={`${token.chainId}-${token.address}`} value={token.address}>
                          {token.symbol === "BREWLABS" ? "BREWS" : token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputNumber
                    name="bridge_amount"
                    placeholder={"0.0"}
                    value={amountInput}
                    onKeyPress={(e: any) => {
                      if (e.key === ".") {
                        if (e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      } else if (Number.isNaN(Number(e.key))) {
                        e.preventDefault();
                      }
                    }}
                    onKeyUp={delayedSetAmount}
                    onChange={(event) => {
                      setPercent(0);
                      setAmountInput(event.target.value);
                    }}
                  />

                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={percent}
                      onChange={(e) => onPercentSelected(+e.target.value)}
                      className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-amber-300 focus:ring-amber-300 md:text-sm"
                    >
                      {percents.map((val, idx) => (
                        <option key={idx} value={idx}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CryptoCard>
            <p className="mt-4 block text-center text-sm text-slate-900 dark:text-gray-500 md:hidden">
              Scroll down to choose network to send to
            </p>
          </div>

          <BridgeDragTrack setLockingFn={setLocked} />

          <div className="sticky top-32 md:relative md:top-0 md:col-span-4">
            <CryptoCard
              title="Bridge to"
              id="bridge_card_to"
              tokenPrice={tokenPrices[`c${bridgeToToken?.chainId}_t${bridgeToToken?.address?.toLowerCase()}`] ?? 0}
              active={isStuck}
              network={networkTo}
              modal={{
                buttonText: networkTo.name,

                openModal: locked,
                onClose: () => {
                  setLocking(false);
                  setLocked(false);
                },
                disableAutoCloseOnClick: locked,
                modalContent: locked ? (
                  <ConfirmBridgeMessage
                    onClose={() => {
                      setOpenFromChainModal(false);
                      setLocking(false);
                    }}
                  />
                ) : (
                  <ChainSelector
                    networks={supportedNetworks.filter((n) => toChains?.includes(n.id))}
                    currentChainId={networkTo.id}
                    selectFn={(selectedValue) => setGlobalState("userBridgeTo", selectedValue)}
                  />
                ),
              }}
            >
              <div className="mx-auto mt-4 max-w-md">
                <div className="flex justify-center text-2xl text-slate-400">
                  {toAmountLoading ? (
                    <Skeleton
                      width={100}
                      baseColor={theme === "dark" ? "#3e3e3e" : "#bac3cf"}
                      highlightColor={theme === "dark" ? "#686363" : "#747c87"}
                    />
                  ) : (
                    <span>{formatValue(toAmount, bridgeToToken?.decimals)}</span>
                  )}
                  <span className="ml-1"> {bridgeToToken?.symbol}</span>
                </div>
              </div>
            </CryptoCard>
          </div>

          {networkFrom.id !== 0 && networkTo.id !== 0 && <BridgeDragButton setLockingFn={setLocked} />}
        </div>

        <History />
      </Container>
    </PageWrapper>
  );
};

export default Bridge;
