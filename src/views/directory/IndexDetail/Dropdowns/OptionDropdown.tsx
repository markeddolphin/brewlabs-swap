/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const OptionDropdown = ({ data, setValue }: { data: any; setValue: any }) => {
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
      className="primary-shadow relative z-10 flex h-8 w-[140px] cursor-pointer items-center justify-between bg-[rgb(46,47,56)] text-sm text-[#FFFFFF80]"
      ref={dropRef}
      onClick={() => setOpen(!open)}
      open={open}
    >
      <div>Index Options</div>
      <div>{!open ? <ChevronDownIcon className={"h-3"} /> : <ChevronUpIcon className={"h-3 "} />}</div>
      <DropDownBody className={"primary-shadow absolute transition-all"} open={open} length={data.length}>
        {data.map((data, i) => {
          return (
            <div
              key={i}
              className="flex h-8 cursor-pointer items-center justify-center transition-all hover:bg-[#424444bf] text-center"
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

export default OptionDropdown;

const StyledDropDown = styled.div<{ open: boolean }>`
  border-radius: 4px;
  border-bottom-left-radius: ${({ open }) => (open ? 0 : "4px")};
  border-bottom-right-radius: ${({ open }) => (open ? 0 : "4px")};
  color: #ffffffbf;
  padding: 0 8px 0 12px;
`;

const DropDownBody = styled.div<{ open: boolean; length: number }>`
  height: ${({ open, length }) => (open ? `${32 * length}px` : 0)};
  overflow: hidden;
  background: rgb(46, 47, 56);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top: none;
  width: 100%;
  left: 0px;
  top: 32px;
`;
