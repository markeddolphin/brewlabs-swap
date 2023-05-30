/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { WNATIVE } from "@brewlabs/sdk";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { chevronLeftSVG, LinkSVG, lockSVG, warningFarmerSVG } from "components/dashboard/assets/svgs";
import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import { SkeletonComponent } from "components/SkeletonComponent";
import WordHighlight from "components/text/WordHighlight";

import { CHAIN_ICONS } from "config/constants/networks";
import { Version } from "config/constants/types";
import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import useTokenPrice, { useTokenPrices } from "hooks/useTokenPrice";
import { getExplorerLink, getNativeSybmol, getNetworkLabel, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync, setFarmsPublicData, setFarmUserData } from "state/farms";
import { fetchFarmUserDeposits } from "state/farms/fetchFarmUser";
import { fetchFarmFeeHistories, fetchFarmTotalRewards } from "state/farms/fetchPublicFarmData";
import { BIG_ZERO } from "utils/bigNumber";
import { formatAmount, formatTvl } from "utils/formatApy";
import { getBalanceNumber } from "utils/formatBalance";
import { numberWithCommas } from "utils/functions";
import getCurrencyId from "utils/getCurrencyId";
import getTokenLogoURL from "utils/getTokenLogoURL";

import StyledButton from "../StyledButton";
import ProgressBar from "./ProgressBar";
import TotalStakedChart from "./TotalStakedChart";
import StakingHistory from "./FarmingHistory";
import StakingModal from "./Modals/StakingModal";
import useFarm from "./hooks/useFarm";
import { BASE_URL } from "config";
import useFarmImpl from "./hooks/useFarmImpl";

