/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const OptionDropdown = ({ values, setValue, status }: { values: string[]; setValue: any; status?: any[] }) => {
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
      <DropDownBody className={"primary-shadow absolute transition-all"} open={open}>
        {values.map((data, i) => {
          return (
            <div
              key={i}
              className={`flex h-8 cursor-pointer items-center justify-center text-center text-xs transition-all hover:bg-[#424444bf] ${
                status[i] ? "" : "hidden"
              }`}
              onClick={() => status[i] && setValue(i)}
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

const DropDownBody = styled.div<{ open: boolean }>`
  height: ${({ open }) => (open ? `auto` : 0)};
  overflow: hidden;
  background: rgb(46, 47, 56);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top: none;
  width: 100%;
  left: 0px;
  top: 32px;
`;
