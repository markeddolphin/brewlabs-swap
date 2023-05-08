/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import styled from "styled-components";

import "react-tooltip/dist/react-tooltip.css";

import {
  BarChartSVG,
  CameraSVG,
  chevronLeftSVG,
  DetailSVG,
  KYCSVG,
  UserAddSVG,
  UserSVG,
} from "components/dashboard/assets/svgs";
import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";

import { TokenPriceContext } from "contexts/TokenPriceContext";
import { fetchIndexFeeHistories } from "state/indexes/fetchIndexes";
import { getIndexName } from "utils/functions";
import getCurrencyId from "utils/getCurrencyId";

import StyledButton from "../../StyledButton";
import IndexLogo from "../IndexLogo";
import { LinkSVG } from "components/dashboard/assets/svgs";
import { useIndexes } from "state/indexes/hooks";
import { orderBy } from "lodash";
import ChartHistory from "./ChartHistory";
import { getAverageHistory } from "state/indexes/fetchIndexes";
import SelectionPanel from "./SelectionPanel";
import PoolList from "views/directory/PoolList";
import { Category } from "config/constants/types";
import { useGlobalState } from "state";
import { DashboardContext } from "contexts/DashboardContext";
import { UserContext } from "contexts/UserContext";

const Profile = ({ deployer }: { deployer: string }) => {
  const [performanceFees, setPerformanceFees] = useState([]);
  const [curFilter, setCurFilter] = useState(0);
  const [criteria, setCriteria] = useState("");
  const [status, setStatus] = useState("active");
  const [, setSelectPoolDetail] = useState(false);
  const [, setCurPool] = useState<{ type: Category; pid: number; chainId: number }>({
    type: 0,
    pid: 0,
    chainId: 0,
  });
  const [, setSortOrder] = useState("default");
  const [, setIsOpen] = useGlobalState("userSidebarOpen");

  const router = useRouter();
  const { tokenPrices } = useContext(TokenPriceContext);
  const { setSelectedDeployer, setViewType }: any = useContext(DashboardContext);
  const { userData }: any = useContext(UserContext);
  const { indexes, userDataLoaded } = useIndexes();

  const deployerData = userData.visitedIndexes
    ? userData.visitedIndexes.find((data: any) => data.address === deployer.toLowerCase())
    : null;
  let allPools = [
    ...indexes
      .map((_index) => {
        let tvl = 0;
        for (let i = 0; i < _index.tokens.length; i++) {
          let price = _index.tokenPrices?.[i] ?? tokenPrices[getCurrencyId(_index.chainId, _index.tokens[i].address)];
          tvl += _index.totalStaked?.[i] && price ? +_index.totalStaked[i] * price : 0;
        }
        return { ..._index, tvl };
      })
      .filter((data) => data.deployer?.toLowerCase() === deployer?.toLowerCase()),
  ];
  allPools = orderBy(allPools, (pool) => pool.tvl, "desc");
  const bestPool: any = allPools.length ? allPools[0] : [];

  const getPriceChange = () => {
    let priceHistories = [],
      combinedHistories = [];
    for (let i = 0; i < allPools.length; i++) {
      priceHistories.push(getAverageHistory(allPools[i].priceHistories ?? [[]]));
    }
    for (let i = 0; i < 24; i++) {
      combinedHistories.push(0);
      for (let j = 0; j < allPools.length; j++) combinedHistories[i] += priceHistories[j][i];
      combinedHistories[i] = !isNaN(combinedHistories[i]) ? combinedHistories[i] / allPools.length : 0;
    }
    return combinedHistories;
  };

  const getPerformanceFees = async () => {
    let _performanceFees: any = [];
    const result = await Promise.all(allPools.map((index: any) => fetchIndexFeeHistories(index)));
    for (let i = 0; i < 24; i++) {
      let pF = 0;
      for (let j = 0; j < result.length; j++) pF += result[j].performanceFees[i];
      _performanceFees.push(pF);
    }
    setPerformanceFees(_performanceFees);
  };

  useEffect(() => {
    getPerformanceFees();
  }, [allPools.length]);

  let chosenPools = allPools;
  switch (status) {
    case "finished":
      chosenPools = chosenPools.filter((pool: any) => pool.isFinished || pool.multiplier === 0);
      break;
    case "new":
      chosenPools = chosenPools.filter(
        (pool: any) =>
          !pool.isFinished &&
          pool.type === Category.INDEXES &&
          new Date(pool.createdAt).getTime() + 86400 * 1000 >= Date.now()
      );
      break;
    default:
      chosenPools = chosenPools.filter((pool) => !pool.isFinished);
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute left-0 top-0 max-h-screen w-full overflow-x-hidden overflow-y-scroll pb-[150px]">
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

            <Container className="font-brand">
              <div className="flex items-center justify-between font-roboto">
                <div>
                  <div className="min-w-fit sm:min-w-[180px]">
                    <div className="h-[32px] w-[120px] ">
                      <StyledButton onClick={() => router.push("/indexes")}>
                        <div className="absolute left-2 top-[7px]">{chevronLeftSVG}</div>
                        <div className="ml-2">Back to Index</div>
                      </StyledButton>
                    </div>
                    <div className="block xl:hidden">
                      <div className="mt-2" />
                      <a className="flex h-[32px] w-[120px]" target="_blank" rel="noreferrer">
                        <StyledButton>
                          <div>Swap</div>
                          <div className="absolute right-2 top-[7px] -scale-100">{chevronLeftSVG}</div>
                        </StyledButton>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-end">
                  <div className="ml-3 flex w-full max-w-fit flex-col items-end justify-end sm:ml-[30px] xl:max-w-[520px] xl:flex-row xl:items-center">
                    <StyledButton
                      className="relative h-8 w-[140px] rounded-md border border-primary bg-[#B9B8B81A] font-roboto text-sm font-bold text-primary shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition hover:border-white hover:text-white xs:w-[200px] xl:flex"
                      type={"default"}
                    >
                      <div className="flex items-center">
                        <div className="mr-1.5 w-[150px] overflow-hidden text-ellipsis whitespace-nowrap xl:w-[170px]">
                          Follow & get notifications
                        </div>
                        <div className="scale-[125%]">{UserAddSVG}</div>
                      </div>
                      <div className="absolute -right-3 -top-2 z-10 flex h-4 w-10 items-center justify-center rounded-[30px] bg-primary font-roboto text-xs font-bold text-black">
                        Soon
                      </div>
                    </StyledButton>
                    <div className="mr-4 mt-2 xl:mt-0" />
                    <StyledButton
                      className="relative h-8 w-[140px] rounded-md border border-primary bg-[#B9B8B81A] font-roboto text-sm font-bold text-primary shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition hover:border-white hover:text-white xl:flex"
                      type={"default"}
                    >
                      <div className="flex items-center">
                        <div className="mr-1.5">Share portfolio</div> {LinkSVG}
                      </div>
                      <div className="absolute -right-3 -top-2 z-10 flex h-4 w-10 items-center justify-center rounded-[30px] bg-primary font-roboto text-xs font-bold text-black">
                        Soon
                      </div>
                    </StyledButton>

                    <a className=" ml-0 hidden h-[32px] w-[140px] xl:ml-4 xl:block" target="_blank" rel="noreferrer">
                      <StyledButton>
                        <div>Swap</div>
                        <div className="absolute right-2 top-[7px] -scale-100">{chevronLeftSVG}</div>
                      </StyledButton>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-col items-center justify-between md:flex-row">
                <div className="mt-8  min-w-fit md:mt-0 md:min-w-[180px]">
                  <div className="relative h-fit w-fit">
                    <img
                      src={deployerData ? deployerData.logo : "/images/nfts/default.png"}
                      alt={""}
                      className="h-36 w-36 rounded-full"
                    />
                    <div
                      className="absolute bottom-0 right-0 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-primary bg-[#5D616A] text-primary transition hover:opacity-80"
                      onClick={() => {
                        setViewType(2);
                        setIsOpen(2);
                        setSelectedDeployer(deployer);
                      }}
                    >
                      {CameraSVG}
                    </div>
                  </div>
                </div>
                <InfoPanel className="relative mt-4 flex w-full flex-col justify-between p-3.5 sm:p-[14px_14px_14px_40px] md:w-[calc(100%-180px)] ls:flex-row">
                  <div className="w-full ls:w-[calc(100%-556px)]">
                    <div className="relative text-[25px] text-white">
                      <div>Brewlabs</div>
                      <div className="absolute -left-6 top-2 text-primary">{KYCSVG}</div>
                    </div>
                    <div className="overflow-hidden text-ellipsis text-lg text-[#FFFFFF80]">{deployer}</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="mr-3 scale-[200%] text-primary">{UserSVG}</div>
                      <div className="text-sm">
                        42 <span className="text-green">(+3) 24HR</span>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center">
                      <div className="mr-3 scale-[200%] text-primary">{DetailSVG}</div>
                      <div className="text-sm">{allPools.length}</div>
                    </div>
                    <div className="mt-1.5 flex items-center">
                      <div className="mr-3 scale-[200%] text-primary">{BarChartSVG}</div>
                      <div className="ml-2">
                        <IndexLogo type={"line"} tokens={bestPool.tokens ?? []} />
                      </div>
                      <div className="ml-2">{getIndexName(bestPool.tokens ?? [])}</div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col items-center justify-between sm:flex-row sm:items-start ls:mt-0 ls:justify-start">
                    <ChartHistory data={performanceFees} type={"fee"} />
                    <div className="mt-2 sm:mt-0" />
                    <ChartHistory data={getPriceChange()} type={"performance"} />
                  </div>
                </InfoPanel>
              </div>
              <SelectionPanel
                pools={allPools}
                curFilter={curFilter}
                setCurFilter={setCurFilter}
                criteria={criteria}
                setCriteria={setCriteria}
                activity={status}
                setActivity={setStatus}
              />
              <div className="mb-[100px] mt-[18px]">
                <PoolList
                  pools={chosenPools}
                  setSelectPoolDetail={setSelectPoolDetail}
                  setCurPool={setCurPool}
                  setSortOrder={setSortOrder}
                  loading={true}
                />
              </div>
            </Container>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Profile;

const InfoPanel = styled.div<{ padding?: string; type?: string; boxShadow?: string }>`
  background: ${({ type }) => (type === "secondary" ? "rgba(185, 184, 184, 0.1)" : "rgba(185, 184, 184, 0.05)")};
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
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
