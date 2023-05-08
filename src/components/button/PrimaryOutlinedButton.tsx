import React, { ReactElement } from "react";

const PrimaryOutlinedButton = ({
  children,
  onClick,
  externalLink,
  disabled,
}: {
  onClick?: any;
  externalLink?: string;
  disabled?: boolean;
  children: React.ReactNode;
}): ReactElement => (
  <>
    {externalLink !== undefined ? (
      <a
        href={externalLink}
        target="_blank"
        rel="noreferrer"
        className={`${
          disabled ? "cursor-not-allowed border-gray-700 text-gray-700" : "border-primary bg-primary text-black"
        } flex items-center justify-center rounded-md border bg-transparent px-12 py-1 font-roboto text-[10px] font-bold tracking-wider shadow-sm outline-none transition active:shadow-inner`}
      >
        {children}
      </a>
    ) : (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${
          disabled ? "cursor-not-allowed border-gray-700 text-gray-700" : "border-primary bg-primary text-black"
        } flex items-center justify-center rounded border bg-transparent px-12 py-1.5 font-roboto text-[10px] font-bold tracking-wider shadow-sm outline-none transition active:shadow-inner`}
      >
        {children}
      </button>
    )}
  </>
);

export default PrimaryOutlinedButton;
