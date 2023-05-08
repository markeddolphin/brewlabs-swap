/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { SkeletonComponent } from "components/SkeletonComponent";

const ProgressBar = ({ endBlock, remaining }: { endBlock: number; remaining: number }) => {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setPercent(remaining ? Math.min((remaining / endBlock) * 100, 100) : 0);
  }, [endBlock, remaining]);
  return (
    <div>
      <div className="mb-2 flex flex-col items-end text-xl leading-none">
        <div className="text-[#FFFFFFBF]">Pool Duration</div>
        <div className="flex text-base text-[#FFFFFF80]">
          Blocks Remaining:&nbsp;
          <span className="text-primary">Perpetual</span>
        </div>
      </div>
      <StyledProgressBar percent={100}>
        <div />
      </StyledProgressBar>
    </div>
  );
};

const StyledProgressBar = styled.div<{ percent: number }>`
  border: 1px solid rgba(185, 184, 184, 0.5);
  width: 100%;
  height: 22px;
  position: relative;
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
