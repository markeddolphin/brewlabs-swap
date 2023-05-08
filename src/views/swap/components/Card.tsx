import { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => (
  <div className="px-4 py-2 text-gray-400 rounded-lg border-slate-100 bg-slate-300 bg-opacity-60 font-brand dark:border-slate-600 dark:bg-zinc-900 dark:bg-opacity-60 dark:text-white">
    {children}
  </div>
);

export default Card;
