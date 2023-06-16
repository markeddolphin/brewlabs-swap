/* eslint-disable react-hooks/exhaustive-deps */
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { WNATIVE } from "@brewlabs/sdk";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

import { chevronLeftSVG, LinkSVG, lockSVG, warningFarmerSVG } from "components/dashboard/assets/svgs";
import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import { SkeletonComponent } from "components/SkeletonComponent";
import WordHighlight from "components/text/WordHighlight";

import { BASE_URL } from "config";
import { CHAIN_ICONS } from "config/constants/networks";
import { PoolCategory } from "config/constants/types";
import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import useTokenPrice, { useTokenPrices } from "hooks/useTokenPrice";
import { getExplorerLink, getNativeSybmol, getNetworkLabel, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { useChainCurrentBlock } from "state/block/hooks";
import {
  setPoolsPublicData,
  setPoolsUserData,
  updateUserAllowance,
  updateUserBalance,
  updateUserPendingReward,
  updateUserStakedBalance,
} from "state/pools";
import { fetchPoolDepositBalance, fetchPoolFeeHistories, fetchPoolTotalRewards } from "state/pools/fetchPools";
import { fetchUserDepositData } from "state/pools/fetchPoolsUser";
import { BIG_ZERO } from "utils/bigNumber";
import { numberWithCommas } from "utils/functions";
import { formatTvl, formatAmount } from "utils/formatApy";
import { getBalanceNumber } from "utils/formatBalance";
import getCurrencyId from "utils/getCurrencyId";
import getTokenLogoURL from "utils/getTokenLogoURL";

import ProgressBar from "./ProgressBar";
import StyledButton from "../StyledButton";
import StakingHistory from "./StakingHistory";
import TotalStakedChart from "./TotalStakedChart";
import StakingModal from "./Modals/StakingModal";
import useLockupPool from "./hooks/useLockupPool";
import useUnlockupPool from "./hooks/useUnlockupPool";
import EmergencyModal from "./Modals/EmergencyModal";
import { useRouter } from "next/router";

const StakingDetail = ({ detailDatas }: { detailDatas: any }) => {
  const { data } = detailDatas;
  const dispatch = useAppDispatch();

  const { userData: accountData, earningToken, stakingToken, reflectionTokens } = data;
  const [stakingModalOpen, setStakingModalOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [curType, setCurType] = useState("deposit");
  const [populatedAmount, setPopulatedAmount] = useState("0");
  const [curGraph, setCurGraph] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  const router = useRouter();
  const { address } = useAccount();
  const { chainId } = useActiveChainId();
  const { canSwitch, switchNetwork } = useSwitchNetwork();
  const { pending, setPending }: any = useContext(DashboardContext);
  const currentBlock = useChainCurrentBlock(data.chainId);

  const tokenPrice = useTokenPrice(data.chainId, stakingToken.address);
  const nativeTokenPrice = useTokenPrice(data.chainId, WNATIVE[data.chainId].address);
  const tokenPrices = useTokenPrices();

  const isLockup = data.poolCategory === PoolCategory.LOCKUP;
  const {
    onReward: onRewardLockup,
    onCompound: onCompoundLockup,
    onDividend: onDividendLockup,
    onCompoundDividend: onCompoundDividendLockup,
  } = useLockupPool(data.sousId, data.contractAddress, data.lockup, data.performanceFee);
  const { onReward, onCompound, onDividend, onCompoundDividend } = useUnlockupPool(
    data.sousId,
    data.contractAddress,
    data.performanceFee
  );

  let hasReflections = false;
  let reflectionUsdAmount = 0;
  const reflectionTokenBalances = [];
  for (let i = 0; i < reflectionTokens.length; i++) {
    reflectionTokenBalances.push(
      getBalanceNumber(accountData.reflections[i] ?? BIG_ZERO, reflectionTokens[i].decimals)
    );
    if (accountData.reflections[i]?.gt(0)) hasReflections = true;

    reflectionUsdAmount +=
      reflectionTokenBalances[i] * (tokenPrices[getCurrencyId(data.chainId, reflectionTokens[i].address)] ?? 0);
  }
  const earningTokenBalance = getBalanceNumber(accountData.earnings ?? BIG_ZERO, earningToken.decimals);

  useEffect(() => {
    const fetchtotalRewardsAsync = async () => {
      const { availableRewards, availableReflections } = await fetchPoolTotalRewards(data);
      const depositBalance = await fetchPoolDepositBalance(data);

      dispatch(setPoolsPublicData([{ sousId: data.sousId, availableRewards, availableReflections, depositBalance }]));
    };

    const fetchFeeHistoriesAsync = async () => {
      const { performanceFees, tokenFees, stakedAddresses } = await fetchPoolFeeHistories(data);

      dispatch(
        setPoolsPublicData([
          {
            sousId: data.sousId,
            performanceFees: performanceFees,
            tokenFees: tokenFees,
            stakedAddresses: stakedAddresses,
          },
        ])
      );
    };

    fetchtotalRewardsAsync();
    fetchFeeHistoriesAsync();
  }, [data.sousId]);

  useEffect(() => {
    const fetchDepositHistoryAsync = async () => {
      const res = await fetchUserDepositData(data, address);
      dispatch(setPoolsUserData([res]));
    };

    if (address) {
      dispatch(updateUserAllowance(data.sousId, address, data.chainId));
      dispatch(updateUserBalance(data.sousId, address, data.chainId));
      dispatch(updateUserStakedBalance(data.sousId, address, data.chainId));
      dispatch(updateUserPendingReward(data.sousId, address, data.chainId));
      fetchDepositHistoryAsync();
    }
  }, [address, data.sousId]);

  const graphData = () => {
    let _graphData;
    switch (curGraph) {
      case 1:
        _graphData = data.TVLData ?? [];
        _graphData = _graphData.map((v) => +v);
        if (data.TVLData && data.tvl) _graphData.push(data.totalStaked.toNumber());
        return _graphData;
      case 2:
        return data.tokenFees ?? [];
      case 3:
        return data.performanceFees ?? [];
      case 4:
        return data.stakedAddresses ?? [];
      default:
        _graphData = data.TVLData ?? [];
        _graphData = _graphData.map((v) => +v);
        if (data.TVLData && data.tvl) _graphData.push(data.totalStaked.toNumber());
        return _graphData;
    }
  };

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const onCompoundReward = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onCompoundLockup();
      } else {
        await onCompound();
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onCompoundReflection = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onCompoundDividendLockup();
      } else {
        await onCompoundDividend();
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onHarvestReward = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onRewardLockup();
      } else {
        await onReward();
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onHarvestReflection = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onDividendLockup();
      } else {
        await onDividend();
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onSharePool = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(`${BASE_URL}${location.pathname}`);
  };

  const history =
    data && accountData?.deposits && address
      ? accountData?.deposits.map((deposit) => ({ ...deposit, symbol: data.stakingToken.symbol }))
      : [];

  return (
    <AnimatePresence exitBeforeEnter>
      {
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute left-0 top-0 max-h-screen w-full overflow-y-scroll pb-[150px]">
            {address && data ? (
              <StakingModal
                open={stakingModalOpen}
                setOpen={setStakingModalOpen}
                type={curType}
                data={data}
                defaultAmount={populatedAmount}
              />
            ) : (
              ""
            )}
            {data.enableEmergencyWithdraw && (
              <EmergencyModal open={emergencyOpen} setOpen={setEmergencyOpen} data={data} />
            )}
            <PageHeader
              title={
                <div className="text-[40px]">
                  <WordHighlight content="Staking Pools" />
                  <div className="whitespace-wrap mt-5 text-xl font-normal sm:whitespace-nowrap">
                    Stake, farm, zap and explore indexes for passive income
                  </div>
                </div>
              }
            />
            {!data ? (
              <Container className="font-brand">
                <div className="flex items-center justify-between font-roboto">
                  <div className="flex w-[160px] flex-col sm:flex-row">
                    <div className="h-[32px] w-[140px] ">
                      <StyledButton onClick={() => router.push("/staking")}>
                        <div className="absolute left-2 top-[7px]">{chevronLeftSVG}</div>
                        <div className="ml-2">Back to pool list</div>
                      </StyledButton>
                    </div>
                  </div>
                </div>
              </Container>
            ) : (
              <Container className="font-brand">
                <div className="flex items-center justify-between font-roboto">
                  <div className="flex w-[160px] flex-col">
                    <div className="h-[32px] w-[140px] ">
                      <StyledButton onClick={() => router.push("/staking")}>
                        <div className="absolute left-2 top-[7px]">{chevronLeftSVG}</div>
                        <div className="ml-2">Back to pool list</div>
                      </StyledButton>
                    </div>
                    {data.isCustody && (
                      <div className="mt-2 block h-[32px] w-[140px] lg:mt-0 lg:hidden">
                        <StyledButton>
                          <div className="absolute left-2 top-2.5">{lockSVG}</div>
                          <div className="ml-3">Brewlabs Custody</div>
                        </StyledButton>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 justify-end">
                    {data.isCustody && (
                      <div className="ml-5 hidden w-full max-w-[470px] lg:block">
                        <div className="mt-2 h-[32px] w-[140px] lg:mt-0">
                          <StyledButton>
                            <div className="absolute left-2 top-2.5">{lockSVG}</div>
                            <div className="ml-3">Brewlabs Custody</div>
                          </StyledButton>
                        </div>
                      </div>
                    )}
                    <div className="ml-3 flex w-full max-w-fit flex-col justify-end lg:ml-5 lg:max-w-[520px] lg:flex-row">
                      {data.enableEmergencyWithdraw && (
                        <div className="mr-0 h-[32px] w-[180px] lg:mr-5">
                          <StyledButton
                            type={"danger"}
                            onClick={() => setEmergencyOpen(true)}
                            disabled={pending || !address}
                          >
                            Emergency Withdraw
                          </StyledButton>
                        </div>
                      )}
                      <StyledButton
                        className="mb-2 !h-8 !w-[140px] border border-primary bg-[#B9B8B81A] font-roboto font-bold text-primary hover:border-white hover:text-white lg:mb-0"
                        type={"default"}
                        onClick={onSharePool}
                      >
                        <div className="flex items-center">
                          <div className="mr-1.5">{isCopied ? "Copied" : "Share Pool"}</div> {LinkSVG}
                        </div>
                      </StyledButton>
                      {data.earningToken.projectLink && (
                        <a
                          className="ml-0 h-[32px] w-[140px] lg:ml-5"
                          href={data.earningToken.projectLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <StyledButton>
                            <div>Website</div>
                            <div className="absolute right-2 top-2.5 scale-125">{LinkSVG}</div>
                          </StyledButton>
                        </a>
                      )}
                      <a
                        className="ml-0 mt-2 h-[32px] w-[140px] lg:ml-5 lg:mt-0"
                        target="_blank"
                        href={`${BASE_URL}/swap?outputCurrency=${stakingToken.address}`}
                        rel="noreferrer"
                      >
                        <StyledButton>
                          <div>Swap</div>
                          <div className="absolute right-2 top-[7px] -scale-100">{chevronLeftSVG}</div>
                        </StyledButton>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
                  <div className="mt-4 flex w-[160px] items-center justify-center ">
                    <img
                      src={getTokenLogoURL(earningToken.address, data.chainId)}
                      alt={""}
                      className="w-[100px] rounded-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-wrap justify-end xl:flex-nowrap">
                    <InfoPanel
                      padding={"14px 25px 8px 25px"}
                      className="relative mt-4 max-w-full md:max-w-[520px] xl:md:max-w-[470px]"
                    >
                      <div className="flex justify-between text-xl">
                        <div>
                          Pool: <span className="text-primary">{earningToken.symbol}</span>
                          <a
                            className="ml-1 inline-block"
                            href={getExplorerLink(data.chainId, "address", data.contractAddress)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {LinkSVG}
                          </a>
                        </div>
                        <div className="flex">
                          APR:&nbsp;
                          <span className="text-primary">
                            {data.apr || data.apr === 0.0 ? `${data.apr.toFixed(2)}%` : <SkeletonComponent />}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-base  text-[#FFFFFF80]">
                        <div>
                          Stake: <span className="text-primary">{stakingToken.symbol}</span> earn{" "}
                          <span className="text-primary">{earningToken.symbol}</span>
                        </div>
                        <div className="text-primary">
                          {data.poolCategory === PoolCategory.CORE ? (
                            "Flexible"
                          ) : data.duration ? (
                            `${data.duration} days lock`
                          ) : (
                            <div className="flex">
                              <SkeletonComponent />
                              <span className="ml-1">days lock</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-[#FFFFFF80]">
                        <div className="flex">
                          Deposit Fee{" "}
                          {data.depositFee !== undefined ? (
                            (+data.depositFee).toFixed(2)
                          ) : (
                            <div className="ml-1">
                              <SkeletonComponent />
                            </div>
                          )}
                          %
                          <div className="tooltip" data-tip="Deposit fees are sent to token owner nominated address.">
                            <div className="ml-1 mt-[1.3px]">{warningFarmerSVG("11px")}</div>
                          </div>
                        </div>
                        <div className="flex">
                          Withdraw Fee{" "}
                          {data.withdrawFee !== undefined ? (
                            (+data.withdrawFee).toFixed(2)
                          ) : (
                            <div className="ml-1">
                              <SkeletonComponent />
                            </div>
                          )}
                          %{data.penaltyFee && <> (Early Withdraw Fee {data.penaltyFee.toFixed(2)} %)</>}
                          <div className="tooltip" data-tip="Withdraw fees are sent to token owner nominated address.">
                            <div className="ml-1 mt-[1.3px]">{warningFarmerSVG("11px")}</div>
                          </div>
                        </div>
                        <div className="flex">
                          Peformance Fee{" "}
                          {data.performanceFee !== undefined ? (
                            data.performanceFee / Math.pow(10, 18)
                          ) : (
                            <div className="ml-1">
                              <SkeletonComponent />
                            </div>
                          )}{" "}
                          {getNativeSybmol(data.chainId)}&nbsp;
                          <div
                            className="tooltip"
                            data-tip="Performance fee is charged per transaction to the Brewlabs Treasury (Brewlabs holders)."
                          >
                            <div className="ml-1 mt-[1.3px]">{warningFarmerSVG("11px")}</div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        {data ? (
                          <img src={CHAIN_ICONS[data.chainId]} alt={""} className="w-6" />
                        ) : (
                          <SkeletonComponent />
                        )}
                      </div>
                    </InfoPanel>

                    <InfoPanel
                      padding={"6px 25px 8px 25px"}
                      className="ml-0 mt-4 flex max-w-full flex-wrap justify-between md:ml-[30px] md:max-w-[520px]"
                    >
                      <div className="mt-2">
                        <div className="text-xl">Pool Rewards</div>
                        <div className=" text-[#FFFFFF80]">
                          <span className="text-primary">{earningToken.symbol}</span> earned
                        </div>
                        {data.reflection && (
                          <div className="text-[#FFFFFF80]">
                            <span className="text-primary">
                              {reflectionTokens.length === 1 ? reflectionTokens[0].symbol : "Multiple"}
                            </span>{" "}
                            Rewards
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Pending</div>
                        <div className=" flex text-primary">
                          {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                            "0.00"
                          ) : accountData.earnings ? (
                            formatAmount(earningTokenBalance.toFixed(4))
                          ) : (
                            <SkeletonComponent />
                          )}
                          &nbsp;
                          {data.earningToken.symbol}
                        </div>
                        {data.reflection &&
                          data.reflectionTokens.map((t, index) => (
                            <div key={index} className="flex text-primary">
                              {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                                "0.00"
                              ) : accountData.reflections[index] ? (
                                formatAmount(reflectionTokenBalances[index].toFixed(4))
                              ) : (
                                <SkeletonComponent />
                              )}
                              &nbsp;
                              {t.symbol}
                            </div>
                          ))}
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Total</div>
                        <div className=" flex text-primary">
                          {!address ? (
                            "0.00"
                          ) : data.availableRewards !== undefined ? (
                            formatAmount(data.availableRewards.toFixed(2))
                          ) : (
                            <SkeletonComponent />
                          )}
                          &nbsp;
                          {data.earningToken.symbol}
                        </div>
                        {data.reflection &&
                          (data.availableReflections ? (
                            data.availableReflections.map((t, index) => (
                              <div key={index} className="flex text-primary">
                                {!address ? (
                                  "0.00"
                                ) : data.availableReflections[index] !== undefined ? (
                                  formatAmount(data.availableReflections[index].toFixed(2))
                                ) : (
                                  <SkeletonComponent />
                                )}
                                &nbsp;
                                {data.reflectionTokens[index].symbol}
                              </div>
                            ))
                          ) : (
                            <SkeletonComponent />
                          ))}
                      </div>
                    </InfoPanel>
                  </div>
                </div>
                <div className="mt-7">
                  <ProgressBar
                    block={{ start: data.startBlock, end: data.endBlock, current: currentBlock }}
                    rewards={{
                      deposit:
                        data.depositBalance -
                        (data.earningToken.address?.toLowerCase() === data.stakingToken.address.toLowerCase()
                          ? data.totalStaked
                          : 0),
                      available: data.availableRewards,
                    }}
                  />
                </div>
                <div className="mt-10 flex h-[560px] w-full flex-col justify-between md:flex-row">
                  <div className="w-full md:w-[40%]">
                    <TotalStakedChart
                      data={graphData()}
                      symbol={
                        curGraph === 4 ? "" : curGraph !== 3 ? data.stakingToken.symbol : getNativeSybmol(data.chainId)
                      }
                      price={curGraph === 4 ? 1 : curGraph !== 3 ? tokenPrice : nativeTokenPrice}
                      curGraph={curGraph}
                    />
                    <InfoPanel
                      className="mt-[80px] flex cursor-pointer justify-between lg:mt-20"
                      type={"secondary"}
                      boxShadow={curGraph === 1 ? "primary" : null}
                      onClick={() => setCurGraph(1)}
                    >
                      <div>Total Staked Value</div>
                      <div className="flex">
                        {data.tvl || data.tvl === 0.0 ? `${formatTvl(data.tvl, 1)}` : <SkeletonComponent />}
                      </div>
                    </InfoPanel>
                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 2 ? "primary" : null}
                      onClick={() => setCurGraph(2)}
                    >
                      <div>
                        Token fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
                      </div>
                      <div className="flex">
                        {data.tokenFees !== undefined ? (
                          formatAmount(data.tokenFees[data.tokenFees.length - 1].toFixed(2))
                        ) : (
                          <SkeletonComponent />
                        )}
                        &nbsp;
                        <span className="text-primary">{data.stakingToken.symbol}</span>
                      </div>
                    </InfoPanel>
                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 3 ? "primary" : null}
                      onClick={() => setCurGraph(3)}
                    >
                      <div>
                        Performance fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
                      </div>
                      <div className="flex">
                        {data.performanceFees !== undefined ? (
                          data.performanceFees[data.performanceFees.length - 1].toFixed(4)
                        ) : (
                          <SkeletonComponent />
                        )}
                        &nbsp;<span className="text-primary">{getNativeSybmol(data.chainId)}</span>
                      </div>
                    </InfoPanel>

                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 4 ? "primary" : null}
                      onClick={() => setCurGraph(4)}
                    >
                      <div>
                        Staked addresses<span className="text-[#FFFFFF80]"> (24hrs)</span>
                      </div>
                      <div className="flex">
                        {data.stakedAddresses !== undefined ? (
                          numberWithCommas(data.stakedAddresses[data.stakedAddresses.length - 1])
                        ) : (
                          <SkeletonComponent />
                        )}
                      </div>
                    </InfoPanel>
                  </div>
                  <div className="relative mt-10 flex w-full flex-col justify-between md:mt-0 md:w-[57%]">
                    <div className="flex w-full flex-col xsm:flex-row">
                      <InfoPanel className="flex cursor-pointer justify-between" type={"secondary"}>
                        <div>My Staked Tokens</div>
                        <div className="flex">
                          {!address ? (
                            "0.00"
                          ) : accountData.stakedBalance ? (
                            `${formatAmount(getBalanceNumber(accountData.stakedBalance, stakingToken.decimals))}`
                          ) : (
                            <SkeletonComponent />
                          )}
                          &nbsp;
                          <span className="text-primary">{stakingToken.symbol}</span>
                        </div>
                      </InfoPanel>
                      <InfoPanel
                        className="mt-2 flex cursor-pointer justify-between xsm:ml-4 xsm:mt-0"
                        type={"secondary"}
                      >
                        <div>USD Value</div>
                        <div className="flex">
                          {!address ? (
                            "$0.00"
                          ) : accountData.stakedBalance ? (
                            `$${formatAmount(
                              getBalanceNumber(accountData.stakedBalance, stakingToken.decimals) * (tokenPrice ?? 0)
                            )}`
                          ) : (
                            <SkeletonComponent />
                          )}
                        </div>
                      </InfoPanel>
                    </div>
                    <div className="mt-8 flex w-full flex-col xsm:flex-row">
                      <div className="mr-0 flex-1 xsm:mr-[14px]">
                        <div className="text-xl text-[#FFFFFFBF]">Pool Rewards</div>
                        <div className="mt-1.5 h-[56px] w-full">
                          <StyledButton
                            type="teritary"
                            boxShadow={address && earningTokenBalance > 0}
                            disabled={
                              !address ||
                              earningTokenBalance === 0 ||
                              (data.enableEmergencyWithdraw && data.disableHarvest) ||
                              pending
                            }
                            onClick={onCompoundReward}
                          >
                            <div className="flex w-full items-center justify-between px-4">
                              <div className="flex">
                                Compound&nbsp;
                                {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                                  "0.00"
                                ) : accountData.earnings !== undefined ? (
                                  formatAmount(earningTokenBalance.toFixed(4))
                                ) : (
                                  <SkeletonComponent />
                                )}
                                <span className="text-primary">&nbsp;{data.earningToken.symbol}</span>
                              </div>
                              <div className="text-sm">${(+earningTokenBalance * tokenPrice).toFixed(2)}</div>
                            </div>
                          </StyledButton>
                        </div>
                        {data.harvest && (
                          <div className="mt-2 h-[56px] w-full">
                            <StyledButton
                              type="teritary"
                              boxShadow={address && earningTokenBalance > 0}
                              disabled={
                                !address ||
                                earningTokenBalance === 0 ||
                                (data.enableEmergencyWithdraw && data.disableHarvest) ||
                                pending
                              }
                              onClick={onHarvestReward}
                            >
                              <div className="flex w-full items-center justify-between px-4">
                                <div className="flex">
                                  Harvest&nbsp;
                                  {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                                    "0.00"
                                  ) : accountData.earnings !== undefined ? (
                                    formatAmount(earningTokenBalance.toFixed(4))
                                  ) : (
                                    <SkeletonComponent />
                                  )}
                                  <span className="text-primary">&nbsp;{data.earningToken.symbol}</span>
                                </div>
                                <div className="text-sm">${(+earningTokenBalance * tokenPrice).toFixed(2)}</div>
                              </div>
                            </StyledButton>
                          </div>
                        )}
                      </div>
                      {data.reflection && (
                        <div className="mt-5 flex-1 xsm:mt-0">
                          <div className="text-xl text-[#FFFFFFBF]">Pool Reflections</div>
                          {!data.noReflectionCompound && (
                            <div className="mt-1.5 h-[56px] w-full">
                              <StyledButton
                                type="teritary"
                                boxShadow={address && hasReflections}
                                disabled={
                                  !address ||
                                  !hasReflections ||
                                  (data.enableEmergencyWithdraw && data.disableHarvest) ||
                                  pending
                                }
                                onClick={onCompoundReflection}
                              >
                                <div className="flex w-full items-center justify-between px-4">
                                  <div className="flex">
                                    Compound&nbsp;
                                    {reflectionTokens.length > 1 ? (
                                      <span className="text-primary">&nbsp;Multiple</span>
                                    ) : (
                                      <>
                                        {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                                          "0.00"
                                        ) : accountData.reflections[0] !== undefined ? (
                                          formatAmount(reflectionTokenBalances[0].toFixed(4))
                                        ) : (
                                          <SkeletonComponent />
                                        )}
                                        <span className="text-primary">&nbsp;{data.reflectionTokens[0].symbol}</span>
                                      </>
                                    )}
                                  </div>
                                  <div className="text-sm">${reflectionUsdAmount.toFixed(2)}</div>
                                </div>
                              </StyledButton>
                            </div>
                          )}
                          <div className="mt-2 h-[56px] w-full">
                            <StyledButton
                              type="teritary"
                              boxShadow={address && hasReflections}
                              disabled={
                                !address ||
                                !hasReflections ||
                                (data.enableEmergencyWithdraw && data.disableHarvest) ||
                                pending
                              }
                              onClick={onHarvestReflection}
                            >
                              <div className="flex w-full items-center justify-between px-4">
                                <div className="flex">
                                  Harvest&nbsp;
                                  {reflectionTokens.length > 1 ? (
                                    <span className="text-primary">&nbsp;Multiple</span>
                                  ) : (
                                    <>
                                      {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                                        "0.00"
                                      ) : accountData.reflections[0] !== undefined ? (
                                        formatAmount(reflectionTokenBalances[0].toFixed(4))
                                      ) : (
                                        <SkeletonComponent />
                                      )}
                                      <span className="text-primary">&nbsp;{data.reflectionTokens[0].symbol}</span>
                                    </>
                                  )}
                                </div>
                                <div className="text-sm">${reflectionUsdAmount.toFixed(2)}</div>
                              </div>
                            </StyledButton>
                          </div>
                        </div>
                      )}
                    </div>
                    <StakingHistory
                      history={history}
                      type={data.poolCategory}
                      setPopulatedAmount={setPopulatedAmount}
                      onWithdraw={() => {
                        setCurType("withdraw");
                        setStakingModalOpen(true);
                      }}
                    />
                    <div className="relative mb-[150px] mt-2 flex h-12 w-full md:mb-0">
                      {data.chainId !== chainId ? (
                        <div className="flex-1">
                          <StyledButton
                            onClick={() => {
                              if (canSwitch) switchNetwork(data.chainId);
                            }}
                          >
                            Switch to {getNetworkLabel(data.chainId)}
                          </StyledButton>
                        </div>
                      ) : (
                        <>
                          <div className="mr-5 flex-1">
                            <StyledButton
                              onClick={() => {
                                setStakingModalOpen(true);
                                setCurType("deposit");
                              }}
                              disabled={pending || !address}
                            >
                              Deposit {data.stakingToken.symbol}
                            </StyledButton>
                          </div>
                          <div className="flex-1">
                            <StyledButton
                              type={"secondary"}
                              onClick={() => {
                                setStakingModalOpen(true);
                                setCurType("withdraw");
                              }}
                              disabled={pending || !address}
                            >
                              <div className="text-[#FFFFFFBF]">
                                Withdraw <span className="text-primary">{data.stakingToken.symbol}</span>
                              </div>
                            </StyledButton>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Container>
            )}
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
};

export default StakingDetail;

const InfoPanel = styled.div<{ padding?: string; type?: string; boxShadow?: string }>`
  background: ${({ type }) => (type === "secondary" ? "rgba(185, 184, 184, 0.1)" : "rgba(185, 184, 184, 0.05)")};
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  align-items: center;
  padding: ${({ padding, type }) => (type === "secondary" ? "12px 15px" : padding)};
  width: 100%;
  color: #ffffffbf;
  box-shadow: ${({ boxShadow }) =>
    boxShadow === "primary" ? "0px 0px 4px #EEBB19" : boxShadow === "secondary" ? "0px 0px 4px #EEBB19" : ""};
  :hover {
    border-color: ${({ type, boxShadow }) =>
      type === "secondary" && !boxShadow ? "#EEBB19" : "rgba(255, 255, 255, 0.5)"};
  }
`;
