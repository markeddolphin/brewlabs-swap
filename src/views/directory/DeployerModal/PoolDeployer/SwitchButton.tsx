/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const SwitchButton = ({ value, setValue }: { setValue?: any; value: number }) => {
  return (
    <div className="relative flex h-7 w-[100px] rounded bg-[#B9B8B81A]">
      <div
        className={`${
          value === 0 ? "text-[#FFFFFFBF]" : "text-[#FFFFFF80]"
        } z-10 flex flex-1 cursor-pointer items-center justify-center transition`}
        onClick={() => setValue(0)}
      >
        Yes
      </div>
      <div
        className={`${
          value === 1 ? "text-[#FFFFFFBF]" : "text-[#FFFFFF80]"
        } z-10 flex flex-1 cursor-pointer items-center justify-center transition`}
        onClick={() => setValue(1)}
      >
        No
      </div>
      <div
        className={`absolute top-0 ${value === 0 ? "left-0" : "left-[50%]"} h-full w-[50%] rounded bg-[#B9B8B81A] transition-all`}
      />
    </div>
  );
};

export default SwitchButton;
