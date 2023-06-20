import styled from "styled-components";
import { CHAIN_ICONS } from "config/constants/networks";
import { PoolCategory } from "config/constants/types";
import { upSVG } from "components/dashboard/assets/svgs";
import LogoIcon from "components/LogoIcon";
import { SkeletonComponent } from "components/SkeletonComponent";
import { getNativeSybmol } from "lib/bridge/helpers";
import StyledButton from "../StyledButton";
import { BASE_URL } from "config";

const CorePool = ({
  setSelectPoolDetail,
  index,
  setCurPool,
  pools,
}: {
  setSelectPoolDetail: any;
  index: number;
  setCurPool: any;
  pools: any;
}) => {
  const data = pools.find((pool) => pool.sousId === index);

  const CreatePoolInfoPanel = (type: string) => {
    return (
      <PoolInfoPanel type={type}>
        <div className="relative w-full text-xs text-[#FFFFFF80]">
          <div className="flex flex-wrap justify-between">
            <div className="flex text-xl text-[#FFFFFFBF]">
              Core Pool:{" "}
              <span className="ml-2 text-primary">{data ? data.earningToken.symbol : <SkeletonComponent />}</span>
            </div>
            <div className="flex text-xl text-primary">
              <span className="mr-1 text-[#FFFFFFBF]">APR:</span>
              {data && (data.apr || data.apr === 0.0) ? `${data.apr.toFixed(2)}%` : <SkeletonComponent />}
            </div>
          </div>
          <div className="flex flex-wrap justify-between text-base">
            <div className="flex max-w-full">
              Stake <span className="mx-1 text-primary">{data ? data.stakingToken.symbol : <SkeletonComponent />}</span>
              earn{" "}
              <span className="ml-1 overflow-hidden text-ellipsis text-primary">
                {data ? data.earningToken.symbol : <SkeletonComponent />}
              </span>
            </div>
            <div className="text-primary">
              {data ? (
                data.poolCategory === PoolCategory.CORE ? (
                  "Flexible"
                ) : (
                  `${data.duration} day lock`
                )
              ) : (
                <SkeletonComponent />
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-between">
            <div>
              <div className="flex">
                <span className="mr-1">Deposit Fee</span>
                {data ? `${data.depositFee.toFixed(2)}%` : <SkeletonComponent />}
              </div>
              <div className="flex">
                <span className="mr-1">Withdrawal Fee</span>
                {data ? `${data.withdrawFee.toFixed(2)}%` : <SkeletonComponent />}
              </div>
              <div className="flex">
                <span className="mr-1">Performance Fee</span>
                {data ? (
                  `${data.performanceFee / Math.pow(10, 18)} ${getNativeSybmol(data.chainId)}`
                ) : (
                  <SkeletonComponent />
                )}
              </div>
            </div>
            <div className="flex items-center text-primary">
              {upSVG}
              <div className="ml-2">Acending APR</div>
            </div>
          </div>
          <div className="absolute bottom-1 right-1">
            {data ? <img src={CHAIN_ICONS[data.chainId]} alt={""} className="w-6" /> : <SkeletonComponent />}
          </div>
        </div>
      </PoolInfoPanel>
    );
  };

  return (
    <div className="rounded border border-[#FFFFFF40] bg-[#B9B8B80D] px-3 py-[22px] sm:px-5">
      <div className="flex max-w-[1120px] items-center justify-between">
        <LogoIcon classNames="w-24 min-w-[96px] text-dark dark:text-brand sm:ml-6 ml-0" />

        {CreatePoolInfoPanel("pc")}

        <div className="w-[50%] max-w-[200px] md:w-[340px] md:max-w-full">
          <a href={`${BASE_URL}/swap?outputCurrency=${data?.stakingToken.address}`} target={"_blank"} rel="noreferrer">
            <div className="h-[50px]">
              <StyledButton>
                <span className="mr-1">Get</span> {data ? data.stakingToken.symbol : <SkeletonComponent />}
              </StyledButton>
            </div>
          </a>
          <div className="mt-2 h-[50px]">
            {data ? (
              <StyledButton
                onClick={() => {
                  setSelectPoolDetail(true);
                  setCurPool({ type: data.type, pid: data.sousId, chainId: data.chainId });
                }}
              >
                Deposit {data.stakingToken.symbol}
              </StyledButton>
            ) : (
              <StyledButton>
                <span className="mr-1">Deposit</span> <SkeletonComponent />
              </StyledButton>
            )}
          </div>
        </div>
      </div>

      {CreatePoolInfoPanel("mobile")}
    </div>
  );
};

const PoolInfoPanel = styled.div<{ type: string }>`
  border: 1px solid white;
  background: #b9b8b80d;
  padding: 14px 26px 8px 26px;
  border-radius: 4px;
  display: ${({ type }) => (type === "pc" ? "flex" : "none")};
  justify-content: space-between;
  width: 100%;
  max-width: 540px;
  margin: 0 20px;
  @media screen and (max-width: 768px) {
    display: ${({ type }) => (type !== "pc" ? "flex" : "none")};
    max-width: 100%;
    margin: 20px 0 0 0;
  }
  @media screen and (max-width: 640px) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;
export default CorePool;
