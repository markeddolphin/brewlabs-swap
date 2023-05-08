/* eslint-disable react-hooks/exhaustive-deps */
import CorePool from "./CorePool";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styled from "styled-components";
import AutoFarmer from "./AutoFarmer";
import TrueNFT from "./TrueNFT";
import { useRef, useState } from "react";

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1400 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 1400, min: 1000 },
    items: 1,
  },
  small: {
    breakpoint: { max: 1000, min: 100 },
    items: 1,
  },
};

const Banner = ({
  setSelectPoolDetail,
  setCurPool,
  allPools,
}: {
  setSelectPoolDetail: any;
  setCurPool: any;
  allPools: any;
}) => {
  const carouselRef: any = useRef();
  const [curSlide, setCurSlide] = useState(0);

  return (
    <div className="mb-5">
      <Carousel
        arrows={false}
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        beforeChange={(nextSlide, { currentSlide, onMove }: any) => {
          setCurSlide((nextSlide - 2) % 3);
        }}
        ref={carouselRef}
      >
        <CorePool setSelectPoolDetail={setSelectPoolDetail} index={195} setCurPool={setCurPool} pools={allPools} />
        <CorePool setSelectPoolDetail={setSelectPoolDetail} index={209} setCurPool={setCurPool} pools={allPools} />
        {/* <AutoFarmer /> */}
        <TrueNFT />
      </Carousel>
      <DotGroup active={curSlide}>
        <div
          onClick={() => {
            carouselRef.current.goToSlide(2);
            // setCurSlide((curSlide + 2) % 3);
          }}
        />
        <div
          onClick={() => {
            carouselRef.current.goToSlide(3);
            // setCurSlide((curSlide + 2) % 3);
          }}
        />
        <div
          onClick={() => {
            carouselRef.current.goToSlide(4);
            // setCurSlide((curSlide + 2) % 3);
          }}
        />
      </DotGroup>
    </div>
  );
};

export default Banner;

const DotGroup = styled.div<{ active: number }>`
  display: flex;
  width: fit-content;
  margin: 0 auto;
  margin-top: 20px;
  > div {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid #ffffff40;
    background: transparent;
    transition: all 0.15s;
    :hover {
      background: #ffffff10;
    }
  }
  > div:not(:last-child) {
    margin-right: 12px;
  }
  > div:nth-child(${({ active }) => active + 1}) {
    background: #ffffff40;
  }
`;
