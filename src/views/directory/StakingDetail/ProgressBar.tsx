/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { SkeletonComponent } from "components/SkeletonComponent";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useActiveChainId } from "hooks/useActiveChainId";

const ProgressBar = ({
  block,
  rewards,
}: {
  block: {
    start: number | undefined;
    end: number | undefined;
    current: number | undefined;
  };
  rewards: {
    deposit: number | undefined;
    available: number | undefined;
  };
}) => {
  const [filter, setFilter] = useState(0);
  const [percent, setPercent] = useState(0);

  const { chainId } = useActiveChainId();

  let total = filter === 0 ? block.end - block.start : rewards.deposit;
  let remaining =
    filter === 0 ? Math.max(0, block.end - block.current) : Math.max(0, rewards.deposit - rewards.available);

  useEffect(() => {
    setPercent(remaining ? Math.min(((total - remaining) / total) * 100, 100) : 0);
  }, [block.start, block.end, block.current, rewards.deposit, rewards.available, filter]);

  return (
    <div>
      <div>Pool Query</div>
      <div className="flex">
        <div className="min-w-[150px] sm:min-w-[180px]">
          <Menu as="div" className="relative inline-block w-full text-left text-xs sm:text-sm">
            <div>
              <Menu.Button className="inline-flex w-full items-center justify-between whitespace-nowrap rounded-lg bg-gray-300/10 py-1.5 pl-2 pr-2 font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 sm:pr-3">
                <SignalLight></SignalLight>
                {filter === 0 ? "Blocks Remaining" : "Reward Balance"}
                <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute mt-2 w-56 divide-y divide-gray-100 rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-400/20 text-white" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => setFilter(0)}
                      >
                        Blocks Remaining
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-400/20 text-white" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => setFilter(1)}
                      >
                        Reward Balance
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <div className="mt-1 w-full sm:mt-1.5">
          <StyledProgressBar percent={percent}>
            <div />
          </StyledProgressBar>
          <div className="ml-3 mt-1 text-xs">
            {filter === 0 ? (
              <>
                Blocks Remaining:{" "}
                {!block.current || !block.start || !block.end ? (
                  <SkeletonComponent />
                ) : (
                  <a
                    href={`https://${chainId === 1 ? "etherscan.io" : "bscscan.com"}/block/${block.end}`}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className="dark:text-primary"
                  >
                    {remaining}
                  </a>
                )}
              </>
            ) : (
              <>
                Reward Balance:&nbsp;
                {!rewards.available || !rewards.deposit ? (
                  <SkeletonComponent />
                ) : (
                  <span className="dark:text-primary">{remaining.toFixed(2)}</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SignalLight = styled.div`
  border-radius: 50%;
  width: 7px;
  height: 7px;
  margin-right: 7px;
  background: rgba(47, 211, 93, 0.75);
  box-shadow: 0px 0px 1px 1px rgba(47, 211, 93, 0.75);
`;

const StyledProgressBar = styled.div<{ percent: number }>`
  border: 1px solid rgba(185, 184, 184, 0.5);
  width: 100%;
  height: 22px;
  position: relative;
  margin-left: 12px;
  border-radius: 6px;
  overflow: hidden;
  > div {
    position: absolute;
    top: -1px;
    left: -1px;
    height: calc(100% + 2px);
    width: ${({ percent }) => `calc(${percent}% + 2px)`};
    background: #eebb19;
    border-radius: 6px;
    transition: ease-in-out 1.2s;
    cursor: pointer;
    :hover {
      box-shadow: 0px 0px 5px #eebb19;
    }
  }
`;

export default ProgressBar;
