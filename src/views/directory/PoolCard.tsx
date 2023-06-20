import styled from "styled-components";

import { CHAIN_ICONS } from "config/constants/networks";
import { Category, PoolCategory } from "config/constants/types";
import { formatAmount, formatTvl } from "utils/formatApy";
import { getIndexName, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import IndexLogo from "components/logo/IndexLogo";
import { SkeletonComponent } from "components/SkeletonComponent";
import { useRouter } from "next/router";
import { isAddress } from "utils";

const poolNames = {
  [Category.POOL]: "Staking Pool",
  [Category.FARM]: "Yield Farms",
  [Category.INDEXES]: "Brewlabs Index",
  [Category.ZAPPER]: "Zapper Pools",
};

const PoolCard = ({
  data,
  index,
  setSelectPoolDetail,
  setCurPool,
}: {
  data: any;
  index: number;
  setSelectPoolDetail: any;
  setCurPool: any;
}) => {
  const router = useRouter();
  let token: any, quoteToken: any;
  if (data.type === Category.ZAPPER) {
    token = isAddress(data.token.address);
    quoteToken = isAddress(data.quoteToken.address);
  }
  return (
    <StyledContainer
      index={index}
      onClick={() => {
        setSelectPoolDetail(true);
        switch (data.type) {
          case Category.POOL:
            // setCurPool({ type: Category.POOL, pid: data.sousId, chainId: data.chainId });
            router.push(`/staking/${data.chainId}/${data.sousId}`);
            break;
          case Category.FARM:
            // setCurPool({ type: Category.FARM, pid: data.farmId, chainId: data.chainId });
            router.push(`/farms/${data.chainId}/${data.contractAddress}`);
            break;
          case Category.INDEXES:
            // setCurPool({ type: Category.INDEXES, pid: data.pid });
            router.push(`/indexes/${data.chainId}/${data.pid}`);
            break;
          case Category.ZAPPER:
            setCurPool({ type: Category.ZAPPER, pid: data.pid, chainId: data.chainId });
            break;
          default:
            setSelectPoolDetail(false);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="w-[80px] pl-4">
          <img src={CHAIN_ICONS[data.chainId]} alt={""} className="w-9" />
        </div>
        <div className="flex w-[210px] items-center">
          {data.type === Category.INDEXES ? (
            <IndexLogo tokens={data.tokens} />
          ) : data.type === Category.ZAPPER ? (
            <IndexLogo tokens={[data.token, data.quoteToken]} appId={data.appId} />
          ) : (
            <div className="mr-3 h-7 w-7 rounded-full border border-white bg-white">
              <img
                src={getTokenLogoURL(data.earningToken.address, data.earningToken.chainId)}
                alt={""}
                className="rounded-full"
              />
            </div>
          )}
          <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {data.type === Category.INDEXES ? (
              <div className="overflow-hidden text-ellipsis text-sm leading-none">{getIndexName(data.tokens)}</div>
            ) : data.type === Category.ZAPPER ? (
              <div className="text-sm leading-none ">
                <div>{getIndexName([data.token, data.quoteToken])}</div>
                <div>Earning : {data.earningToken.symbol}</div>
              </div>
            ) : (
              <div className="overflow-hidden text-ellipsis leading-none">
                <span className="text-primary">Earn</span> {data.earningToken.symbol}
              </div>
            )}
            <div className="overflow-hidden text-ellipsis text-xs">
              {poolNames[data.type]} -{" "}
              {data.poolCategory === PoolCategory.CORE || data.type !== Category.POOL
                ? "Flexible"
                : `${data.duration ? data.duration : "__"} days lock`}
            </div>
            <div className="text-xs leading-none ">
              {data.type === Category.INDEXES ? (
                data.priceChanges ? (
                  <div
                    className={`${
                      data.priceChanges[0].percent >= 0 ? "text-success" : "text-danger"
                    } overflow-hidden text-ellipsis`}
                  >
                    Performance -{" "}
                    {isNaN(data.priceChanges[0].percent) ? "0.00" : Math.abs(data.priceChanges[0].percent).toFixed(2)}%
                    24hrs
                  </div>
                ) : (
                  <SkeletonComponent />
                )
              ) : (
                ""
              )}
              {data.type === Category.INDEXES && data.category === undefined && (
                <span className="text-warning">Migrated</span>
              )}
            </div>
          </div>
        </div>
        <div className="min-w-[70px]">
          {data.tvl || data.tvl === 0.0 ? `${formatTvl(data.tvl, 1)}` : <SkeletonComponent />}
        </div>
        <div className="min-w-[250px]">
          {data.totalStaked !== undefined ? (
            data.type === Category.INDEXES ? (
              <div className="leading-none">
                {data.tokens.map((t, index) => (
                  <div key={index} className="text-[14px]">
                    {formatAmount(data.totalStaked[index])} {t.symbol}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {formatAmount(data.totalStaked)}{" "}
                {[Category.FARM, Category.ZAPPER].includes(data.type)
                  ? data.lpSymbol.split(" ")[0]
                  : data.stakingToken.symbol}
              </>
            )
          ) : (
            <SkeletonComponent />
          )}
        </div>
        <div className="min-w-[80px]">
          {data.type !== Category.INDEXES ? (
            data.apr || data.apr === 0.0 ? (
              `${(+data.apr).toFixed(2)}%`
            ) : (
              <div className="mr-2">{<SkeletonComponent />}</div>
            )
          ) : (
            "N/A"
          )}
        </div>
      </div>
      <div className="flex hidden flex-col px-6">
        <div className="flex  items-center justify-between ">
          <div className="flex items-center">
            {data.type === Category.INDEXES ? (
              <IndexLogo tokens={data.tokens} />
            ) : (
              <img
                src={getTokenLogoURL(data.earningToken.address, data.earningToken.chainId)}
                alt={""}
                className="mr-3 w-7 rounded-full"
              />
            )}
            <div>
              <div className="leading-none">
                {data.type === Category.INDEXES ? (
                  <>{getIndexName(data.tokens)}</>
                ) : (
                  <>
                    <span className="text-primary">Earn</span> {data.earningToken.symbol}
                  </>
                )}
              </div>
              <div className="text-xs">
                {poolNames[data.type]} - {data.lockup === undefined ? "Flexible" : `${data.duration} day lock`}
              </div>
              <div className="text-xs leading-none">
                {data.type === Category.INDEXES ? (
                  data.priceChanges ? (
                    <div className={data.priceChanges[0].percent >= 0 ? "text-success" : "text-danger"}>
                      Performance - {data.priceChanges[0].percent.toFixed(2)}% 24hrs
                    </div>
                  ) : (
                    <SkeletonComponent />
                  )
                ) : (
                  ""
                )}
                {data.type === Category.INDEXES && (data.pid === 3 || data.pid === 5) && (
                  <span className="text-warning">{data.pid === 3 ? "Attention needed" : "Migrated"}</span>
                )}
              </div>
            </div>
          </div>
          <img src={CHAIN_ICONS[data.chainId]} alt={""} className="w-9" />
        </div>
        <div className="mt-6 flex flex-col items-start justify-between xsm:flex-row xsm:items-center">
          <div className="flex text-2xl">
            APR:&nbsp;
            {data.type !== 3 ? (
              data.apr !== undefined ? (
                `${(+data.apr).toFixed(2)}%`
              ) : (
                <div className="mr-2">{<SkeletonComponent />}</div>
              )
            ) : (
              "N/A"
            )}
          </div>
          <div>
            <div className="text-left xsm:text-right">Total supply staked</div>
            <div className="text-left text-sm xsm:text-right">
              {data.totalStaked !== undefined ? (
                data.type === Category.INDEXES ? (
                  <div className="leading-none">
                    {data.tokens.map((t, index) => (
                      <div key={index} className="text-[14px]">
                        {formatAmount(data.totalStaked[index])} {t.symbol}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {formatAmount(data.totalStaked)}{" "}
                    {[Category.FARM, Category.ZAPPER].includes(data.type)
                      ? data.lpSymbol.split(" ")[0]
                      : data.stakingToken.symbol}
                  </>
                )
              ) : (
                <SkeletonComponent />
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col items-start justify-between xsm:flex-row xsm:items-center">
          <div className="flex">
            TVL:&nbsp;{data.tvl !== undefined ? `$${numberWithCommas(data.tvl.toFixed(2))}` : <SkeletonComponent />}
          </div>
        </div>
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ index: number }>`
  background: ${({ index }) => (index % 2 ? "#D9D9D91A" : "#D9D9D90D")};
  border-radius: 4px;
  color: #ffffffbf;
  font-size: 18px;
  padding: 15px 0;
  margin-bottom: 10px;
  transition: 0.3s all;
  border: 1px solid transparent;
  :hover {
    border-color: #ffde0d;
  }
  cursor: pointer;

  @media screen and (max-width: 1080px) {
    padding: 24px 0;
    > div:nth-child(1) {
      display: none;
    }
    > div:nth-child(2) {
      display: flex !important;
    }
  }
`;

export default PoolCard;
