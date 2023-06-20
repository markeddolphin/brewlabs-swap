/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { WNATIVE } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { chevronLeftSVG, lockSVG } from "components/dashboard/assets/svgs";
import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import TokenLogo from "@components/logo/TokenLogo";
import { SkeletonComponent } from "components/SkeletonComponent";
import WordHighlight from "components/text/WordHighlight";

import { AppId, Chef } from "config/constants/types";
import { CHAIN_ICONS } from "config/constants/networks";
import { earningTokens, quoteTokens, tokens } from "config/constants/tokens";
import { DashboardContext } from "contexts/DashboardContext";
import { useTranslation } from "contexts/localization";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { getNativeSybmol, getNetworkLabel } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/farms";
import { useLpTokenPrices } from "state/lpPrices/hooks";
import { useAppId, useFarmLpAprs } from "state/zap/hooks";
import {
  fetchApeFarmUserDataAsync,
  fetchApeFarmsPublicDataAsync,
  fetchFarmsPublicDataAsync,
  fetchSushiFarmUserDataAsync,
  fetchSushiFarmsPublicDataAsync,
} from "state/zap";
import { useSushiPrice } from "state/zap/sushiswap/hooks";
import { numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import useHarvestFarm from "./hooks/useHarvestFarm";
import useTotalStakedHistory from "./hooks/useTotalStakedHistory";
import { usePerformanceFee } from "./hooks/useStakeFarms";

import ZapInModal from "./Modals/ZapInModal";
import ZapOutModal from "./Modals/ZapOutModal";
// import StakingHistory from "./FarmingHistory";
// import StakingModal from "./Modals/StakingModal";
import ProgressBar from "./ProgressBar";
import StyledButton from "../StyledButton";
import TotalStakedChart from "./TotalStakedChart";
import { RewardType } from "./types";

const ZapperDetail = ({ detailDatas }: { detailDatas: any }) => {
  const { open, setOpen, data, cakePrice, bananaPrice } = detailDatas;
  const { lpAddress, pid, chef, appId, lpSymbol, chainId, token, quoteToken } = data;

  const { history } = useTotalStakedHistory(data);
  const performanceFee = usePerformanceFee(data.chainId);
  const [, setAppId] = useAppId();

  const [zapInModalOpen, setZapInModalOpen] = useState(false);
  const [zapOutModalOpen, setZapOutModalOpen] = useState(false);
  const [curGraph, setCurGraph] = useState(0);

  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { chainId: activeChainId } = useActiveChainId();
  const { canSwitch, switchNetwork } = useSwitchNetwork();
  const { pending, setPending }: any = useContext(DashboardContext);

  const dispatch = useAppDispatch();

  const { data: sushiPrice } = useSushiPrice();

  const prices = {
    [AppId.PANCAKESWAP]: cakePrice.toNumber(),
    [AppId.APESWAP]: bananaPrice,
    [AppId.SUSHISWAP]: sushiPrice,
  };

  const [tokenId, setTokenId] = useState<number>(0);

  useEffect(() => {
    setAppId(data.appId);
  }, [data.appId]);

  const { onReward } = useHarvestFarm(chef ?? Chef.MASTERCHEF, pid, [
    earningTokens[appId].address,
    quoteTokens[chainId][tokenId].address,
    lpAddress,
  ]);

  const { lpTokenPrices } = useLpTokenPrices();
  const farmLpAprs = useFarmLpAprs();

  const handleHarvest = async (rewardType: RewardType) => {
    setPending(true);

    try {
      await onReward(rewardType);

      toast.success(
        t(
          rewardType === RewardType.EARNING_TOKEN
            ? `Your %symbol% earnings have been sent to your wallet!`
            : rewardType === RewardType.QUOTE_TOKEN
            ? `Your %symbol% earnings have been converted and sent to your wallet!`
            : `Your %symbol% earnings have been re-invested!`,
          {
            symbol: earningTokens[appId].symbol,
          }
        )
      );
    } catch (e: any) {
      toast.error(e.message.split("(")[0]);
      console.error(e);
    } finally {
      setPending(false);
    }

    if (appId === AppId.PANCAKESWAP) {
      dispatch(fetchFarmUserDataAsync({ account, chainId, pids: [pid] }));
      dispatch(fetchFarmsPublicDataAsync([pid]));
    } else if (appId === AppId.APESWAP) {
      dispatch(fetchApeFarmUserDataAsync(chainId, account));
      dispatch(
        fetchApeFarmsPublicDataAsync(chainId, lpTokenPrices, new BigNumber(bananaPrice), farmLpAprs[AppId.APESWAP])
      );
    } else if (appId === AppId.SUSHISWAP) {
      dispatch(fetchSushiFarmUserDataAsync(account));
      dispatch(fetchSushiFarmsPublicDataAsync(chainId));
    }
  };

  return (
    <>
      <ZapInModal open={zapInModalOpen} setOpen={setZapInModalOpen} data={data} />
      <ZapOutModal open={zapOutModalOpen} setOpen={setZapOutModalOpen} data={data} />

      <AnimatePresence exitBeforeEnter>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute left-0 top-0 max-h-screen w-full overflow-y-scroll pb-[150px]">
              <PageHeader
                title={
                  <div className="text-[40px]">
                    <WordHighlight content="Zapper Pools" />
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
                        <div className="mt-2 block h-[32px] w-[140px] sm:mt-0 sm:hidden">
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
                        <div className="hidden w-full max-w-[470px] sm:block">
                          <div className="mt-2 h-[32px] w-[140px] sm:mt-0">
                            <StyledButton>
                              <div className="absolute left-2 top-2.5">{lockSVG}</div>
                              <div className="ml-3">Brewlabs Custody</div>
                            </StyledButton>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="ml-3 flex w-full max-w-fit flex-col justify-end sm:ml-[30px] sm:max-w-[520px] sm:flex-row">
                        <a
                          className="ml-0 mt-2 h-[32px] w-[140px] sm:ml-5 sm:mt-0"
                          target="_blank"
                          href={`/add/${data.chainId}/${
                            quoteToken.isNative || quoteToken.symbol === WNATIVE[data.chainId].symbol
                              ? getNativeSybmol(data.chainId)
                              : quoteToken.address
                          }/${
                            token.isNative || token.symbol === WNATIVE[data.chainId].symbol
                              ? getNativeSybmol(data.chainId)
                              : token.address
                          }`}
                          rel="noreferrer"
                        >
                          <StyledButton>
                            <div>Make LP</div>
                            <div className="absolute right-2 top-[7px] -scale-100">{chevronLeftSVG}</div>
                          </StyledButton>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
                    <div className="mb-4 mt-4 flex w-[160px] items-center justify-center md:mb-0">
                      <TokenLogo
                        src={getTokenLogoURL(data.token.address, data.token.chainId, data.token.logo, data.appId)}
                        classNames="w-[70px]"
                        large
                      />
                      <TokenLogo
                        src={getTokenLogoURL(
                          data.quoteToken.address,
                          data.quoteToken.chainId,
                          data.quoteToken.logo,
                          data.appId
                        )}
                        classNames="-ml-3 w-[70px]"
                        large
                      />                      
                    </div>
                    <div className="flex flex-1 flex-wrap justify-end xl:flex-nowrap">
                      <InfoPanel
                        padding={"14px 25px 8px 25px"}
                        className="relative mt-4 max-w-full md:max-w-[520px] xl:md:max-w-[470px]"
                      >
                        <div className="flex justify-between text-xl">
                          <div>
                            Pool: <span className="text-primary">{data.lpSymbol}</span>
                          </div>
                          <div className="flex">
                            APR:&nbsp;
                            <span className="text-primary">
                              {data.apr !== undefined ? `${data.apr.toFixed(2)}%` : <SkeletonComponent />}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-base  text-[#FFFFFF80]">
                          <div>
                            Stake: <span className="text-primary">{data.lpSymbol}</span> earn{" "}
                            <span className="text-primary">{data.earningToken.symbol}</span>
                          </div>
                          <div className="text-primary">Flexible</div>
                        </div>
                        <div className="text-xs text-[#FFFFFF80]">
                          Deposit Fee 0.00%
                          <br />
                          Withdraw Fee 0.00%
                          <br />
                          Peformance Fee {performanceFee
                            ? ethers.utils.formatEther(performanceFee.toString())
                            : "0.00"}{" "}
                          {getNativeSybmol(data.chainId)}
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
                            <span className="text-primary">{data.earningToken.symbol}</span> earned
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-xl">Pending</div>
                          {data.userData !== undefined ? (
                            <div className=" flex text-primary">
                              {!account
                                ? "0.00"
                                : (Number(data.userData.earnings) / Math.pow(10, data.earningToken.decimals)).toFixed(
                                    2
                                  )}
                              &nbsp;
                              {data.earningToken.symbol}
                            </div>
                          ) : (
                            <SkeletonComponent />
                          )}
                          {prices[data.appId] && data.userData !== undefined ? (
                            <div className="text-primary">
                              $
                              {(
                                (prices[data.appId] * Number(data.userData.earnings)) /
                                Math.pow(10, data.earningToken.decimals)
                              ).toFixed(2)}
                              &nbsp;
                              <span className="text-[#FFFFFF80]">earned</span>
                            </div>
                          ) : (
                            <SkeletonComponent />
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="text-xl">Total</div>
                          <div className=" flex text-primary">
                            {!account
                              ? "0.00"
                              : (Number(data.totalRewards) / Math.pow(10, data.earningToken.decimals)).toFixed(2)}
                            &nbsp;
                            {data.earningToken.symbol}
                          </div>
                          {prices[data.appId] ? (
                            <div className="text-primary">
                              $
                              {(
                                (prices[data.appId] * Number(data.totalRewards)) /
                                Math.pow(10, data.earningToken.decimals)
                              ).toFixed(2)}
                            </div>
                          ) : (
                            <SkeletonComponent />
                          )}
                        </div>
                      </InfoPanel>
                    </div>
                  </div>
                  <div className="mt-7">
                    <ProgressBar endBlock={1} remaining={0} />
                  </div>
                  <div className="mt-10 flex w-full flex-col justify-between md:flex-row">
                    <div className="w-full md:w-[40%]">
                      <TotalStakedChart data={history} symbol={lpSymbol} />
                      <InfoPanel
                        className="mt-20 flex cursor-pointer justify-between"
                        type={"secondary"}
                        boxShadow={curGraph === 0 ? "primary" : null}
                      >
                        <div>Total Zapper Position Value</div>
                        <div className="flex">
                          {history !== undefined && history.length ? (
                            `$${numberWithCommas(history[history.length - 1].toFixed(2))}`
                          ) : (
                            <SkeletonComponent />
                          )}
                        </div>
                      </InfoPanel>
                    </div>
                    <div className="relative mt-10 w-full md:mt-0 md:w-[57%]">
                      <div className="flex w-full flex-col xsm:flex-row">
                        <div className="mr-0 flex-1 xsm:mr-[14px]">
                          <div className="text-xl text-[#FFFFFFBF]">Pool Rewards</div>

                          <div className="mt-2 h-[56px] w-full">
                            <StyledButton
                              type="teritary"
                              boxShadow={!(!account || !data.userData || !Number(data.userData.earnings))}
                              disabled={!account || !data.userData || !Number(data.userData.earnings) || pending}
                              onClick={() => handleHarvest(RewardType.EARNING_TOKEN)}
                            >
                              <div className="flex text-sm">
                                Harvest&nbsp;
                                {!account || !data.userData ? 0 : Number(data.userData.earnings).toFixed(2)}
                                <span className="text-primary">&nbsp;{data.earningToken.symbol}</span>
                              </div>
                            </StyledButton>
                          </div>
                        </div>
                        <div className="mt-5 flex-1 xsm:mt-0">
                          <div className="text-xl text-[#FFFFFFBF]">Alternative</div>
                          <div className="mt-1.5 h-[56px] w-full">
                            <StyledButton
                              type="teritary"
                              disabled={!data.userData || !Number(data.userData.earnings) || pending}
                              boxShadow={!(!data.userData || !Number(data.userData.earnings))}
                              onClick={() => {
                                setTokenId(0);
                                handleHarvest(RewardType.QUOTE_TOKEN);
                              }}
                            >
                              <div className="whitespace-nowrap text-sm">
                                Convert
                                {data.userData !== undefined ? (
                                  <span className="text-primary">
                                    &nbsp;{Number(data.userData.earnings).toFixed(0)} {data.earningToken.symbol}&nbsp;
                                  </span>
                                ) : (
                                  <SkeletonComponent />
                                )}
                                &nbsp;to&nbsp;
                                {prices[data.appId] && data.userData !== undefined ? (
                                  <span className="text-primary">
                                    ${(prices[data.appId] * data.userData.earnings).toFixed(2)}{" "}
                                    {data.chainId === 1 ? "USDC" : "BUSD"}
                                  </span>
                                ) : (
                                  <SkeletonComponent />
                                )}
                              </div>
                            </StyledButton>
                          </div>
                          <div className="mt-1.5 h-[56px] w-full">
                            <StyledButton
                              type="teritary"
                              disabled={!data.userData || !Number(data.userData.earnings) || pending}
                              boxShadow={!(!data.userData || !Number(data.userData.earnings))}
                              onClick={() => {
                                setTokenId(1);
                                handleHarvest(RewardType.QUOTE_TOKEN);
                              }}
                            >
                              <div className="whitespace-nowrap text-sm">
                                Convert
                                {data.userData !== undefined ? (
                                  <span className="text-primary">
                                    &nbsp;{Number(data.userData.earnings).toFixed(0)} {data.earningToken.symbol}&nbsp;
                                  </span>
                                ) : (
                                  <SkeletonComponent />
                                )}
                                &nbsp;to&nbsp;
                                {prices[data.appId] && data.userData !== undefined ? (
                                  <span className="text-primary">
                                    ${(prices[data.appId] * data.userData.earnings).toFixed(2)} USDT
                                  </span>
                                ) : (
                                  <SkeletonComponent />
                                )}
                              </div>
                            </StyledButton>
                          </div>
                        </div>
                      </div>
                      <div className="mt-7">{/* <StakingHistory history={history} /> */}</div>
                      <div className="absolute bottom-0 left-0 flex h-12 w-full">
                        {data.chainId !== activeChainId ? (
                          <StyledButton
                            onClick={() => {
                              if (canSwitch) switchNetwork(data.chainId);
                            }}
                          >
                            Switch to {getNetworkLabel(data.chainId)}
                          </StyledButton>
                        ) : (
                          <>
                            <div className="mr-5 flex-1">
                              <StyledButton
                                onClick={() => {
                                  setZapInModalOpen(true);
                                }}
                                disabled={pending || !account}
                              >
                                Zap in {data.lpSymbol}
                              </StyledButton>
                            </div>
                            <div className="flex-1">
                              <StyledButton
                                type={"secondary"}
                                onClick={() => {
                                  setZapOutModalOpen(true);
                                }}
                                disabled={pending || !account}
                              >
                                <div className="text-[#FFFFFFBF]">
                                  Zap out <span className="text-primary">{data.lpSymbol}</span>
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
    </>
  );
};

export default ZapperDetail;

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
