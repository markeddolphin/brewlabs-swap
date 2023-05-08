import React from "react";
import styled from "styled-components";

const SwitchButton = ({ setValue, value }: { setValue?: any; value: number }) => {
  return (
    <StyledContainer value={value} className={"flex rounded bg-primary text-sm font-semibold text-black"}>
      <div onClick={() => setValue(0)}>My Wallet</div>
      <div onClick={() => setValue(1)}>Total Market</div>
    </StyledContainer>
  );
};

export default SwitchButton;

const StyledContainer = styled.div<{ value: number }>`
  > div {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
  }
  width: 220px;
  height: 25px;
  > div:nth-child(${({ value }) => (value + 1 === 1 ? 2 : 1)}) {
    background: #18171c;
    color: white;
    border: 1px solid #efbb19;
  }
  margin-top: -15px;
`;
