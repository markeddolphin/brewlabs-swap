/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const OptionDropdown = ({ handleMintNft, setAddNFTModalOpen }: { handleMintNft: any; setAddNFTModalOpen: any }) => {
  const data = ["Mint Index NFT", "Add Index NFT"];
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
      className="relative z-10 flex h-8 w-[140px] cursor-pointer items-center justify-between bg-[rgb(46,47,56)] text-sm text-[#FFFFFF80]"
      ref={dropRef}
      onClick={() => setOpen(!open)}
      open={open}
    >
      <div>Index Options</div>
      <div>{!open ? <ChevronDownIcon className={"h-3"} /> : <ChevronUpIcon className={"h-3 "} />}</div>
      <DropDownBody className={"absolute transition-all"} open={open}>
        {data.map((data, i) => {
          return (
            <div
              key={i}
              className="flex h-8 cursor-pointer items-center justify-center transition-all hover:bg-[#424444bf]"
              onClick={() => (i === 0 ? handleMintNft() : setAddNFTModalOpen(true))}
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
  border-radius: 6px;
  border-bottom-left-radius: ${({ open }) => (open ? 0 : "6px")};
  border-bottom-right-radius: ${({ open }) => (open ? 0 : "6px")};
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  color: #ffffffbf;
  padding: 0 8px 0 12px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const DropDownBody = styled.div<{ open: boolean }>`
  height: ${({ open }) => (open ? "65px" : 0)};
  overflow: hidden;
  background: rgb(46, 47, 56);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border: ${({ open }) => (open ? "0.5px solid rgba(255, 255, 255, 0.5)" : "none")};
  border-top: none;
  width: calc(100% + 2px);
  left: -1px;
  top: 32px;
`;
