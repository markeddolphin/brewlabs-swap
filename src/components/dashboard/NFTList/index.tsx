/* eslint-disable react-hooks/exhaustive-deps */

import { getChainLogo } from "utils/functions";
import { LinkSVG } from "../assets/svgs";
import { useContext, useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";

import styled from "styled-components";
import { DashboardContext } from "contexts/DashboardContext";
import { UserContext } from "contexts/UserContext";
import { useGlobalState } from "state";

const responsive = {
  1: {
    breakpoint: { max: 10000, min: 1700 },
    items: 1,
  },
  2: {
    breakpoint: { max: 1700, min: 1024 },
    items: 1,
  },
  3: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
  },
  4: {
    breakpoint: { max: 768, min: 640 },
    items: 1,
  },
  5: {
    breakpoint: { max: 640, min: 420 },
    items: 1,
  },
  6: {
    breakpoint: { max: 420, min: 0 },
    items: 1,
  },
};

const NFTList = () => {
  const carouselRef = useRef();
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [nftCount, setNFTCount] = useState(1);
  const { nfts, selectedDeployer }: any = useContext(DashboardContext);
  const { changeAvatar }: any = useContext(UserContext);

  useEffect(() => {
    const _colCount = window.innerWidth >= 590 ? 3 : window.innerWidth >= 415 ? 2 : 1;
    setNFTCount(Math.max(1, Math.floor((window.innerHeight - 400) / 227) * _colCount));
  }, []);

  let nftList = [];
  for (let i = 0; i < Math.ceil(nfts.length / nftCount); i++) {
    let temp = [];
    for (let j = i * nftCount; j < Math.min(i * nftCount + nftCount, nfts.length); j++) temp.push(nfts[j]);
    nftList.push(temp);
  }

  const CustomDot = ({ onClick, ...rest }: any) => {
    const { active } = rest;

    // onMove means if dragging or swiping in progress.
    // active is provided by this lib for checking if the item is active or not.
    return <DotGroup active={active} onClick={() => onClick()} />;
  };

  return (
    <StyledContainer className="w-full">
      <Carousel
        arrows={false}
        responsive={responsive}
        infinite={true}
        autoPlay={false}
        ref={carouselRef}
        customDot={<CustomDot onClick={() => {}} />}
        showDots={true}
      >
        {nftList.map((data, i) => {
          return (
            <div key={1000 + i} className="flex w-full flex-wrap justify-center">
              {data.map((data: any, i: any) => {
                return (
                  <div
                    key={i}
                    className="mx-5 my-5 w-[135px] overflow-hidden rounded-[12px] font-roboto text-xs font-medium transition-all duration-700 hover:scale-[120%]"
                  >
                    <div className="flex h-[135px] items-center justify-center overflow-hidden">
                      <img
                        src={data.logo}
                        alt={""}
                        className="h-full max-w-fit cursor-pointer"
                        onClick={(e: any) => {
                          if (isOpen === 2) {
                            changeAvatar(selectedDeployer, e.target.src);
                            setIsOpen(0);
                          }
                        }}
                        onError={(e: any) =>
                          (e.target.src =
                            "https://maverickbl.mypinata.cloud/ipfs/QmbQXSQQETMcQkAeaMFH5NBNGbYW7Q5QE5476XVbaW3XRs")
                        }
                      />
                    </div>
                    <div className="flex w-full items-center bg-white px-1.5 py-1">
                      <img src={getChainLogo(data.chainId)} alt={""} className="h-3 w-3" />
                      <div className="ml-2 flex w-[calc(100%-20px)] text-black">
                        <div className="mr-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {data.collectionName}
                        </div>
                        <div>#{data.tokenId}</div>
                      </div>
                    </div>
                    <a className="w-full" href={"https://truenft.io/inventory"} target={"_blank"}>
                      <div className="flex items-center justify-between bg-[#0E2130] p-1.5 text-yellow">
                        <div>Visit on TrueNFT</div>
                        <div>{LinkSVG}</div>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          );
        })}
      </Carousel>
    </StyledContainer>
  );
};

export default NFTList;

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
