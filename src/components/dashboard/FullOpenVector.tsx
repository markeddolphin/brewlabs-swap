import React from "react";
import styled from "styled-components";
import { fullOpenSVG } from "./assets/svgs";
import StyledButton from "./StyledButton";

const FullOpenVector = ({
  open,
  setOpen,
  pageIndex,
  setPageIndex,
  maxPage,
}: {
  setOpen?: any;
  open: boolean;
  pageIndex: number;
  setPageIndex: any;
  maxPage: number;
}) => {
  return (
    <div>
      {open ? (
        <ButtonField className={"flex justify-between"}>
          <div>
            <div className={"h-[25px] w-[160px]"}>
              <StyledButton disabled={pageIndex <= 0} onClick={() => setPageIndex(pageIndex - 1)}>
                Back
              </StyledButton>
            </div>
          </div>
          <div>
            <div className={"h-[25px] w-[160px]"}>
              <StyledButton onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex >= maxPage - 1}>
                Next
              </StyledButton>
            </div>
          </div>
        </ButtonField>
      ) : (
        ""
      )}
      <div className={"mt-3 flex w-full justify-between"}>
        <StyledBorder />
        <StyledImage onClick={() => setOpen(!open)} open={open}>
          {fullOpenSVG}
        </StyledImage>
        <StyledBorder />
      </div>
    </div>
  );
};

export default FullOpenVector;

const ButtonField = styled.div`
  > div {
    width: calc((100% - 85px) / 2);
    display: flex;
  }
  > div:first-child {
    justify-content: flex-end;
  }
`;
const StyledBorder = styled.div`
  border-bottom: 1px solid rgba(255, 222, 0, 0.5);
  width: calc((100% - 85px) / 2);
  height: 0px;
  margin-top: 4px;
`;

const StyledImage = styled.div<{ open: boolean }>`
  transform: rotate(${({ open }) => (open ? "180deg" : "0")});
  margin-top: ${({ open }) => (open ? "-16px" : "0")};
  cursor: pointer;
  color: #efbb19;
  position: relative;
  :hover {
    color: white;
  }
`;
