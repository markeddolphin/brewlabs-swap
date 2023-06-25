import { useMemo } from "react";

import { ChevronCircleDownSVG, InfoSVG } from "components/dashboard/assets/svgs";

import { NetworkOptions } from "config/constants/networks";
import { useClaim } from "hooks/swap/useClaim";
import { useCurrency } from "hooks/Tokens";
import { CurrencyLogo } from "components/logo";
import { getLPPrice, rewardInUSD } from ".";
import StyledButton from "views/directory/StyledButton";
import Link from "next/link";
import { getAddLiquidityUrl } from "utils/functions";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { usePair } from "data/Reserves";

const PairCard = ({ pair, token0Price, token1Price, reward, pairDayData, isRemovable, balance }) => {
  const { token0, token1 } = pair;

  const currency0 = useCurrency(token0);
  const currency1 = useCurrency(token1);

  const [_pairState, _pair] = usePair(currency0, currency1);

  const volumeUSD =
    Number(token0Price) * Number(pairDayData?.dailyVolumeToken0 ?? "0") +
    Number(token1Price) * Number(pairDayData?.dailyVolumeToken1 ?? "0");
  const rewardUSD = rewardInUSD(currency0, currency1, token0Price, token1Price, reward);
  const lpPrice = getLPPrice(token0Price, token1Price, _pair);

  const { claim } = useClaim();
  const { chainId } = useActiveChainId();
  const network = useMemo(() => NetworkOptions.filter((network) => network.id == chainId)[0], [chainId]);

  // const lpPrice = useDexPrice(chainId, pair.id);

  return (
    <div className="primary-shadow mb-2.5 flex flex-col items-start justify-between rounded-[30px] p-[24px_12px_24px_12px] shadow sm:flex-row sm:items-center sm:p-[24px_15px_24px_24px]">
      <div className="flex items-center">
        <img className="h-10 w-10 rounded-full" src={network.image} alt={network.name} />
        <div className="mx-4 flex w-full items-center justify-center sm:w-[180px]">
          <CurrencyLogo currency={currency0} size="39px" />
          <div className="-ml-2">
            <CurrencyLogo currency={currency1} size="39px" />
          </div>
          <div className="ml-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-white">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-white">
              {currency0.symbol}-{currency1.symbol}
            </div>
            <div className="text-xs text-[#FFFFFF80]">Vol. ${volumeUSD?.toFixed(2) ?? 0} (24hrs) </div>
          </div>
        </div>
      </div>
      <div className="mb-4 mt-4 flex w-full flex-col sm:mb-0 sm:mt-0 sm:w-fit sm:flex-row">
        {isRemovable ? (
          <Link href={getAddLiquidityUrl(currency0, currency1, chainId)} target={"_blank"}>
            <StyledButton type={"secondary"} className="relative mr-0 !h-9 !w-full !border-0 sm:mr-2 sm:!w-[130px]">
              <div className="-ml-4 text-xs leading-none">Remove Liquidity</div>
              <div className="absolute right-2 -scale-y-125 scale-x-125 text-[#EEBB19]">{ChevronCircleDownSVG}</div>
              <div className="absolute -bottom-5 left-2 flex items-center">
                <div
                  className="tooltip z-10 flex items-center"
                  data-tip="Approximate value of your liquidity position in this pair."
                >
                  <div className="-mt-[3px] mr-1.5 scale-[110%] text-[#ffffffb3]">
                    <InfoSVG opacity="1" />
                  </div>
                </div>
                <div className="text-xs text-[#FFFFFF80]">${(lpPrice * balance).toFixed(4)} USD</div>
              </div>
            </StyledButton>
          </Link>
        ) : (
          ""
        )}
        <StyledButton
          type={"secondary"}
          className="relative mt-2 !h-9 !w-full !border-0 sm:mt-0 sm:!w-[110px]"
          onClick={() => {
            claim(pair);
          }}
        >
          <div className="text-xs leading-none">Harvest</div>
          <div className="absolute right-2 scale-125 text-[#EEBB19]">{ChevronCircleDownSVG}</div>
          <div className="absolute -bottom-5 left-2 flex items-center">
            <div
              className="tooltip z-10 flex items-center"
              data-tip="Combined value of swap fees made up of pair tokens."
            >
              <div className="-mt-[3px] mr-1.5 scale-[110%] text-[#ffffffb3]  ">
                <InfoSVG opacity="1" />
              </div>
            </div>
            <div className="text-xs text-[#FFFFFF80]">${rewardUSD.toFixed(4)} USD</div>
          </div>
        </StyledButton>
      </div>
    </div>
  );
};

export default PairCard;