const FarmingDetail = ({ detailDatas }: { detailDatas: any }) => {
  const { open, setOpen, data } = detailDatas;
  const dispatch = useAppDispatch();

  const { userData: accountData, token, quoteToken, earningToken, reflectionToken } = data;

  const [stakingModalOpen, setStakingModalOpen] = useState(false);
  const [curType, setCurType] = useState("deposit");
  const [curGraph, setCurGraph] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const { address } = useAccount();
  const { chainId } = useActiveChainId();
  const { canSwitch, switchNetwork } = useSwitchNetwork();
  const { pending, setPending }: any = useContext(DashboardContext);

  const lpPrice = useTokenPrice(data.chainId, data.lpAddress, true);
  const nativeTokenPrice = useTokenPrice(data.chainId, WNATIVE[data.chainId].address);
  const tokenPrices = useTokenPrices();

  const { onReward, onHarvest, onCompound, onHarvestDividend, onCompoundDividend } = useFarm(
    data.poolId,
    data.farmId,
    data.chainId,
    data.contractAddress,
    data.performanceFee,
    data.enableEmergencyWithdraw
  );

  const {
    onHarvest: onHarvestImpl,
    onCompound: onCompoundImpl,
    onHarvestDividend: onHarvestDividendImpl,
    onCompoundDividend: onCompoundDividendImpl,
  } = useFarmImpl(
    data.poolId,
    data.farmId,
    data.chainId,
    data.contractAddress,
    data.performanceFee,
    data.enableEmergencyWithdraw
  );

  useEffect(() => {
    const fetchtotalRewardsAsync = async () => {
      const { availableRewards, availableReflections } = await fetchFarmTotalRewards(data);
      dispatch(setFarmsPublicData([{ pid: data.pid, availableRewards, availableReflections }]));
    };

    const fetchFeeHistoriesAsync = async () => {
      const { performanceFees, stakedAddresses } = await fetchFarmFeeHistories(data);

      dispatch(
        setFarmsPublicData([
          {
            pid: data.pid,
            performanceFees: performanceFees,
            stakedAddresses: stakedAddresses,
          },
        ])
      );
    };

    fetchtotalRewardsAsync();
    fetchFeeHistoriesAsync();
  }, [data.pid]);

  useEffect(() => {
    const fetchDepositHistoryAsync = async () => {
      const res = await fetchFarmUserDeposits(data, address);
      dispatch(setFarmUserData([res]));
    };

    if (address) {
      dispatch(fetchFarmUserDataAsync({ account: address, chainId: data.chainId, pids: [data.pid] }));
      fetchDepositHistoryAsync();
    }
  }, [address, data.pid]);

  const graphData = () => {
    let _graphData;
    switch (curGraph) {
      case 2:
        return data.performanceFees ?? [];
      case 3:
        return data.stakedAddresses ?? [];
      default:
        _graphData = data.TVLData ?? [];
        _graphData = _graphData.map((v) => +v);
        if (data.tvl) _graphData.push(data.totalStaked.toNumber());
        return _graphData;
    }
  };

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleHarvest = async () => {
    setPending(true);
    try {
      if (data.version > Version.V2) {
        if (data.category) {
          await onHarvestImpl();
        } else {
          await onHarvest();
        }
      } else {
        await onReward();
      }
      dispatch(fetchFarmUserDataAsync({ account: address, chainId: data.chainId, pids: [data.pid] }));
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const handleHarvestDividned = async () => {
    setPending(true);
    try {
      if (data.category) {
        await onHarvestDividendImpl();
      } else {
        await onHarvestDividend();
      }
      dispatch(fetchFarmUserDataAsync({ account: address, chainId: data.chainId, pids: [data.pid] }));
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const handleCompound = async () => {
    setPending(true);
    try {
      if (data.category) {
        await onCompoundImpl();
      } else {
        await onCompound();
      }
      dispatch(fetchFarmUserDataAsync({ account: address, chainId: data.chainId, pids: [data.pid] }));
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const handleCompoundDividend = async () => {
    setPending(true);
    try {
      if (data.category) {
        await onCompoundDividendImpl();
      } else {
        await onCompoundDividend();
      }
      dispatch(fetchFarmUserDataAsync({ account: address, chainId: data.chainId, pids: [data.pid] }));
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onShareFarm = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(`${BASE_URL}${location.pathname}`);
  };

  const history =
    data && data.userData?.deposits && address
      ? data.userData?.deposits.map((deposit) => ({ ...deposit, symbol: data.lpSymbol.split("_")[0] }))
      : [];

  const earningTokenBalance = getBalanceNumber(accountData.earnings ?? BIG_ZERO, earningToken.decimals);
  const reflectionTokenBalance = getBalanceNumber(accountData.reflections ?? BIG_ZERO, reflectionToken?.decimals ?? 18);

  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute left-0 top-0 max-h-screen w-full overflow-y-scroll  pb-[150px]">
            {address && data ? (
              <StakingModal
                open={stakingModalOpen}
                setOpen={setStakingModalOpen}
                type={curType}
                data={data}
                accountData={accountData}
              />
            ) : (
              ""
            )}
            <PageHeader
              title={
                <div className="text-[40px]">
                  <WordHighlight content="Yield Farming" />
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
                      <StyledButton onClick={() => setOpen(false)}>
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
                      <StyledButton onClick={() => setOpen(false)}>
                        <div className="absolute left-2 top-[7px]">{chevronLeftSVG}</div>
                        <div className="ml-2">Back to pool list</div>
                      </StyledButton>
                    </div>
                    {data.isCustody ? (
                      <div className="mt-2 block h-[32px] w-[140px] lg:mt-0 lg:hidden">
                        <StyledButton>
                          <div className="absolute left-2 top-2.5">{lockSVG}</div>
                          <div className="ml-3">Brewlabs Custody</div>
                        </StyledButton>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex flex-1 justify-end">
                    {data.isCustody ? (
                      <div className="hidden w-full max-w-[470px] lg:block">
                        <div className="ml-5 mt-2 h-[32px] w-[140px] lg:mt-0">
                          <StyledButton>
                            <div className="absolute left-2 top-2.5">{lockSVG}</div>
                            <div className="ml-3">Brewlabs Custody</div>
                          </StyledButton>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="ml-3 flex w-full max-w-fit flex-col justify-end lg:ml-5 lg:max-w-[520px] lg:flex-row">
                      <StyledButton
                        className="relative mb-2 mr-0 h-8 w-[140px] rounded-md border border-primary bg-[#B9B8B81A] font-roboto text-sm font-bold text-primary shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition hover:border-white  hover:text-white lg:mb-0 lg:mr-5"
                        type={"default"}
                        onClick={onShareFarm}
                      >
                        <div className="flex items-center">
                          <div className="mr-1.5">{isCopied ? "Copied" : "Share Farm"}</div> {LinkSVG}
                        </div>
                      </StyledButton>
                      {earningToken.projectLink && (
                        <a
                          className="h-[32px] w-[140px]"
                          href={earningToken.projectLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <StyledButton>
                            <div>Website</div>
                            <div className="absolute right-2 top-2.5 scale-125">{LinkSVG}</div>
                          </StyledButton>
                        </a>
                      )}
                      <Link
                        href={`/add/${data.chainId}/${
                          quoteToken.isNative || quoteToken.symbol === WNATIVE[data.chainId].symbol
                            ? getNativeSybmol(data.chainId)
                            : quoteToken.address
                        }/${
                          token.isNative || token.symbol === WNATIVE[data.chainId].symbol
                            ? getNativeSybmol(data.chainId)
                            : token.address
                        }`}
                        passHref
                      >
                        <div className="ml-0 mt-2 h-[32px] w-[140px] lg:ml-5 lg:mt-0">
                          <StyledButton>
                            <div>Make LP</div>
                            <div className="absolute right-2 top-[7px] -scale-100">{chevronLeftSVG}</div>
                          </StyledButton>
                        </div>
                      </Link>
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
                          Pool: <span className="text-primary">{data.lpSymbol.split(" ")[0]}</span>
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
                          Stake: <span className="text-primary">{data.lpSymbol.split(" ")[0]}</span> earn{" "}
                          <span className="text-primary">{earningToken.symbol}</span>
                        </div>
                        <div className="text-primary">Flexible</div>
                      </div>
                      <div className="text-xs text-[#FFFFFF80]">
                        Deposit Fee {(+data.depositFee).toFixed(2)}%
                        <div className="tooltip" data-tip="Deposit fees are sent to token owner nominated address.">
                          <div className="ml-1 mt-[2px]">{warningFarmerSVG("11px")}</div>
                        </div>
                        <br />
                        Withdraw Fee {(+data.withdrawFee).toFixed(2)}%
                        <div className="tooltip" data-tip="Withdraw fees are sent to token owner nominated address.">
                          <div className="ml-1 mt-[2px]">{warningFarmerSVG("11px")}</div>
                        </div>
                        <br />
                        Peformance Fee {data.performanceFee ? data.performanceFee / Math.pow(10, 18) : "0.00"}{" "}
                        {getNativeSybmol(data.chainId)}
                        <div
                          className="tooltip"
                          data-tip="Performance fee is charged per transaction to the Brewlabs Treasury (Brewlabs holders)."
                        >
                          <div className="ml-1 mt-[2px]">{warningFarmerSVG("11px")}</div>
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
                        {reflectionToken && (
                          <div className="text-[#FFFFFF80]">
                            <span className="text-primary">{reflectionToken.symbol}</span> Rewards
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Pending</div>
                        <div className=" flex text-primary">
                          {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                            "0.00"
                          ) : accountData.earnings !== undefined ? (
                            formatAmount(earningTokenBalance.toFixed(4))
                          ) : (
                            <SkeletonComponent />
                          )}
                          &nbsp;
                          {earningToken.symbol}
                        </div>
                        {reflectionToken && (
                          <div className="flex text-primary">
                            {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                              "0.00"
                            ) : accountData.reflections ? (
                              formatAmount(reflectionTokenBalance.toFixed(4))
                            ) : (
                              <SkeletonComponent />
                            )}
                            &nbsp;
                            {reflectionToken.symbol}
                          </div>
                        )}
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
                          {earningToken.symbol}
                        </div>
                        {reflectionToken && (
                          <div className=" flex text-primary">
                            {!address ? (
                              "0.00"
                            ) : data.availableReflections !== undefined ? (
                              formatAmount(data.availableReflections.toFixed(2))
                            ) : (
                              <SkeletonComponent />
                            )}
                            &nbsp;
                            {reflectionToken.symbol}
                          </div>
                        )}
                      </div>
                    </InfoPanel>
                  </div>
                </div>
                <div className="mt-7">
                  <ProgressBar endBlock={1} remaining={0} />
                </div>
                <div className="mt-10 flex h-[500px] w-full flex-col justify-between md:flex-row">
                  <div className="w-full md:w-[40%]">
                    <TotalStakedChart
                      data={graphData()}
                      symbol={
                        curGraph === 3
                          ? ""
                          : curGraph !== 2
                          ? data.lpSymbol.split(" ")[0]
                          : getNativeSybmol(data.chainId)
                      }
                      price={curGraph === 3 ? 1 : curGraph !== 2 ? lpPrice : nativeTokenPrice}
                      curGraph={curGraph}
                    />
                    <InfoPanel
                      className="mt-[80px] flex cursor-pointer justify-between lg:mt-20"
                      type={"secondary"}
                      boxShadow={curGraph === 0 ? "primary" : null}
                      onClick={() => setCurGraph(0)}
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
                      boxShadow={curGraph === 3 ? "primary" : null}
                      onClick={() => setCurGraph(3)}
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
                        <div className="flex ">
                          {!address ? (
                            "0.00"
                          ) : accountData.stakedBalance ? (
                            `${formatAmount(getBalanceNumber(accountData.stakedBalance, 18))}`
                          ) : (
                            <SkeletonComponent />
                          )}
                          &nbsp;
                          <span className="w-[80px] overflow-hidden text-ellipsis whitespace-nowrap text-primary">
                            {data.lpSymbol.split(" ")[0]}
                          </span>
                        </div>
                      </InfoPanel>
                      <InfoPanel
                        className="mt-2 flex cursor-pointer justify-between xsm:ml-4 xsm:mt-0"
                        type={"secondary"}
                      >
                        <div>USD Value</div>
                        <div className="flex">
                          {!address || !lpPrice ? (
                            "$0.00"
                          ) : accountData.stakedBalance ? (
                            `$${formatAmount(getBalanceNumber(accountData.stakedBalance, 18) * (lpPrice ?? 0))}`
                          ) : (
                            <SkeletonComponent />
                          )}
                        </div>
                      </InfoPanel>
                    </div>
                    <div className="mt-8 flex w-full flex-col xsm:flex-row">
                      <div className="mr-0 flex-1 xsm:mr-[14px]">
                        <div className="text-xl text-[#FFFFFFBF]">Pool Rewards</div>
                        <div className="mt-2 h-[56px]">
                          <StyledButton
                            type="teritary"
                            boxShadow={address && earningTokenBalance > 0}
                            disabled={
                              !address ||
                              earningTokenBalance === 0 ||
                              (data.enableEmergencyWithdraw && data.disableHarvest) ||
                              pending
                            }
                            onClick={handleHarvest}
                          >
                            <div className="flex w-full items-center justify-between px-4">
                              <div className="flex">
                                Harvest&nbsp;
                                {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                                  0
                                ) : accountData.earnings !== undefined ? (
                                  formatAmount(earningTokenBalance.toFixed(4))
                                ) : (
                                  <SkeletonComponent />
                                )}
                                <span className="text-primary">&nbsp;{earningToken.symbol}</span>
                              </div>
                              <div className="text-sm">
                                $
                                {(
                                  earningTokenBalance *
                                  (tokenPrices[getCurrencyId(data.chainId, earningToken.address)] ?? 0)
                                ).toFixed(2)}
                              </div>
                            </div>
                          </StyledButton>
                        </div>
                        {data.compound && (
                          <div className="mt-2 h-[56px]">
                            <StyledButton
                              type="teritary"
                              boxShadow={address && earningTokenBalance > 0}
                              disabled={
                                !address ||
                                earningTokenBalance === 0 ||
                                (data.enableEmergencyWithdraw && data.disableHarvest) ||
                                pending
                              }
                              onClick={handleCompound}
                            >
                              <div className="flex w-full items-center justify-between px-4">
                                <div className="flex">
                                  Compound&nbsp;
                                  {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                                    0
                                  ) : accountData.earnings !== undefined ? (
                                    formatAmount(earningTokenBalance.toFixed(4))
                                  ) : (
                                    <SkeletonComponent />
                                  )}
                                  <span className="text-primary">&nbsp;{earningToken.symbol}</span>
                                </div>
                                <div className="text-sm">
                                  $
                                  {(
                                    earningTokenBalance *
                                    (tokenPrices[getCurrencyId(data.chainId, earningToken.address)] ?? 0)
                                  ).toFixed(2)}
                                </div>
                              </div>
                            </StyledButton>
                          </div>
                        )}
                      </div>

                      <div className="mr-0 flex-1 xsm:mr-[14px]">
                        {reflectionToken && data.version > Version.V2 && (
                          <>
                            <div className="text-xl text-[#FFFFFFBF]">Pool Reflections</div>
                            <div className="mt-2 h-[56px]">
                              <StyledButton
                                type="teritary"
                                boxShadow={address && reflectionTokenBalance > 0}
                                disabled={
                                  !address ||
                                  reflectionTokenBalance === 0 ||
                                  (data.enableEmergencyWithdraw && data.disableHarvest) ||
                                  pending
                                }
                                onClick={handleHarvestDividned}
                              >
                                <div className="flex w-full items-center justify-between px-4">
                                  <div className="flex">
                                    Harvest&nbsp;
                                    {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                                      0
                                    ) : accountData.reflections !== undefined ? (
                                      formatAmount(reflectionTokenBalance.toFixed(4))
                                    ) : (
                                      <SkeletonComponent />
                                    )}
                                    <span className="text-primary">&nbsp;{reflectionToken.symbol}</span>
                                  </div>
                                  <div className="text-sm">
                                    $
                                    {(
                                      reflectionTokenBalance *
                                      (tokenPrices[getCurrencyId(data.chainId, reflectionToken.address)] ?? 0)
                                    ).toFixed(2)}
                                  </div>
                                </div>
                              </StyledButton>
                            </div>
                            {data.compoundRelection && (
                              <div className="mt-2 h-[56px]">
                                <StyledButton
                                  type="teritary"
                                  boxShadow={address && reflectionTokenBalance > 0}
                                  disabled={
                                    !address ||
                                    reflectionTokenBalance === 0 ||
                                    (data.enableEmergencyWithdraw && data.disableHarvest) ||
                                    pending
                                  }
                                  onClick={handleCompoundDividend}
                                >
                                  <div className="flex w-full items-center justify-between px-4">
                                    <div className="flex">
                                      Compound&nbsp;
                                      {!address || (data.enableEmergencyWithdraw && data.disableHarvest) ? (
                                        0
                                      ) : accountData.reflections !== undefined ? (
                                        formatAmount(reflectionTokenBalance.toFixed(4))
                                      ) : (
                                        <SkeletonComponent />
                                      )}
                                      <span className="text-primary">&nbsp;{reflectionToken.symbol}</span>
                                    </div>
                                    <div className="text-sm">
                                      $
                                      {(
                                        reflectionTokenBalance *
                                        (tokenPrices[getCurrencyId(data.chainId, reflectionToken.address)] ?? 0)
                                      ).toFixed(2)}
                                    </div>
                                  </div>
                                </StyledButton>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <StakingHistory history={history} />
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
                              Deposit {data.lpSymbol.split(" ")[0]}
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
                                Withdraw <span className="text-primary">{data.lpSymbol.split(" ")[0]}</span>
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
      )}
    </AnimatePresence>
  );
};

export default FarmingDetail;

const InfoPanel = styled.div<{ padding?: string; type?: string; boxShadow?: string }>`
  background: ${({ type }) => (type === "secondary" ? "rgba(185, 184, 184, 0.1)" : "rgba(185, 184, 184, 0.05)")};
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: ${({ padding, type }) => (type === "secondary" ? "12px 15px" : padding)};
  width: 100%;
  color: #ffffffbf;
  box-shadow: ${({ boxShadow }) =>
    boxShadow === "primary" ? "0px 2px 4px #EEBB19" : boxShadow === "secondary" ? "0px 1px 4px #EEBB19" : ""};
  :hover {
    border-color: ${({ type, boxShadow }) =>
      type === "secondary" && !boxShadow ? "#EEBB19" : "rgba(255, 255, 255, 0.5)"};
  }
`;
