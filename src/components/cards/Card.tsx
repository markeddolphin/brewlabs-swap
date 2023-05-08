import clsx from "clsx";
import { ReactNode } from "react";

const Card = ({ children, shadowColor }: { children: ReactNode; shadowColor?: string }) => (
  <div
    className={clsx(
      "shadow-right w-54 min-w-fit rounded-lg border-t bg-white bg-opacity-90 px-4 py-2 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-zinc-900",
      `shadow-${shadowColor}`
    )}
  >
    {children}
  </div>
);

export default Card;
