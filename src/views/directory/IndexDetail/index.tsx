/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { WNATIVE } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useAccount } from "wagmi";
import styled from "styled-components";

import "react-tooltip/dist/react-tooltip.css";

import { chevronLeftSVG, LinkSVG, warningFarmerSVG } from "components/dashboard/assets/svgs";
import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import { SkeletonComponent } from "components/SkeletonComponent";
import WordHighlight from "components/text/WordHighlight";

import { CHAIN_ICONS } from "config/constants/networks";
import { DashboardContext } from "contexts/DashboardContext";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import useTokenPrice from "hooks/useTokenPrice";
import { getNativeSybmol, getNetworkLabel, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { fetchIndexFeeHistories } from "state/indexes/fetchIndexes";
import {
  fetchIndexUserHistoryDataAsync,
  setIndexesPublicData,
  updateNftAllowance,
  updateUserBalance,
  updateUserNftInfo,
  updateUserStakings,
} from "state/indexes";
import { formatDollar, getIndexName, numberWithCommas } from "utils/functions";
import { formatAmount, formatTvl } from "utils/formatApy";
import getCurrencyId from "utils/getCurrencyId";
import getTokenLogoURL from "utils/getTokenLogoURL";

import useIndex from "./hooks/useIndex";

import StyledButton from "../StyledButton";
import DropDown from "./Dropdowns/Dropdown";
import OptionDropdown from "./Dropdowns/OptionDropdown";
import AddNFTModal from "./Modals/AddNFTModal";
import EnterExitModal from "./Modals/EnterExitModal";
import IndexLogo from "./IndexLogo";
import StakingHistory from "./StakingHistory";
import TotalStakedChart from "./TotalStakedChart";

const aprTexts = ["24hrs", "7D", "30D"];

const IndexDetail = ({ detailDatas }: { detailDatas: any }) => {
  const { data } = detailDatas;
  const { tokens, userData, priceHistories } = data;
  const dispatch = useAppDispatch();

  const [stakingModalOpen, setStakingModalOpen] = useState(false);
  const [addNFTModalOpen, setAddNFTModalOpen] = useState(false);
  const [curType, setCurType] = useState("enter");
  const [curGraph, setCurGraph] = useState(2);
  const [curAPR, setCurAPR] = useState(0);

  const router = useRouter();
  const { address } = useAccount();
  const { chainId } = useActiveChainId();
  const { canSwitch, switchNetwork } = useSwitchNetwork();
  const { pending, setPending }: any = useContext(DashboardContext);
  const { tokenPrices } = useContext(TokenPriceContext);
  const nativeTokenPrice = useTokenPrice(data.chainId, WNATIVE[data.chainId].address);

  const { onMintNft } = useIndex(data.pid, data.address, data.performanceFee);

  useEffect(() => {
    const fetchFeeHistoriesAsync = async () => {
      const { performanceFees, commissions } = await fetchIndexFeeHistories(data);

      dispatch(
        setIndexesPublicData([
          {
            pid: data.pid,
            performanceFees,
            commissions,
          },
        ])
      );
    };

    fetchFeeHistoriesAsync();
  }, [data.pid]);

  useEffect(() => {
    if (address) {
      dispatch(updateNftAllowance(data.pid, address, data.chainId));
      dispatch(updateUserStakings(data.pid, address, data.chainId));
      dispatch(updateUserBalance(address, data.chainId));
      dispatch(updateUserNftInfo(address, data.chainId));

      dispatch(fetchIndexUserHistoryDataAsync(data.pid, address));
    }
  }, [data.pid, address]);

  const graphData = () => {
    let _graphData;
    switch (curGraph) {
      case 0:
        _graphData = data.TVLData ?? [];
        _graphData = _graphData.map((v) => v);
        if (data.totalStaked?.length) _graphData.push(data.totalStaked);
        if (_graphData.length === 1) _graphData.push(_graphData[0]);
        return _graphData;
      case 1:
        return data.performanceFees ?? [];
      case 2:
        return data.priceHistories ?? [[]];
      case 3:
        return data.commissions ?? [];
      default:
        _graphData = data.TVLData ?? [];
        _graphData = _graphData.map((v) => v);
        if (data.totalStaked?.length) _graphData.push(data.totalStaked);
        if (_graphData.length === 1) _graphData.push(_graphData[0]);
        return _graphData;
    }
  };

  const getProfit = () => {
    if (!userData?.stakedBalances?.length || !priceHistories?.length) return 0;
    let profit = 0;
    for (let k = 0; k < data.numTokens; k++) {
      profit +=
        +ethers.utils.formatUnits(userData.stakedBalances[k], tokens[k].decimals) *
        priceHistories[k][priceHistories[k].length - 1];
    }
    profit -= +userData.stakedUsdAmount;
    return profit;
  };

  const renderProfit = (isProfit = false) => {
    let profit = getProfit();
    const profitChanged = (profit ? (userData.stakedUsdAmount / 1 - profit) / profit : 0) * 100;
    if (!userData?.stakedBalances?.length || !priceHistories?.length)
      return (
        <span className="mr-1 text-green">
          $0.00 <span className="text-[#FFFFFF80]">earned</span>
          {isProfit ? (
            <>
              <br />
              0.00% <span className="text-[#FFFFFF80]">gain</span>
            </>
          ) : (
            ""
          )}
        </span>
      );
    return (
      <span className={`${profit >= 0 ? "text-green" : ""} mr-1`}>
        ${numberWithCommas(profit.toFixed(2))} <span className="text-[#FFFFFF80]">earned</span>
        {isProfit ? (
          <>
            <br />
            <span className={`${profitChanged >= 0 ? "text-green" : ""}`}>
              {(profitChanged > 0 ? profitChanged : -profitChanged).toFixed(2)}%&nbsp;
              <span className="text-[#FFFFFF80]">{profitChanged >= 0 ? "gain" : "loss"}</span>
            </span>
          </>
        ) : (
          ""
        )}
      </span>
    );
  };

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleMintNft = async () => {
    setPending(true);
    try {
      await onMintNft();

      toast.success("Index NFT was mint");
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute left-0 top-0 max-h-screen w-full overflow-x-hidden overflow-y-scroll pb-[150px]">
            {address && data && (
              <EnterExitModal open={stakingModalOpen} setOpen={setStakingModalOpen} type={curType} data={data} />
            )}
            <AddNFTModal open={addNFTModalOpen} setOpen={setAddNFTModalOpen} data={data} />
            <PageHeader
              title={
                <div className="text-[40px]">
                  <WordHighlight content="Indexes" />
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
                      <StyledButton onClick={() => router.push("/indexes")}>
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
                  <div>
                    <div className="min-w-fit sm:min-w-[160px]">
                      <div className="h-[32px] w-[140px] ">
                        <StyledButton onClick={() => router.push("/indexes")}>
                          <div className="absolute left-2 top-[7px]">{chevronLeftSVG}</div>
                          <div className="ml-2">Back to pool list</div>
                        </StyledButton>
                      </div>
                      <div className="block xl:hidden">
                        <div className="mt-2" />
                        <StyledButton
                          className="relative h-8 w-[140px] rounded-md border border-primary bg-[#B9B8B81A] font-roboto text-sm font-bold text-primary shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                          type={"default"}
                        >
                          <div className="flex items-center">
                            <div className="mr-1.5">Share Index</div> {LinkSVG}
                          </div>
                          <div className="absolute -right-3 -top-2 z-10 flex h-4 w-10 items-center justify-center rounded-[30px] bg-primary font-roboto text-xs font-bold text-black">
                            Soon
                          </div>
                        </StyledButton>
                        <div className="mt-2" />
                        <OptionDropdown handleMintNft={handleMintNft} setAddNFTModalOpen={setAddNFTModalOpen} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 justify-end">
                    <div className="hidden w-full max-w-[480px] items-center sm:flex">
                      <img src={"/images/nfts/default.png"} alt={""} className="mr-2 h-10 w-10 rounded-full" />
                      <StyledButton
                        className="h-8 w-[140px] flex-1 cursor-pointer items-center justify-center rounded border border-primary bg-[#B9B8B81A] px-2 font-roboto text-sm font-semibold text-primary shadow-[0px_4px_4px_#00000040] transition hover:border-white hover:text-white xl:flex"
                        type={"default"}
                        onClick={() => router.push(`/indexes/profile/${data.deployer}`)}
                      >
                        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          View {data.deployer}
                        </div>
                        <div className="ml-2">{LinkSVG}</div>
                      </StyledButton>
                    </div>
                    <div className="ml-3 flex w-full max-w-fit flex-col items-end justify-end sm:ml-[30px] xl:max-w-[520px] xl:flex-row xl:items-center">
                      <div className="mb-2 block flex w-full max-w-[480px] items-center sm:hidden">
                        <img
                          src={"/images/nfts/default.png"}
                          alt={""}
                          className="mr-2 hidden h-10 w-10 rounded-full xs:block"
                        />
                        <StyledButton
                          className="h-8 w-[140px] flex-1 cursor-pointer items-center justify-center rounded border border-primary bg-[#B9B8B81A] px-2 font-roboto text-sm font-semibold text-primary shadow-[0px_4px_4px_#00000040] transition hover:border-white hover:text-white xl:flex"
                          type={"default"}
                          onClick={() => router.push(`/indexes/profile/${data.deployer}`)}
                        >
                          <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                            View {data.deployer}
                          </div>
                          <div className="ml-2">{LinkSVG}</div>
                        </StyledButton>
                      </div>
                      <StyledButton
                        className="relative hidden h-8 w-[140px] rounded-md border border-primary bg-[#B9B8B81A] font-roboto text-sm font-bold text-primary shadow-[0px_4px_4px_rgba(0,0,0,0.25)] xl:flex"
                        type={"default"}
                      >
                        <div className="flex items-center">
                          <div className="mr-1.5">Share Index</div> {LinkSVG}
                        </div>
                        <div className="absolute -right-3 -top-2 z-10 flex h-4 w-10 items-center justify-center rounded-[30px] bg-primary font-roboto text-xs font-bold text-black">
                          Soon
                        </div>
                      </StyledButton>
                      <div className="mr-4 mt-2 hidden xl:mt-0 xl:block" />
                      <div className="hidden xl:block">
                        <OptionDropdown handleMintNft={handleMintNft} setAddNFTModalOpen={setAddNFTModalOpen} />
                      </div>
                      <a
                        className=" ml-0 h-[32px] w-[140px] xl:ml-4 "
                        target="_blank"
                        href={`https://bridge.brewlabs.info/swap?outputCurrency=${tokens[0].address}`}
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

                <div className="mt-2 flex flex-col items-center justify-between md:flex-row">
                  <IndexLogo tokens={tokens} />
                  <div className="flex flex-1 flex-wrap justify-end xl:flex-nowrap">
                    <InfoPanel padding={"14px 25px 8px 25px"} className="relative mt-4 max-w-full md:max-w-[500px]">
                      <div className="flex flex-wrap justify-between text-xl">
                        <div className="mr-4 whitespace-nowrap">Index: {getIndexName(tokens)}</div>
                        <div className="flex items-center">
                          {/* Performance:&nbsp; */}
                          {data.priceChanges !== undefined ? (
                            <span className={data.priceChanges[curAPR].percent >= 0 ? "text-green" : "text-danger"}>
                              {data.priceChanges[curAPR].percent.toFixed(2)}%
                            </span>
                          ) : (
                            <SkeletonComponent />
                          )}
                          <div className="ml-1 w-[60px]">
                            <DropDown value={curAPR} setValue={setCurAPR} data={aprTexts} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-between text-base text-[#FFFFFF80]">
                        <div>
                          <span className="#FFFFFF80">Buy</span> {getIndexName(tokens)}
                        </div>
                      </div>
                      <div className="text-xs leading-none text-[#FFFFFF80]">
                        <div className="relative mt-1 flex">
                          Deposit Fee {data.fee}% {getNativeSybmol(data.chainId)}
                          <ReactTooltip
                            anchorId={"Depositfees"}
                            place="right"
                            content="Deposit fees are sent to token owner nominated address."
                          />
                          <div className="absolute -left-4" id={"Depositfees"}>
                            <div>{warningFarmerSVG("11px")}</div>
                          </div>
                        </div>
                        <div className="relative mt-1 flex">
                          Withdrawal Fee 0.00% / In Profit Withdrawal Fee {data.fee ?? ""}% of Profit
                          <ReactTooltip
                            anchorId={"Withdrawfees"}
                            place="right"
                            content="Withdraw fees are sent to token owner nominated address."
                          />
                          <div className="absolute -left-4" id={"Withdrawfees"}>
                            <div>{warningFarmerSVG("11px")}</div>
                          </div>
                        </div>
                        <div className="relative mt-1 flex">
                          Performance Fee {ethers.utils.formatEther(data.performanceFee ?? "0")}{" "}
                          {getNativeSybmol(data.chainId)}
                          <ReactTooltip
                            anchorId={"Performancefee"}
                            place="right"
                            content="Performance fee is charged per transaction to the Brewlabs Treasury (Brewlabs holders)."
                          />
                          <div className="absolute -left-4" id={"Performancefee"}>
                            <div>{warningFarmerSVG("11px")}</div>
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
                      padding={"6px 25px 14px 25px"}
                      className="ml-0 mt-4 flex max-w-full flex-wrap justify-between md:ml-[30px] md:max-w-[500px]"
                    >
                      <div className="mt-2">
                        <div className="text-xl">My Position</div>
                        <div className="mt-1 leading-none text-primary">
                          {userData?.stakedUsdAmount ? (
                            `$${formatAmount(userData.stakedUsdAmount, 2)}`
                          ) : (
                            <SkeletonComponent />
                          )}
                          <span className="flex text-[#FFFFFF80]">Principal Investment</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="mb-1 text-xl">Tokens</div>
                        {tokens.map((token, index) => (
                          <div className="mt-1 flex items-center leading-none" key={token.address}>
                            <img
                              src={getTokenLogoURL(token.address, token.chainId)}
                              onError={(data) => (data.target["src"] = "/images/unknown.png")}
                              alt={""}
                              className="mr-1 w-3 rounded-full"
                            />
                            <div className="flex text-[#FFFFFFBF]">
                              {userData?.stakedBalances.length ? (
                                `${formatAmount(
                                  ethers.utils.formatUnits(userData.stakedBalances[index], token.decimals),
                                  4
                                )}`
                              ) : address ? (
                                <SkeletonComponent />
                              ) : (
                                "0.00"
                              )}
                              <span className="ml-1 text-[#FFFFFF80]">{token.symbol}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Profit</div>
                        <div className="mt-1 flex leading-none text-[#FFFFFF80]">{renderProfit(true)}</div>
                      </div>
                    </InfoPanel>
                  </div>
                </div>
                <div className="mt-10 flex w-full flex-col justify-between md:flex-row">
                  <div className="w-full md:w-[40%]">
                    <TotalStakedChart
                      data={graphData()}
                      symbols={curGraph === 1 ? [getNativeSybmol(data.chainId)] : tokens.map((t) => t.symbol)}
                      prices={
                        curGraph === 1 || curGraph === 3
                          ? [nativeTokenPrice]
                          : data.tokenPrices ?? tokens.map((t) => tokenPrices[getCurrencyId(t.chainId, t.address)] ?? 0)
                      }
                      curGraph={curGraph}
                    />
                    <InfoPanel
                      className="mt-20 flex cursor-pointer items-center justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 2 ? "primary" : null}
                      onClick={() => setCurGraph(2)}
                    >
                      <div className="flex flex-wrap">
                        <div>Index Performance</div>&nbsp;
                        <span className="whitespace-nowrap text-[#FFFFFF80]">(Price - 24hrs)</span>
                      </div>
                      &nbsp;
                      <div className="flex text-[#FFFFFF80]">
                        {data.priceChanges !== undefined ? (
                          <span className={data.priceChanges[0].percent < 0 ? "text-danger" : "text-green"}>
                            {data.priceChanges[0].percent.toFixed(2)}%
                          </span>
                        ) : (
                          <SkeletonComponent />
                        )}
                        &nbsp;
                        <div>
                          {data.priceChanges !== undefined ? (
                            `(${formatDollar(data.priceChanges[0].value, 2)})`
                          ) : (
                            <SkeletonComponent />
                          )}
                        </div>
                      </div>
                    </InfoPanel>
                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 0 ? "primary" : null}
                      onClick={() => setCurGraph(0)}
                    >
                      <div>Total Index Value</div>
                      <div className="flex">
                        {data.tvl || data.tvl === 0.0 ? `${formatTvl(data.tvl, 1)}` : <SkeletonComponent />}
                        <span className="ml-1 text-[#FFFFFF80]">
                          {tokens.length === 2 ? tokens.map((t) => t.symbol).join(" / ") : `Multiple`}
                        </span>
                      </div>
                    </InfoPanel>
                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 1 ? "primary" : null}
                      onClick={() => setCurGraph(1)}
                    >
                      <div>
                        Performance fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
                      </div>
                      <div className="flex">
                        {data.performanceFees !== undefined ? (
                          data.performanceFees.length > 0 ? (
                            formatAmount(data.performanceFees[data.performanceFees.length - 1], 4)
                          ) : (
                            "0.00"
                          )
                        ) : (
                          <SkeletonComponent />
                        )}
                        <span className="ml-1 text-[#FFFFFF80]">{getNativeSybmol(data.chainId)}</span>
                      </div>
                    </InfoPanel>

                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 3 ? "primary" : null}
                      onClick={() => setCurGraph(3)}
                    >
                      <div>
                        Owner comissions<span className="text-[#FFFFFF80]"> (24hrs)</span>
                      </div>
                      <div className="flex text-[#FFFFFF80]">
                        $
                        {data.commissions?.length
                          ? formatAmount(+data.commissions[data.commissions.length - 1] * nativeTokenPrice)
                          : "0.00"}
                      </div>
                    </InfoPanel>
                  </div>
                  <div className="relative mt-10 w-full md:mt-0 md:w-[57%]">
                    <div className="mt-7">
                      <StakingHistory
                        data={data}
                        history={userData.histories}
                        setOpen={() => {
                          setStakingModalOpen(true);
                          setCurType("exit");
                        }}
                      />
                    </div>
                    <div className="relative bottom-0 left-0 mt-2 flex h-12 w-full md:absolute">
                      {data.chainId !== chainId ? (
                        <div className="flex-1">
                          <StyledButton
                            type={"quaternary"}
                            disabled={!canSwitch}
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
                              type={"quaternary"}
                              onClick={() => {
                                setStakingModalOpen(true);
                                setCurType("enter");
                              }}
                              disabled={pending || !address}
                            >
                              Enter {getIndexName(tokens)} Index
                            </StyledButton>
                          </div>
                          <div className="flex-1">
                            <StyledButton
                              type={"quaternary"}
                              onClick={() => {
                                setStakingModalOpen(true);
                                setCurType("exit");
                              }}
                              disabled={
                                pending ||
                                !address ||
                                !userData?.stakedBalances?.length ||
                                !priceHistories?.length ||
                                getProfit() <= 0
                              }
                            >
                              Exit &nbsp;{renderProfit()} Profit
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
      </AnimatePresence>
    </>
  );
};

export default IndexDetail;

const InfoPanel = styled.div<{ padding?: string; type?: string; boxShadow?: string }>`
  background: ${({ type }) => (type === "secondary" ? "rgba(185, 184, 184, 0.1)" : "rgba(185, 184, 184, 0.05)")};
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: ${({ padding, type }) => (type === "secondary" ? "12px 15px" : padding)};
  width: 100%;
  color: #ffffffbf;
  box-shadow: ${({ boxShadow }) =>
    boxShadow === "primary"
      ? "0px 2px 1px rgba(255, 255, 255, 0.75)"
      : boxShadow === "secondary"
      ? "0px 1px 1px rgba(255, 255, 255, 0.75)"
      : ""};
  :hover {
    border-color: ${({ type, boxShadow }) =>
      type === "secondary" && !boxShadow ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.5)"};
  }
  .react-tooltip {
    z-index: 100;
    font-size: 13px;
    line-height: 125%;
    opacity: 1;
    max-width: 300px;
    text-align: center;
  }
`;
