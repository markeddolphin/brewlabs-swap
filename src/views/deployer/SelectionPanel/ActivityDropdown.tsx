/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const ActivityDropdown = ({ value, setValue, counts }: { setValue?: any; value: string, counts: any }) => {
  const [open, setOpen] = useState(false);
  const dropRef: any = useRef();

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, []);

  const data = {
    active: {
      text: "Active",
      color: "#2FD35DBF",
    },
    finished: {
      text: "Finished",
      color: "#FFFFFF80",
    },
    new: {
      text: "New",
      color: "#EEBB19",
    },
  };

  return (
    <StyledDropDown
      className="portfolio-shadow relative z-10 flex h-[30px] w-full cursor-pointer items-center justify-center bg-[#D9D9D91A] text-sm text-[#FFFFFF80]"
      ref={dropRef}
      onClick={() => setOpen(!open)}
      open={open}
    >
      <div className="flex w-full items-center justify-between px-3">
        <div className="flex items-center">
          <StyledCircle color={data[value].color} />
          <div>{data[value].text} <span className="text-[11px]">({counts[value] ?? 0})</span></div>
        </div>
        <div className={""}>
          {!open ? <ChevronDownIcon className={"h-[14px]"} /> : <ChevronUpIcon className={"h-[14px]"} />}
        </div>
      </div>

      <DropDownBody className={"absolute top-[30px] w-full rounded-b transition-all"} open={open}>
        {Object.keys(data).map((key, i) => {
          return (
            <div
              key={i}
              className="flex h-[30px] cursor-pointer items-center justify-between px-3 font-normal transition-all hover:bg-[#45516a]"
              onClick={() => setValue(key)}
            >
              <div className="flex items-center">
                <StyledCircle color={data[key].color} />
                <div>{data[key].text} <span className="text-[11px]">({counts[key] ?? 0})</span></div>
              </div>
              <div className="w-3" />
            </div>
          );
        })}
      </DropDownBody>
    </StyledDropDown>
  );
};

export default ActivityDropdown;

const StyledCircle = styled.div<{ color: String }>`
  border-radius: 50%;
  width: 7px;
  height: 7px;
  margin-right: 7px;
  background: ${({ color }) => color};
  box-shadow: 0px 0px 1px 1px ${({ color }) => color}; ;
`;

const StyledDropDown = styled.div<{ open: Boolean }>`
  border-radius: 8px;
  border-bottom-left-radius: ${({ open }) => (open ? 0 : "8px")};
  border-bottom-right-radius: ${({ open }) => (open ? 0 : "8px")};
`;

const DropDownBody = styled.div<{ open: Boolean }>`
  height: ${({ open }) => (open ? "90px" : 0)};
  overflow: hidden;
  background: rgb(51, 60, 78);
`;
