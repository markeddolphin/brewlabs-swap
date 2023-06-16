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
      className="primary-shadow relative z-10 flex h-7 w-full cursor-pointer items-center bg-[#2a303b] pl-4 text-sm text-[#FFFFFFBF]"
      ref={dropRef}
      onClick={() => setOpen(!open)}
      open={open}
    >
      <div className="font-semibold">{data[value]}</div>
      <div className={"absolute right-1"}>
        {!open ? <ChevronDownIcon className={"h-3 w-6"} /> : <ChevronUpIcon className={"h-3 w-6"} />}
      </div>
      <DropDownBody
        className={"absolute left-0 top-7 w-full rounded-b transition-all"}
        open={open}
        length={data.length}
      >
        {data.map((data, i) => {
          return (
            <div
              key={i}
              className="flex h-7 cursor-pointer items-center pl-4 font-semibold transition-all hover:bg-[#575b63]"
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

const StyledDropDown = styled.div<{ open: Boolean }>`
  border-radius: 4px;
  border-bottom-left-radius: ${({ open }) => (open ? 0 : "4px")};
  border-bottom-right-radius: ${({ open }) => (open ? 0 : "4px")};
  z-index: 100;
`;

const DropDownBody = styled.div<{ open: Boolean; length: number }>`
  height: ${({ open, length }) => (open ? `${30 * length}px` : 0)};
  overflow: hidden;
  background: linear-gradient(180deg, #393f49, #2a303b);
`;
