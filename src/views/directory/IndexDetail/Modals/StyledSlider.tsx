import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";

const StyledSlider = ({
  value,
  setValue,
  balance,
  symbol,
}: {
  value: number;
  setValue: any;
  balance: number;
  symbol: string;
}) => {
  return (
    <StyledContainer>
      <Tip
        left={`calc((100%) / 100 * ${value}) `}
        className="absolute whitespace-nowrap border border-[#FFFFFF40] py-1 text-xs text-[#FFFFFFBF]"
      >
        {Number((balance / 100) * value).toFixed(0)} {symbol}
      </Tip>
      <Slider value={value} onChange={(e) => setValue(e.valueOf())} />
    </StyledContainer>
  );
};

const Tip = styled.div<{ left: string }>`
  margin-left: ${({ left }) => left};
  top: -36px;
  left: -30px;
  width: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const StyledContainer = styled.div`
  position: relative;
  flex: 1;
  margin: 0 20px;
  .rc-slider-step {
    height: 1px !important;
    background: rgba(255, 255, 255, 0.25) !important;
  }
  .rc-slider-track {
    height: 1px !important;
    background: rgba(255, 255, 255, 0.25) !important;
  }
  .rc-slider-rail {
    height: 1px !important;
    background: rgba(255, 255, 255, 0.25) !important;
  }
  .rc-slider-handle {
    border: none !important;
    margin-top: -8px !important;
    background-color: rgba(255, 255, 255) !important;
    cursor: default !important;
    width: 16px !important;
    height: 16px !important;
    box-shadow: none !important;
  }
`;
export default StyledSlider;
