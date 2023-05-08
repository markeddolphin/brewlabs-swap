/* eslint-disable react-hooks/exhaustive-deps */
import DropDown from "./Dropdown";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { LogoPanel, ValuePanel } from ".";

const ToolBar = ({
  filterType,
  setFilterType,
  fullOpen,
  listType,
  setListType,
  curScroll,
  setCurScroll,
}: {
  setFilterType?: any;
  filterType: number;
  fullOpen: boolean;
  listType: number;
  setListType: any;
  curScroll: number;
  setCurScroll: any;
}) => {
  const ref: any = useRef<HTMLDivElement>();
  useEffect(() => {
    ref.current.scrollLeft = curScroll;
  }, [curScroll]);
  return (
    <div className={"flex items-center justify-between"}>
      <LogoPanel>
        <DropDown value={listType} setValue={setListType} values={["Wallet", "Archive"]} />
      </LogoPanel>
      <ValuePanel ref={ref} onScroll={(e: any) => setCurScroll(e.target.scrollLeft)}>
        <div className="flex items-center justify-between pl-2">
          <StyledOption
            className={`${fullOpen ? "min-w-[14px]" : "min-w-[70px]"} font-semibold`}
            onClick={() => setFilterType(1)}
            active={filterType === 1}
          >
            {fullOpen ? (
              ""
            ) : (
              <>
                <div className="mr-px ml-2 text-sm text-white">Balance</div>
                <img src={"/images/dashboard/updown.svg"} alt={""} />
              </>
            )}
          </StyledOption>
          <StyledOption
            className={`min-w-[75px] font-semibold`}
            onClick={() => setFilterType(2)}
            active={filterType === 2}
          >
            <div className="mr-px text-sm text-white">Price</div>
            <img src={"/images/dashboard/updown.svg"} alt={""} />
          </StyledOption>
          <StyledOption
            className={`min-w-[75px] font-semibold`}
            onClick={() => setFilterType(3)}
            active={filterType === 3}
          >
            <div className="mr-px text-sm text-white">Value</div>
            <img src={"/images/dashboard/updown.svg"} alt={""} />
          </StyledOption>
          <StyledOption
            className={`min-w-[100px] font-semibold`}
            onClick={() => setFilterType(4)}
            active={filterType === 4}
          >
            <div className="mr-px text-sm text-white">Total Rewards</div>
            <img src={"/images/dashboard/updown.svg"} alt={""} />
          </StyledOption>
          <StyledOption
            className={`min-w-[120px] font-semibold`}
            onClick={() => setFilterType(5)}
            active={filterType === 5}
          >
            <div className="mr-px text-sm text-white">Pending Rewards</div>
            <img src={"/images/dashboard/updown.svg"} alt={""} />
          </StyledOption>
          <div className={"w-5"} />
        </div>
      </ValuePanel>
    </div>
  );
};

const StyledOption = styled.div<{ active: boolean }>`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  > img {
    transform: ${({ active }) => (active ? "scaleY(-1)" : "")};
  }
`;
export default ToolBar;
