// Right now this only supports 3 buttons, we can extend it as needed

import clsx from "clsx";
import { useState } from "react";

export default function ButtonGroup() {
  const [isActive, setIsActive] = useState(0);

  const buttons = [
    {
      label: "Live",
      value: "live",
    },
    {
      label: "Unverified",
      value: "Unverified",
    },
    {
      label: "Finished",
      value: "finished",
    },
  ];

  return (
    <span className="relative isolate inline-flex shrink-0 overflow-hidden rounded-2xl bg-gray-100 p-1 font-brand shadow-sm dark:bg-zinc-900">
      {buttons.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => setIsActive(index)}
          className={clsx(
            index === 0 && "rounded-l-xl",
            index === 2 && "rounded-r-xl",
            index === isActive
              ? "bg-gray-800 text-green-400"
              : "bg-gray-100 text-gray-700 dark:bg-zinc-900 dark:text-gray-400",
            "relative inline-flex items-center border border-gray-200 px-3 py-1 text-sm font-medium  hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800  "
          )}
        >
          {item.label}
        </button>
      ))}
    </span>
  );
}
