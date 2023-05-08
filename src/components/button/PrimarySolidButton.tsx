import React, { ReactElement } from "react";

const PrimarySolidButton = ({
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
        className="flex items-center justify-center rounded-lg bg-primary px-7 py-1 font-brand font-bold text-lg tracking-wider text-dark shadow-sm outline-none transition hover:bg-opacity-60"
      >
        {children}
      </a>
    ) : (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex items-center justify-center rounded-lg bg-primary px-7 py-1 font-brand font-bold text-lg tracking-wider text-dark shadow-sm outline-none transition hover:bg-opacity-60"
      >
        {children}
      </button>
    )}
  </>
);

export default PrimarySolidButton;
