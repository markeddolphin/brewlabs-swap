/* eslint-disable react-hooks/exhaustive-deps */

import styled from "styled-components";
import { formatAmount } from "utils/formatApy";

const StakingHistory = ({ history }: { history: any }) => {
  return (
    <StyledContainer className="mt-7 flex-1 overflow-y-scroll text-[#FFFFFFBF]">
      <div className="flex justify-between text-xl">
        <div className="min-w-[150px]">Stake</div>
        <div className="min-w-[60px]">Block</div>
        <div className="min-w-[80px] text-right">Lock</div>
      </div>
      <div className="mt-2 h-[1px] w-full bg-[#FFFFFF80]" />
      <div>
        {history.map((data, i) => {
          return (
            <div className="flex items-center justify-between border-b border-b-[#FFFFFF40] py-2.5" key={i}>
              <div className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                {formatAmount(data.amount.toString(), 5)} <span className="text-primary">{data.symbol}</span>
              </div>
              <div className="w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">{data.blockNumber}</div>
              <div className="w-[80px] overflow-hidden  text-ellipsis whitespace-nowrap text-right">N/A</div>
            </div>
          );
        })}
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  padding-right: 4px;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    display: block !important;
  }

  ::-webkit-scrollbar-track {
  }
  ::-webkit-scrollbar-thumb:vertical {
    border: 6px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #eebb19;
  }
  @media screen and (max-width: 768px) {
    height: fit-content;
    ::-webkit-scrollbar {
      display: none !important;
    }
    overflow-x: scroll;
  }
`;

export default StakingHistory;
