import { ChevronCircleDownSVG, ChevronDownSVG, downSVG } from "@components/dashboard/assets/svgs";
import { useEffect, useRef, useState } from "react";
import getTokenLogoURL from "utils/getTokenLogoURL";

const CurrencyDropdown = ({
  value,
  setValue,
  currencies,
  className,
}: {
  value: any;
  setValue: any;
  currencies: any;
  className?: string;
}) => {
  const dropRef: any = useRef();
  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, []);
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${className} primary-shadow relative z-10 flex cursor-pointer items-center justify-between rounded p-[12px_10px] text-white`}
      onClick={() => setOpen(!open)}
      ref={dropRef}
    >
      <div className="flex flex-1 items-center justify-between">
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{value.symbol}</div>
        <img
          src={getTokenLogoURL(value.address, value.chainId)}
          alt={""}
          className="ml-2.5 h-[18px] w-[18px] rounded-full"
        />
      </div>
      <div className="ml-2.5 text-tailwind">{ChevronDownSVG}</div>
      <div className={`primary-shadow absolute left-0 top-[44px] ${open ? "" : "hidden"} rounded`}>
        {currencies.map((data: any, i: number) => {
          return (
            <div
              key={i}
              className={`${className} flex cursor-pointer items-center justify-between rounded p-[12px_10px] text-white transition-all hover:bg-[#292929]`}
              onClick={() => setValue(data)}
            >
              <div className="flex flex-1 items-center justify-between">
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{data.symbol}</div>
                <img
                  src={getTokenLogoURL(data.address, data.chainId)}
                  alt={""}
                  className="ml-2.5 h-[18px] w-[18px] rounded-full"
                />
              </div>
              <div className="w-[21px]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurrencyDropdown;
