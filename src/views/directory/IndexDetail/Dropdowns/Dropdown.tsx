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
      className="primary-shadow relative z-10 flex h-[20px] w-full cursor-pointer items-center justify-between text-xs text-black"
      ref={dropRef}
      onClick={() => setOpen(!open)}
      open={open}
    >
      <div>{data[value]}</div>
      <div>{!open ? <ChevronDownIcon className={"h-3"} /> : <ChevronUpIcon className={"h-3 "} />}</div>
      <DropDownBody className={"primary-shadow absolute"} open={open}>
        {data.map((data, i) => {
          return (
            <div
              key={i}
              className="flex h-[20px] cursor-pointer items-center justify-center transition-all hover:bg-[#424444bf]"
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
  color: #ffffffbf;
  padding: 0 8px;
`;

const DropDownBody = styled.div<{ open: boolean }>`
  height: ${({ open }) => (open ? "60px" : 0)};
  overflow: hidden;
  background: rgb(46, 52, 62);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  width: 100%;
  left: 0px;
  top: 20px;
`;
