/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const   DropDown = ({ value, setValue, data }: { setValue?: any; value: number; data: any[] }) => {
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
      className="primary-shadow relative z-10 flex h-[30px] w-full cursor-pointer items-center justify-center bg-primary text-sm text-black"
      ref={dropRef}
      onClick={() => setOpen(!open)}
      open={open}
    >
      <div className="font-semibold">{data[value]}</div>
      <div className={"absolute right-1"}>
        {!open ? <ChevronDownIcon className={"h-3 w-6"} /> : <ChevronUpIcon className={"h-3 w-6"} />}
      </div>
      <DropDownBody className={"absolute top-[30px] w-full rounded-b transition-all"} open={open}>
        {data.map((data, i) => {
          return (
            <div
              key={i}
              className="flex h-[30px] cursor-pointer items-center justify-center font-semibold transition-all hover:bg-[#ffde7c]"
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
  border-radius: 8px;
  border-bottom-left-radius: ${({ open }) => (open ? 0 : "8px")};
  border-bottom-right-radius: ${({ open }) => (open ? 0 : "8px")};
  z-index: 100;
`;

const DropDownBody = styled.div<{ open: Boolean }>`
  height: ${({ open }) => (open ? "183px" : 0)};
  overflow: hidden;
  background: linear-gradient(180deg, #ffcc32, #e5cc7e);
`;
