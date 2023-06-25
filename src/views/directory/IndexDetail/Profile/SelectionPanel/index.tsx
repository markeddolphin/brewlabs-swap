import styled from "styled-components";

import { Category } from "config/constants/types";
import { BLOCKS_PER_DAY } from "config/constants";
import { useChainCurrentBlocks } from "state/block/hooks";

import DropDown from "./Dropdown";
import ActivityDropdown from "./ActivityDropdown";
import { useAppId } from "state/zap/hooks";
import { useActiveChainId } from "@hooks/useActiveChainId";

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

  const filters = [`Indexes Deployed (${counts[1] + counts[2] + counts[3] + counts[4]})`];

  let activityCnts = {};
  let filteredPools = pools.filter(
    (data) =>
      curFilter === Category.ALL ||
      data.type === curFilter ||
      (curFilter === Category.MY_POSITION &&
        (data.type === Category.INDEXES ? +data.userData?.stakedUsdAmount > 0 : data.userData?.stakedBalance.gt(0)))
  );
  activityCnts["active"] = filteredPools.filter(
    (pool) =>
      !pool.isFinished &&
      ((pool.type === Category.POOL && +pool.startBlock > 0) ||
        (pool.type === Category.FARM && pool.multiplier > 0 && +pool.startBlock < currentBlocks[pool.chainId]) ||
        pool.type === Category.INDEXES ||
        (pool.type === Category.ZAPPER && pool.pid !== 0 && pool.multiplier !== "0X"))
  ).length;
  activityCnts["finished"] = filteredPools.filter(
    (pool) =>
      pool.isFinished ||
      pool.multiplier === 0 ||
      (pool.type === Category.ZAPPER && pool.pid !== 0 && pool.multiplier === "0X")
  ).length;
  activityCnts["new"] = filteredPools.filter(
    (pool) =>
      !pool.isFinished &&
      ((pool.type === Category.POOL &&
        (+pool.startBlock === 0 || +pool.startBlock + BLOCKS_PER_DAY[pool.chainId] > currentBlocks[pool.chainId])) ||
        (pool.type === Category.FARM &&
          (+pool.startBlock > currentBlocks[pool.chainId] ||
            +pool.startBlock + BLOCKS_PER_DAY[pool.chainId] > currentBlocks[pool.chainId])) ||
        (pool.type === Category.INDEXES && new Date(pool.createdAt).getTime() + 86400 * 1000 >= Date.now()))
  ).length;

  return (
    <div className="flex flex-row items-end md:flex-col md:items-start">
      <div className="mt-4 flex w-full flex-col-reverse items-end justify-between sm:flex-row sm:items-center md:flex-1">
        <div className="mt-2 flex w-full flex-1 sm:mt-0">
          {filters.map((data, i) => {
            return (
              <FilterButton key={i} active={curFilter === i} onClick={() => setCurFilter(i)} className="primary-shadow">
                {data}
              </FilterButton>
            );
          })}
          <div className="max-w-full flex-1 sm:max-w-[360px] ">
            <input
              placeholder="Search index..."
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className="primary-shadow focusShadow h-fit w-full rounded border-none bg-[#D9D9D926] p-[7px_10px] text-sm leading-[1.2] text-white !outline-none"
            />
          </div>
        </div>
        <div className="ml-0 block w-[130px] sm:ml-4">
          <ActivityDropdown value={activity} setValue={setActivity} counts={activityCnts} />
        </div>
      </div>
    </div>
  );
};

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
  margin-right: 40px;
  line-height: 100%;
  height: fit-content;
  color: ${({ active }) => (active ? "#FFDE0D" : "#FFFFFF59")};
  white-space: nowrap;
  @media screen and (max-width: 640px) {
    margin-right: 20px;
  }
`;
export default SelectionPanel;
