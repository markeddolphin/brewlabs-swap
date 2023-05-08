import { ReactNode } from "react";

const Badge = ({ children }: { children: ReactNode }) => {
  return (
    <span className="inline-flex h-8 items-center rounded-full border-2 px-3 py-0.5 text-sm font-medium text-dark dark:text-white dark:border-brand">
      {children}
    </span>
  );
};

export default Badge;
