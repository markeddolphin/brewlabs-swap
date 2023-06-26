import { ChevronCircleDownSVG, InfoSVG } from "components/dashboard/assets/svgs";
import { useState, useMemo, useEffect, useContext } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import PairCard from "./PairCard";
import OutlinedButton from "../button/OutlinedButton";
import { useClaim } from "hooks/swap/useClaim";
import { Currency, JSBI, Pair, TokenAmount } from "@brewlabs/sdk";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useLiquidityPools } from "@hooks/swap/useLiquidityPools";
import useTokenMarketChart, { defaultMarketData } from "@hooks/useTokenMarketChart";
import { BigNumber } from "ethers";
import { getPairDayDatas } from "lib/swap/pairs";
import { useGraphEndPoint } from "@hooks/swap/useGraphEndPoint";
import StyledButton from "views/directory/StyledButton";
import { SwapContext } from "contexts/SwapContext";
import Notification from "@components/Notification";

export const rewardInUSD = (token0, token1, token0Price, token1Price, reward) => {
  const { lpRewards, ownerRewards, referralRewards } = reward || {};

  const token0Amount = new TokenAmount(
    token0,
    BigNumber.from(lpRewards?.amount0 ?? 0)
      .add(ownerRewards?.amount0 ?? 0)
      .add(referralRewards?.amount0 ?? 0)
      .toString()
  ).toExact();
  const token1Amount = new TokenAmount(
    token1,
    BigNumber.from(lpRewards?.amount1 ?? 0)
      .add(ownerRewards?.amount1 ?? 0)
      .add(referralRewards?.amount1 ?? 0)
      .toString()
  ).toExact();
  return Number(token0Price) * Number(token0Amount) + Number(token1Price) * Number(token1Amount);
};

const SwapRewards = () => {
  const { chainId, account } = useActiveWeb3React();
  // const account = "0xe1f1dd010bbc2860f81c8f90ea4e38db949bb16f";

  const [curFilter, setCurFilter] = useState(0);
  const [criteria, setCriteria] = useState("");

  const { claimAll } = useClaim();
  const { setAddLiquidityStep }: any = useContext(SwapContext);

  /**
   * pairs are initialized with hardcoded infos
   * they should be fetched from subgraph
   */
  const { swapFeeData }: any = useContext(SwapContext);
  const { eligiblePairs, ownedPairs, lpBalances, collectiblePairs, rewards, pairTokens } = swapFeeData;

  const tokenMarketData = useTokenMarketChart(chainId);
  const pairs = useLiquidityPools();

  const graphEndPoint = useGraphEndPoint();
  const [pairDayDatas, setPairDayDatas] = useState<any[]>([]);

  useEffect(() => {
    if (ownedPairs.length == 0 || !graphEndPoint.router) return;
    (async () => {
      const pairDayDatas = await getPairDayDatas(
        graphEndPoint.router,
        ownedPairs.map((pair) => pair.id)
      );
      setPairDayDatas(pairDayDatas);
    })();
  }, [ownedPairs, graphEndPoint]);

  const totalRewards = useMemo(() => {
    if (Object.keys(pairTokens ?? {}).length === 0) return 0;
    return ownedPairs.reduce((sum, pair) => {
      const { token0, token1 } = pair;
      const { usd: token0Price } = tokenMarketData[token0?.toLowerCase()] || defaultMarketData;
      const { usd: token1Price } = tokenMarketData[token1?.toLowerCase()] || defaultMarketData;
      sum += rewardInUSD(pairTokens[token0], pairTokens[token1], token0Price, token1Price, rewards[pair.id]);
      return sum;
    }, 0);
  }, [ownedPairs, rewards, tokenMarketData, pairTokens]);

  // const totalRewards = 0;
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
    <div className="font-brand">
      <ReactTooltip
        anchorId={"brewSwapInfo"}
        place="right"
        content="Pairs on BrewSwap distribute trading volume fees to liquidity providers, owners and token holders instantly"
      />
      <div className="flex flex-col items-center justify-between xsm:flex-row">
        <div className="relative ml-4 text-2xl text-white sm:ml-0">
          <span className="ml-2 text-[#FCD34D]">Brew</span>Swap Fees
          <div className="absolute -left-3 top-2.5 scale-150 text-white" id={"brewSwapInfo"}>
            <InfoSVG />
          </div>
        </div>
        <div className="relative mt-4 h-[36px] w-[134px] xsm:mt-0">
          <StyledButton
            type={"secondary"}
            className="!border-0"
            onClick={() => {
              claimAll(pairs);
            }}
          >
            <div className="relative text-xs leading-none">
              Harvest <span className="text-[#EEBB19]">All</span>
              <Notification count={collectiblePairs.length} className="!-right-12 !-top-5" />
            </div>
            <div className="absolute right-2 scale-125 text-[#EEBB19]">{ChevronCircleDownSVG}</div>
          </StyledButton>
          <div className="absolute -bottom-5 left-2 flex items-center">
            <div className="-mt-[3px] mr-1.5 scale-[110%] text-[#ffffffb3] ">
              <InfoSVG opacity="1" />
            </div>
            <div className="text-xs text-[#FFFFFF80]">${totalRewards.toFixed(4)} USD</div>
          </div>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap">
        {filters.map((data, i) => {
          const active = curFilter === i;
          return (
            <div
              key={i}
              onClick={() => setCurFilter(i)}
              className={`mt-2 cursor-pointer rounded-lg p-[5px_10px] text-xs ${
                active ? "bg-[#FFFFFF40] text-yellow" : "bg-[#D9D9D926] text-[FFFFFF59] hover:text-white"
              } primary-shadow mr-2.5 h-fit whitespace-nowrap leading-[1.2]`}
            >
              {data}
            </div>
          );
        })}
      </div>
      <div className="mt-2  w-full ">
        <input
          placeholder="Search token..."
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          className="primary-shadow focusShadow h-fit w-full rounded border-none bg-[#D9D9D926] p-[7px_10px] text-xs leading-[1.2] text-white !outline-none"
        />
      </div>
      <div className="yellowScroll mt-3 max-h-[400px] overflow-y-scroll">
        {filteredPairs.map((pair, index) => {
          const { token0, token1 } = pair;
          const { usd: token0Price } = tokenMarketData[token0?.toLowerCase()] || defaultMarketData;
          const { usd: token1Price } = tokenMarketData[token1?.toLowerCase()] || defaultMarketData;
          const pairDayData = pairDayDatas
            .filter((data) => data.pairAddress.toLowerCase() === pair.id.toLowerCase())
            .reduce(
              (result, data) => {
                result.dailyVolumeToken0 += Number(data.dailyVolumeToken0);
                result.dailyVolumeToken1 += Number(data.dailyVolumeToken1);
                return result;
              },
              { dailyVolumeToken0: 0, dailyVolumeToken1: 0 }
            );
          return (
            <PairCard
              pair={pair}
              key={index}
              token0Price={token0Price}
              token1Price={token1Price}
              reward={rewards[pair.id]}
              pairDayData={pairDayData}
              isRemovable={pairsOfLpProvider.find((data) => pair.id === data.id)}
              lpBalance={parseFloat(lpBalances[pair.id].toExact() ?? 0)}
            />
          );
        })}
      </div>
      <div className="mt-8">
        <OutlinedButton className="mt-2" small onClick={() => setAddLiquidityStep("default")}>
          Back
        </OutlinedButton>
      </div>
    </div>
  );
};

export default SwapRewards;
