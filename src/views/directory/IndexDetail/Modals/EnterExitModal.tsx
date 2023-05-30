/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { WNATIVE } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import styled from "styled-components";

import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import IndexLogo from "components/logo/IndexLogo";
import LogoIcon from "components/LogoIcon";

import { DashboardContext } from "contexts/DashboardContext";
import useTokenPrice from "hooks/useTokenPrice";
import { getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { DeserializedIndex } from "state/indexes/types";
import { formatAmount } from "utils/formatApy";
import { getIndexName, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import StyledButton from "../../StyledButton";
import StyledSlider from "./StyledSlider";
import useIndex from "../hooks/useIndex";

const EnterExitModal = ({
  open,
  setOpen,
  type,
  data,
}: {
  open: boolean;
  setOpen: any;
  type: string;
  data: DeserializedIndex;
}) => {
  const { tokens, priceHistories, userData } = data;
  const [amount, setAmount] = useState("");
  const [insufficient, setInsufficient] = useState(false);
  const [maxPressed, setMaxPressed] = useState(false);

  const [percent, setPercent] = useState(100 - (data.numTokens - 1) * Math.floor(100 / data.numTokens));
  const [percents, setPercents] = useState(new Array(data.numTokens - 1).fill(Math.floor(100 / data.numTokens)));

  const { pending, setPending }: any = useContext(DashboardContext);
  const { onZapIn, onZapOut, onClaim } = useIndex(data.pid, data.address, data.performanceFee);

  const ethbalance = ethers.utils.formatEther(userData.ethBalance);
  const stakedBalances = userData.stakedBalances?.length
    ? userData.stakedBalances.map((a, index) => ethers.utils.formatUnits(a, tokens[index].decimals))
    : new Array(data.numTokens).fill("0");

  const nativeTokenPrice = useTokenPrice(data.chainId, WNATIVE[data.chainId].address);

  useEffect(() => {
    if (type === "enter" && Number(amount) > +ethbalance && !maxPressed) setInsufficient(true);
    else setInsufficient(false);
  }, [amount, maxPressed]);

  const percentChanged = (idx, value) => {
    if (idx === 0) {
      setPercent(value);

      let _percents = percents;
      let total = value;
      for (let k = 1; k < data.numTokens - 1; k++) {
        total += _percents[k];
      }

      if (total <= 100) {
        _percents[0] = 100 - total;
      } else {
        _percents[0] = 0;
        for (let k = 1; k < data.numTokens - 1; k++) {
          if (_percents[k] >= total - 100) {
            _percents[k] -= total - 100;
            break;
          } else {
            total -= _percents[k];
            _percents[k] = 0;
          }
        }
      }
      setPercents(_percents);
    } else {
      let _percents = percents;
      _percents[idx - 1] = value;

      let total = 0;
      for (let k = 0; k < data.numTokens - 1; k++) {
        total += _percents[k];
      }

      if (total <= 100) {
        setPercent(100 - total);
      } else {
        setPercent(0);
        for (let k = 0; k < data.numTokens - 1; k++) {
          if (k === idx - 1 || _percents[k] === 0) continue;

          if (_percents[k] >= total - 100) {
            _percents[k] -= total - 100;
            break;
          } else {
            total -= _percents[k];
            _percents[k] = 0;
          }
        }
        setPercents((vs) =>
          vs.map((v, i) => {
            if (i === idx - 1) return value;
            return _percents[i];
          })
        );
      }
    }
  };

  const calcExitUsdAmount = () => {
    let total = 0;
    for (let k = 0; k < data.numTokens; k++) {
      total += +stakedBalances[k] * data.tokenPrices[k];
    }
    return ((total * percent) / 100).toFixed(2);
  };

  const renderProfit = () => {
    let profit = 0;
    if (!priceHistories?.length) return <span className="mx-1 text-green">$0.00</span>;

    for (let k = 0; k < data.numTokens; k++) {
      profit += +stakedBalances[k] * priceHistories[k][priceHistories[k].length - 1];
    }
    profit -= +userData.stakedUsdAmount;

    return (
      <span className={`${profit >= 0 ? "text-green" : "text-danger"} mx-1`}>
        ${numberWithCommas(profit.toFixed(3))}
      </span>
    );
  };

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleZapIn = async () => {
    if (percents.filter((p) => p < 0).length > 0 || percent < 0) {
      toast.error("Cannot set negative percentage");
      return;
    }

    setPending(true);
    try {
      await onZapIn(amount, [percent, ...percents]);

      toast.success(`Zapped in successfully`);
      setOpen(false);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const handleZapOut = async () => {
    setPending(true);
    try {
      await onZapOut();

      toast.success(`Zapped out successfully`);
      setOpen(false);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const handleClaimTokens = async () => {
    setPending(true);
    try {
      await onClaim(percent);

      toast.success(`Claimed ${percent}% tokens`);
      setOpen(false);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog
        open={open}
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
        onClose={() => setOpen(false)}
      >
        <div className="flex min-h-full items-center justify-center p-4 ">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: "easeOut",
                duration: 0.15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
            transition={{ duration: 0.25 }}
          >
            <StyledPanel>
              <div className="flex flex-col-reverse items-center justify-between border-b border-b-[#FFFFFF80] pb-3 xmd:flex-row">
                <div className="mt-5 flex items-center pl-3 text-xl text-[#FFFFFFBF] xmd:mt-0">
                  <LogoIcon classNames="w-9 text-brand mr-3" />
                  <div>{type === "enter" ? "Enter" : "Exit"} Brewlabs Origin Index</div>
                </div>
                <div className="h-10 w-full min-w-[130px] xmd:w-fit">
                  <StyledButton type="secondary" onClick={() => setOpen(false)}>
                    <div className="flex items-center text-[#FFFFFFBF]">
                      {chevronLeftSVG}
                      <div className="ml-2">Back a page</div>
                    </div>
                  </StyledButton>
                </div>
              </div>
              {type === "enter" ? (
                <>
                  <div className="mt-[30px]">
                    <StyledInput
                      placeholder={`Enter amount ${getNativeSybmol(data.chainId)}...`}
                      value={amount}
                      onChange={(e) => {
                        if ((isNaN(+e.target.value) || !e.target.value) && e.target.value !== "") return;

                        setAmount(e.target.value);
                        setMaxPressed(false);
                      }}
                    />
                  </div>
                  <div className="mt-2 flex w-full items-center justify-between text-sm">
                    <div className="flex">
                      <div
                        className="mr-2  flex h-5 w-14 cursor-pointer items-center justify-center rounded-xl border border-[#FFFFFF80] bg-[#FFFFFF0D] text-xs text-[#FFFFFFBF] transition hover:opacity-70"
                        onClick={() => setAmount((Number(ethbalance) / 4).toFixed(5))}
                      >
                        25.00%
                      </div>
                      <div
                        className="mr-2  flex h-5 w-14 cursor-pointer items-center justify-center rounded-xl border border-[#FFFFFF80] bg-[#FFFFFF0D] text-xs text-[#FFFFFFBF] transition hover:opacity-70"
                        onClick={() => setAmount(((Number(ethbalance) / 4) * 2).toFixed(5))}
                      >
                        50.00%
                      </div>
                      <div
                        className="mr-2  flex h-5 w-14 cursor-pointer items-center justify-center rounded-xl border border-[#FFFFFF80] bg-[#FFFFFF0D] text-xs text-[#FFFFFFBF] transition hover:opacity-70"
                        onClick={() => setAmount(((Number(ethbalance) / 4) * 3).toFixed(5))}
                      >
                        75.00%
                      </div>
                      <div
                        className="mr-2  flex h-5 w-14 cursor-pointer items-center justify-center rounded-xl border border-[#FFFFFF80] bg-[#FFFFFF0D] text-xs text-[#FFFFFFBF] transition hover:opacity-70"
                        onClick={() => setAmount(Number(ethbalance).toFixed(5))}
                      >
                        Max
                      </div>
                    </div>
                    <div className="text-[#FFFFFFBF]">
                      My {getNativeSybmol(data.chainId)} <span className="text-yellow">:</span>{" "}
                      {Number(ethbalance).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-1 flex w-full flex-col items-end text-sm">
                    <div className="text-[#FFFFFF80]">${(+(amount ?? 0) * nativeTokenPrice).toFixed(2)} USD</div>
                  </div>
                </>
              ) : (
                <div className="mb-[10px] mt-5 sm:mb-[20px]">
                  {tokens.map((token, index) => (
                    <div key={token.address} className="text-center">
                      {formatAmount(stakedBalances[index], 6)} {token.symbol}
                    </div>
                  ))}
                </div>
              )}

              <div className="mx-auto mb-4 mt-4 flex w-full max-w-[480px] items-center">
                {type === "enter" ? (
                  <img
                    src={getTokenLogoURL(tokens[0].address, tokens[0].chainId)}
                    onError={(data) => (data.target["src"] = "/images/unknown.png")}
                    alt={""}
                    className="w-14 rounded-full"
                  />
                ) : (
                  <IndexLogo tokens={tokens} classNames="mr-0 scale-125" />
                )}
                <StyledSlider value={percent} setValue={(v) => percentChanged(0, v)} balance={100} symbol={"%"} />
                <div className="relative">
                  <div className="flex h-[36px] w-[100px] items-center justify-center rounded border border-[#FFFFFF40] bg-[#B9B8B81A] text-[#FFFFFFBF]">
                    {percent.toFixed(2)}%
                  </div>
                  <div className="absolute -bottom-5 right-0 text-xs text-[#FFFFFF80]">
                    {type === "enter" ? (
                      <>${((+(amount ?? 0) * nativeTokenPrice * percent) / 100).toFixed(2)} USD</>
                    ) : (
                      <>${calcExitUsdAmount()} USD</>
                    )}
                  </div>
                </div>
              </div>

              {type === "enter" ? (
                tokens.slice(1).map((token, index) => (
                  <div key={token.address} className="mx-auto mb-4 mt-4 flex w-full max-w-[480px] items-center">
                    <img
                      src={getTokenLogoURL(token.address, token.chainId)}
                      onError={(data) => (data.target["src"] = "/images/unknown.png")}
                      alt={""}
                      className="w-14 rounded-full"
                    />
                    <StyledSlider
                      value={percents[index]}
                      setValue={(v) => percentChanged(index + 1, v)}
                      balance={100}
                      symbol={"%"}
                    />
                    <div className="relative">
                      <div className="flex h-[36px] w-[100px] items-center justify-center rounded border border-[#FFFFFF40] bg-[#B9B8B81A] text-[#FFFFFFBF]">
                        {percents[index] ? percents[index].toFixed(2) : "0.00"}%
                      </div>
                      <div className="absolute -bottom-5 right-0 text-xs text-[#FFFFFF80]">
                        ${((+(amount ?? 0) * nativeTokenPrice * percents[index]) / 100).toFixed(2)} USD
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={type !== "enter" ? "mt-[30px] sm:mt-[70px]" : ""}></div>
              )}

              <div className="my-6 h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[480px]">
                {type === "enter" ? (
                  <div className="h-12">
                    <StyledButton type="quaternary" onClick={handleZapIn} disabled={!amount || pending || insufficient}>
                      {insufficient ? `Insufficient balance` : `Enter ${getIndexName(tokens)} Index`}
                    </StyledButton>
                  </div>
                ) : (
                  <div className="flex h-12">
                    <StyledButton
                      type="quaternary"
                      onClick={handleClaimTokens}
                      disabled={pending || !percent || +userData.stakedUsdAmount <= 0}
                    >
                      Exit {renderProfit()} Profit
                    </StyledButton>
                    <div className="mx-1" />
                    <StyledButton
                      type="quaternary"
                      onClick={handleZapOut}
                      disabled={pending || +userData.stakedUsdAmount <= 0}
                    >
                      Zap Out
                    </StyledButton>
                  </div>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute -right-2 -top-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
              </button>
            </StyledPanel>
          </motion.div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
};

const StyledPanel = styled.div`
  position: relative;
  width: calc(100vw - 24px);
  max-width: 640px;
  border-radius: 8px;
  background: #1b212d;
  padding: 40px 50px;
  @media screen and (max-width: 450px) {
    padding-left: 12px;
    padding-right: 12px;
  }
  display: flex;
  flex-direction: column;
`;
const StyledInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 16px 14px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 6px;
  color: white;
  outline: none;
`;
export default EnterExitModal;
