import { useContext, useEffect, useState } from "react";

import LogoIcon from "../LogoIcon";
import PerformanceChart from "./PerformanceChart";
import SwitchButton from "./SwitchButton";
import TokenList from "./TokenList";
import FullOpenVector from "./FullOpenVector";

import { DashboardContext } from "contexts/DashboardContext";
import NavButton from "./NavButton";
import PriceList from "./PriceList";
import styled from "styled-components";
import SwapBoard from "views/swap/SwapBoard";
import IndexPerformance from "./IndexPerformance";
import NFTList from "./NFTList";

const UserDashboard = () => {
  const [showType, setShowType] = useState(0);
  const [fullOpen, setFullOpen] = useState(false);
  const { tokens, viewType, setViewType }: any = useContext(DashboardContext);
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [archives, setArchives] = useState<any>([]);
  const [listType, setListType] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [filteredTokens, setFilteredTokens] = useState([]);

  useEffect(() => {
    if (window.innerHeight < 790) setItemsPerPage(Math.floor((window.innerHeight - 300) / 50));
    else if (window.innerHeight < 920) setItemsPerPage(Math.floor((window.innerHeight - 535) / 50));
    else setItemsPerPage(Math.floor((window.innerHeight - 548) / 50));
  }, [fullOpen]);

  useEffect(() => {
    let _filteredTokens: any = [];
    if (listType === 0) {
      _filteredTokens = tokens.filter((data: any) => !archives.includes(data.address));
    } else {
      _filteredTokens = tokens.filter((data: any) => archives.includes(data.address));
    }
    setMaxPage(Math.ceil(_filteredTokens.length / itemsPerPage));
    setFilteredTokens(_filteredTokens);
  }, [listType, tokens, archives, itemsPerPage]);
  return (
    <>
      <StyledContainer className="relative mr-1.5 flex w-full  flex-col  pb-3">
        <div className="flex w-full justify-between border-b border-yellow pb-4">
          <div className="flex items-center ">
            <LogoIcon classNames="w-14 text-dark dark:text-brand" />
            <div className={"ml-5 text-2xl font-semibold text-yellow"}>Dashboard</div>
          </div>
          <NavButton value={viewType} setValue={setViewType} />
        </div>

        {viewType === 0 ? (
          <ChartPanel>
            <div className={"mt-4"}>
              <PerformanceChart tokens={filteredTokens} showType={showType} />
            </div>
            <div className={"relative z-10 flex w-full justify-center"}>
              <SwitchButton value={showType} setValue={setShowType} />
            </div>{" "}
          </ChartPanel>
        ) : (
          ""
        )}
      </StyledContainer>
      {viewType === 1 ? (
        <div className="mt-4 flex justify-center">
          <SwapBoard type={"draw"} disableChainSelect />
        </div>
      ) : viewType === 0 ? (
        <>
          <TokenList
            tokens={tokens}
            fullOpen={fullOpen}
            showType={showType}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            itemsPerPage={itemsPerPage}
            archives={archives}
            setArchives={setArchives}
            listType={listType}
            setListType={setListType}
          />
          <div className={"w-full"}>
            <FullOpenVector
              open={fullOpen}
              setOpen={setFullOpen}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              maxPage={maxPage}
            />
          </div>
        </>
      ) : (
        <NFTList />
      )}
      <div className={fullOpen || viewType !== 0 ? "hidden" : "w-full"}>
        <IndexPerformance />
      </div>
      <PricePanel className={`absolute bottom-10 w-full px-4 ${fullOpen ? "hidden" : ""}`} viewType={viewType}>
        <PriceList />
      </PricePanel>
    </>
  );
};

export default UserDashboard;

const StyledContainer = styled.div`
  padding-top: 20px;
`;

const ChartPanel = styled.div`
  @media screen and (max-height: 790px) {
    display: none;
  }
`;

const PricePanel = styled.div<{ viewType: number }>`
  @media screen and (max-height: 920px) {
    display: none;
  }
  display: ${({ viewType }) => (viewType === 1 ? "none" : "")};
`;
