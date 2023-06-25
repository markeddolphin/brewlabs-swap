import styled from "styled-components";

import { Category } from "config/constants/types";
import { useChainCurrentBlocks } from "state/block/hooks";
import { filterPoolsByStatus } from "utils";

import DropDown from "./Dropdown";
import ActivityDropdown from "./ActivityDropdown";

const SelectionPanel = ({
  pools,
  curFilter,
  setCurFilter,
  criteria,
  setCriteria,
  activity,
  setActivity,
}: {
  pools: any;
  curFilter: number;
  setCurFilter: any;
  criteria: string;
  setCriteria: any;
  activity: any;
  setActivity: any;
}) => {
  const currentBlocks = useChainCurrentBlocks();

  let counts = [];
  for (let i = 1; i <= 4; i++) {
    const filter = pools.filter((data: any) => data.type === i);
    counts[i] = filter.length;
  }
  counts[5] = pools.filter((data) =>
    data.type === Category.INDEXES
      ? data.userData?.stakedBalances[0]?.gt(0) || data.userData?.stakedBalances[1]?.gt(0)
      : Number(data.userData?.stakedBalance) > 0
  ).length;

  const filters = [
    <>
      All <span className="text-[11px]">({counts[1] + counts[2] + counts[3] + counts[4]})</span>
    </>,
    <>
      Staking Pools <span className="text-[11px]">({counts[1]})</span>
    </>,
    <>
      Yield Farms <span className="text-[11px]">({counts[2]})</span>
    </>,
    <>
      Indexes <span className="text-[11px]">({counts[3]})</span>
    </>,
    <>
      Zapper Pools <span className="text-[11px]">({counts[4]})</span>
    </>,
    <>
      My positions <span className="text-[11px]">({counts[5]})</span>
    </>,
  ];

  let filteredPools = pools.filter(
    (data) =>
      curFilter === Category.ALL ||
      data.type === curFilter ||
      (curFilter === Category.MY_POSITION &&
        (data.type === Category.INDEXES ? +data.userData?.stakedUsdAmount > 0 : data.userData?.stakedBalance.gt(0)))
  );

  let activityCnts = {
    active: filterPoolsByStatus(filteredPools, currentBlocks, "active").length,
    finished: filterPoolsByStatus(filteredPools, currentBlocks, "finished").length,
    new: filterPoolsByStatus(filteredPools, currentBlocks, "new").length,
  };

  return (
    <div className="flex flex-row items-end md:flex-col md:items-start">
      <div className="mb-0 block flex w-full flex-1 items-center justify-between md:mb-3 xl:hidden">
        <div className="max-w-[500px] flex-1">
          <SearchInput placeholder="Search token..." value={criteria} onChange={(e) => setCriteria(e.target.value)} />
        </div>
        <div className="ml-4 hidden w-[130px] md:block">
          <ActivityDropdown value={activity} setValue={setActivity} counts={activityCnts} />
        </div>
      </div>
      <div className="flex w-fit flex-none items-center justify-between md:flex-1 xl:w-full">
        <div className="hidden flex-1 md:flex">
          {filters.map((data, i) => {
            return (
              <FilterButton key={i} active={curFilter === i} onClick={() => setCurFilter(i)}>
                {data}
              </FilterButton>
            );
          })}
          <div className="hidden max-w-[280px] flex-1 xl:block">
            <SearchInput placeholder="Search token..." value={criteria} onChange={(e) => setCriteria(e.target.value)} />
          </div>
        </div>
        <div className="ml-4 hidden w-[140px] xl:block">
          <ActivityDropdown value={activity} setValue={setActivity} counts={activityCnts} />
        </div>
      </div>
      <div className="ml-4 block w-[160px] xsm:ml-10  md:hidden">
        <div className="hidden xsm:block">
          <DropDown value={curFilter} setValue={setCurFilter} data={filters} />
        </div>
        <div className="mt-2 w-full">
          <ActivityDropdown value={activity} setValue={setActivity} counts={activityCnts} />
        </div>
      </div>
    </div>
  );
};

const SearchInput = styled.input`
  padding: 7px 10px;
  background: rgba(217, 217, 217, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 4px;
  color: white;
  font-size: 14px;
  width: 100%;
  outline: none;
  line-height: 100%;
  height: fit-content;
`;

const FilterButton = styled.div<{ active: boolean }>`
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  color: #ffffff59;
  transition: all 0.15s;
  background: ${({ active }) => (active ? "#FFFFFF40" : "#d9d9d91a")};
  :hover {
    color: ${({ active }) => (active ? "#FFDE0D" : "white")};
  }
  margin-right: 10px;
  line-height: 100%;
  height: fit-content;
  color: ${({ active }) => (active ? "#FFDE0D" : "#FFFFFF59")};
  white-space: nowrap;
`;
export default SelectionPanel;
