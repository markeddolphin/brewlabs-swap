import { ChevronDownSVG, InfoSVG, downSVG } from "components/dashboard/assets/svgs";
import { useState, useMemo, useCallback } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import styled from "styled-components";
import Pair from "./Pair";
import StyledButton from "views/directory/StyledButton";
import OutlinedButton from "../button/OutlinedButton";
import { useClaim } from "hooks/swap/useClaim";
import { JSBI, Token } from "@brewlabs/sdk";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { filterTokens } from "components/searchModal/filtering";
import { useTokenBalancesWithLoadingIndicator } from "state/wallet/hooks";
import { useLiquidityPools } from "@hooks/swap/useLiquidityPools";

const SwapRewards = () => {
  const { chainId, account } = useActiveWeb3React();

  const [curFilter, setCurFilter] = useState(0);
  const [criteria, setCriteria] = useState("");

  const { claimAll } = useClaim();

  /**
   * pairs are initialized with hardcoded infos
   * they should be fetched from subgraph
   */

  const pairs = useLiquidityPools();

  const lpTokens = useMemo(() => pairs.map((pair) => new Token(chainId, pair.id, 18)), [chainId, pairs]);
  const [lpBalances] = useTokenBalancesWithLoadingIndicator(account, lpTokens);

  const inputFilter = useCallback(
    (pair) =>
      filterTokens([new Token(chainId, pair.token0, 18), new Token(chainId, pair.token1, 18)], criteria).length > 0,
    [criteria]
  );

  const eligiblePairs = useMemo(() => {
    if (!account || !pairs || !pairs.length) return [];
    return pairs
      .filter(
        (pair) =>
          pair.referrer === account || pair.tokenOwner === account || lpBalances[pair.id]?.greaterThan(JSBI.BigInt(0))
      )
      .filter(inputFilter);
  }, [account, pairs]);

  const pairsOfReferrer = eligiblePairs.filter((pair) => pair.referrer === account);
  const pairsOfTokenOwner = eligiblePairs.filter((pair) => pair.tokenOwner === account);
  const pairsOfLpProvider = eligiblePairs.filter((pair) => lpBalances[pair.id]?.greaterThan(JSBI.BigInt(0)));

  const filters = [
    `All (${pairsOfLpProvider.length + pairsOfReferrer.length + pairsOfTokenOwner.length})`,
    `Referrer (${pairsOfReferrer.length})`,
    `Liquidity provider (${pairsOfLpProvider.length})`,
    `Token owner (${pairsOfTokenOwner.length})`,
  ];

  const filteredPairs = useMemo(() => {
    if (curFilter == 1) {
      return pairsOfReferrer;
    } else if (curFilter == 2) {
      return pairsOfLpProvider;
    } else if (curFilter == 3) {
      return pairsOfTokenOwner;
    }
    return eligiblePairs;
  }, [chainId, account, eligiblePairs, pairsOfReferrer, pairsOfLpProvider, pairsOfTokenOwner, lpBalances, curFilter]);

  return (
    <StyledContainer className="font-roboto">
      <ReactTooltip
        anchorId={"brewSwapInfo"}
        place="right"
        content="Pairs on BrewSwap distribute trading volume fees to liquidity providers, owners and token holders instantly"
      />
      <div className="flex flex-col items-center justify-between xsm:flex-row">
        <div className="relative ml-4 text-2xl text-white sm:ml-0">
          <span className="ml-2 text-[#FCD34D]">Brew</span>Swap Rewards
          <div className="absolute -left-3 top-2.5 scale-150 text-white" id={"brewSwapInfo"}>
            <InfoSVG />
          </div>
        </div>
        <div className="relative mt-4 h-[36px] w-[134px] xsm:mt-0">
          <StyledButton
            type={"quinary"}
            onClick={() => {
              claimAll(pairs);
            }}
          >
            <div className="text-xs leading-none">
              Harvest <span className="text-[#EEBB19]">All</span>
            </div>
            <div className="absolute right-2 scale-125 text-[#EEBB19]">{ChevronDownSVG}</div>
          </StyledButton>
          <div className="absolute -bottom-5 left-2 flex items-center">
            <div className="mr-2 scale-125 text-white">
              <InfoSVG />
            </div>
            <div className="text-xs text-[#FFFFFF80]">$4.42 USD</div>
          </div>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap">
        {filters.map((data, i) => {
          return (
            <FilterButton key={i} active={curFilter === i} onClick={() => setCurFilter(i)} className="mt-2">
              {data}
            </FilterButton>
          );
        })}
      </div>
      <div className="mt-2  w-full ">
        <SearchInput placeholder="Search token..." value={criteria} onChange={(e) => setCriteria(e.target.value)} />
      </div>
      {filteredPairs.map((pair, index) => (
        <Pair pair={pair} key={index} />
      ))}
      <div className="mt-8">
        <OutlinedButton href="https://brewlabs.info/" className="mt-2" small>
          Back
        </OutlinedButton>
      </div>
    </StyledContainer>
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

const StyledContainer = styled.div`
  .react-tooltip {
    width: 300px;
    z-index: 100;
  }
`;

export default SwapRewards;
