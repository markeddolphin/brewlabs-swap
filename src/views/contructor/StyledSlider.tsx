import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect } from "react";
import styled from "styled-components";

const StyledSlider = ({ value, setValue }: { value: number; setValue: any }) => {
  useEffect(() => {
    const isExisiting = document.getElementsByClassName("rc-slider-svg");
    if (isExisiting.length) return;
    const handle = document.getElementsByClassName("rc-slider-handle");
    var handleButton = document.createElement("div");
    handleButton.classList.add("rc-slider-svg");
    handleButton.innerHTML = `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg style='height:34px;'">
    <path fillRule="evenodd" clip-rule="evenodd" d="M54 27C54 19.8392 51.1554 12.9716 46.0919 7.90812C41.0284 2.84463 34.1608 0 27 0C19.8392 0 12.9716 2.84463 7.90812 7.90812C2.84464 12.9716 0 19.8392 0 27C0 34.1608 2.84464 41.0284 7.90812 46.0919C12.9716 51.1554 19.8392 54 27 54C34.1608 54 41.0284 51.1554 46.0919 46.0919C51.1554 41.0284 54 34.1608 54 27V27ZM16.875 23.625C15.9799 23.625 15.1215 23.9806 14.4885 24.6135C13.8556 25.2465 13.5 26.1049 13.5 27C13.5 27.8951 13.8556 28.7535 14.4885 29.3865C15.1215 30.0194 15.9799 30.375 16.875 30.375H28.9778L24.6139 34.7389C23.9991 35.3754 23.6589 36.2279 23.6666 37.1129C23.6743 37.9978 24.0292 38.8443 24.655 39.47C25.2807 40.0958 26.1272 40.4507 27.0121 40.4584C27.8971 40.4661 28.7496 40.1259 29.3861 39.5111L39.5111 29.3861C40.1438 28.7532 40.4993 27.8949 40.4993 27C40.4993 26.1051 40.1438 25.2468 39.5111 24.6139L29.3861 14.4889C28.7496 13.8741 27.8971 13.5339 27.0121 13.5416C26.1272 13.5493 25.2807 13.9042 24.655 14.53C24.0292 15.1557 23.6743 16.0022 23.6666 16.8871C23.6589 17.7721 23.9991 18.6246 24.6139 19.2611L28.9778 23.625H16.875Z" fill="#EEBB19"/>
    </svg>
    `;
    handle[0].appendChild(handleButton);
  }, []);
  return (
    <StyledContainer>
      <Tip
        left={`calc((100%) / 100 * ${value}) `}
        className="absolute z-10 whitespace-nowrap border border-[#FFFFFF40] bg-[rgb(40,40,42)] py-0.5 text-[10px] text-[#FFFFFFBF]"
      >
        {Number(value).toFixed(2)}%
      </Tip>
      <Slider value={value} onChange={(e) => setValue(e.valueOf())} />
    </StyledContainer>
  );
};

const Tip = styled.div<{ left: string }>`
  margin-left: ${({ left }) => left};
  bottom: -40px;
  left: -30px;
  width: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const StyledContainer = styled.div`
  position: relative;
  flex: 1;
  margin: 0 20px;
  .rc-slider-step {
    height: 1px !important;
    background: transparent !important;
  }
  .rc-slider-track {
    height: 1px !important;
    background: rgb(24, 24, 27) !important;
  }
  .rc-slider-rail {
    height: 1px !important;
    background: rgba(255, 255, 255, 0.25) !important;
  }
  .rc-slider-handle {
    border: none !important;
    margin-top: -17px !important;
    opacity: 1;
    background: #18181b;
    cursor: default !important;
    width: 34px !important;
    height: 34px !important;
    box-shadow: none !important;
  }
`;
export default StyledSlider;
