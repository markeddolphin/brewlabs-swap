/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const DropDown = ({ value, setValue, data }: { setValue?: any; value: number; data: string[] }) => {
  const [open, setOpen] = useState(false);
  const dropRef: any = useRef();

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, []);

  return (
    <StyledDropDown
      className="relative z-10 flex h-[24px] w-full cursor-pointer items-center justify-between text-xs text-black"
      ref={dropRef}
      onClick={() => setOpen(!open)}
      open={open}
    >
      <div>{data[value]}</div>
      <div>{!open ? <ChevronDownIcon className={"h-3"} /> : <ChevronUpIcon className={"h-3 "} />}</div>
      <DropDownBody className={"absolute transition-all"} open={open}>
        {data.map((data, i) => {
          return (
            <div
              key={i}
              className="flex h-[24px] cursor-pointer items-center justify-center transition-all hover:bg-[#424444bf]"
              onClick={() => setValue(i)}
            >
              {data}
            </div>
          );
        })}
      </DropDownBody>
    </StyledDropDown>
  );
};

export default DropDown;

const StyledDropDown = styled.div<{ open: boolean }>`
  border-radius: 12px;
  background: rgb(46, 52, 62);
  border-bottom-left-radius: ${({ open }) => (open ? 0 : "12px")};
  border-bottom-right-radius: ${({ open }) => (open ? 0 : "12px")};
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  color: #ffffffbf;
  padding: 0 8px;
`;

const DropDownBody = styled.div<{ open: boolean }>`
  height: ${({ open }) => (open ? "73px" : 0)};
  overflow: hidden;
  background: rgb(46, 52, 62);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border: ${({ open }) => (open ? "0.5px solid rgba(255, 255, 255, 0.5)" : "none")};
  border-top: none;
  width: calc(100% + 2px);
  left: -1px;
  top: 23px;
`;
