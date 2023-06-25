import { useRef } from "react";
import { useRouter } from "next/router";
import { Tooltip as ReactTooltip } from "react-tooltip";
import styled from "styled-components";
import Carousel from "react-multi-carousel";

import TokenLogo from "@components/logo/TokenLogo";
import { SkeletonComponent } from "components/SkeletonComponent";
import { useGlobalState } from "state";
import { useIndexes } from "state/indexes/hooks";
import { getChainLogo, getIndexName } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import { InfoSVG } from "./assets/svgs";

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 720 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 768, min: 530 },
    items: 1,
  },
  small: {
    breakpoint: { max: 530, min: 0 },
    items: 1,
  },
};

const IndexPerformance = () => {
  const { indexes } = useIndexes();
  const carouselRef: any = useRef();
  const router = useRouter();
  let splitIndex: any = [];
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");

  for (let i = 0; i < Math.ceil(indexes.length / 3); i++) splitIndex.push(indexes.slice(i * 3, i * 3 + 3));

  const CustomDot = ({ onClick, ...rest }: any) => {
    const { active } = rest;

    // onMove means if dragging or swiping in progress.
    // active is provided by this lib for checking if the item is active or not.
    return <DotGroup active={active} onClick={() => onClick()} />;
  };
  return (
    <StyledContainer className="-mt-2 w-full">
      <div className="relative font-semibold text-yellow">
        Index Performance
        <div className="absolute -left-4 top-1.5" id={"Top9"}>
          <InfoSVG opacity="1" />
        </div>
        <ReactTooltip anchorId={"Top9"} place="right" content="Top 9 Brewlabs Indexes based on performance." />
      </div>
      <div className="mx-auto w-full max-w-[652px] sm:max-w-[676px]">
        <Carousel
          arrows={false}
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={4000}
          ref={carouselRef}
          customDot={<CustomDot onClick={() => {}} />}
          showDots={true}
        >
          {splitIndex.map((indexes, i) => {
            return (
              <div className="w-full" key={i}>
                {indexes.map((data: any, i) => {
                  let sortedPercentChanges = data.priceChanges;
                  if (!sortedPercentChanges) sortedPercentChanges = [undefined, undefined, undefined, undefined];
                  else {
                    sortedPercentChanges = sortedPercentChanges.map((data) => data.percent);
                  }
                  return (
                    <div
                      key={i}
                      className="flex cursor-pointer items-center justify-between rounded p-[12px_4px_12px_8px] transition hover:bg-[rgba(50,50,50,0.4)] sm:p-[12px_12px_12px_24px] "
                      onClick={() => {
                        router.push(`/indexes/${data.chainId}/${data.pid}`);
                        setIsOpen(0);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="flex w-[60px]">
                          {data.tokens.map((data, i) => {
                            return (
                              <TokenLogo
                                key={i}
                                src={getTokenLogoURL(data.address, data.chainId, data.logo)}
                                classNames="-mr-3 h-6 w-6"
                              />
                            );
                          })}
                        </div>
                        <img src={getChainLogo(data.chainId)} alt={""} className="ml-3 h-5 w-5" />
                        <div className="ml-3 w-[70px] overflow-hidden text-ellipsis whitespace-nowrap font-roboto text-xs font-semibold text-white sm:w-[140px]">
                          {getIndexName(data.tokens)}
                        </div>
                      </div>
                      <div className="flex">
                        {sortedPercentChanges.map((data, i) => {
                          if (window.innerWidth < 550 && i != 0) return;
                          const names = ["24hrs", "7D", "30D"];
                          return (
                            <div key={i} className="mr-5 text-xs font-semibold ">
                              {data ? (
                                <div className={data < 0 ? "text-danger" : "text-green"}>
                                  {data >= 0 ? "+" : ""} {data.toFixed(2)}% {names[i]}
                                </div>
                              ) : (
                                <SkeletonComponent />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </Carousel>
      </div>
    </StyledContainer>
  );
};

const DotGroup = styled.div<{ active?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #ffde00;
  background: ${({ active }) => (active ? "#FFDE00" : "transparent")};
  transition: all 0.15s;
  :hover {
    background: ${({ active }) => (active ? "#FFDE00" : "#ffdd004c")};
  }
  margin-right: 8px;
  z-index: 100;
`;

const StyledContainer = styled.div`
  .react-tooltip {
    z-index: 100;
    font-size: 13px;
    line-height: 125%;
    text-align: center;
  }
  .react-multi-carousel-list {
    overflow: unset !important;
    overflow-x: clip !important;
  }
  .react-multi-carousel-dot-list {
    bottom: -20px !important;
  }
`;

export default IndexPerformance;
