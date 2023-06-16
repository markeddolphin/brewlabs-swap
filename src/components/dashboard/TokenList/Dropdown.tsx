import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const DropDown = ({
  value,
  setValue,
  values,
  width = "w-32",
  type = "primary",
}: {
  setValue?: any;
  value: number;
  values: any;
  width?: string;
  type?: string;
}) => {
  const dropdownRef: any = useRef();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dropdownRef && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, []);

  return (
    <div className={`dropdown ${width} `} onClick={() => setOpen(!open)} ref={dropdownRef}>
      <label
        tabIndex={0}
        className={`btn-sm btn flex w-full justify-between ${
          type === "primary"
            ? " active:bg-brand dark:hover:bg-dark dark:hover:text-brand bg-amber-400  dark:text-zinc-800"
            : "bg-[rgb(42,48,60)] text-[rgb(166,173,186)] hover:text-gray-400 h-fit p-2 text-base normal-case font-normal"
        }`}
      >
        {values[value]}
        {!open ? <ChevronDownIcon className="h-3" /> : <ChevronUpIcon className="h-3" />}
      </label>
      <ul
        tabIndex={0}
        className={clsx("dropdown-content menu rounded-box w-full bg-base-100 shadow", !open && "hidden")}
      >
        {values.map((data, i) => {
          return (
            <li key={i}>
              <button className="p-2" onClick={() => setValue(i)}>
                {data}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DropDown;
