import React from "react";
import styled from "styled-components";

const SwitchButton = ({
  setValue,
  value,
  values,
  className,
}: {
  setValue?: any;
  value: number;
  values: any;
  className?: string;
}) => {
  return (
    <StyledContainer value={value} className={`flex rounded-md text-sm font-semibold ${className}`}>
      {values.map((data, i) => {
        return (
          <div key={i} onClick={() => setValue(i)}>
            {data}
          </div>
        );
      })}
    </StyledContainer>
  );
};

export default SwitchButton;

const StyledContainer = styled.div<{ value: number }>`
  > div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
  }
  background: #efbb19;
  color: #18171c;
  padding: 1px;
  > div:nth-child(${({ value }) => value + 1}) {
    background: #18171c;
    color: white;
  }

  margin-top: -15px;
`;
