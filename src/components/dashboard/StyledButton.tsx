import React, { ReactElement } from "react";

const StyledButton = ({
  onClick,
  disabled,
  children,
  type,
}: {
  onClick?: any;
  disabled?: boolean;
  children?: any;
  type?: string;
}): ReactElement =>
  type === "scam" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="portfolio-shadow flex h-full w-full items-center justify-center rounded bg-danger text-sm font-semibold text-black transition "
    >
      {children}
    </button>
  ) : (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="portfolio-shadow flex h-full w-full items-center justify-center rounded bg-primary text-sm font-semibold text-black transition hover:bg-dark hover:text-brand disabled:cursor-[not-allowed] disabled:bg-transparent disabled:text-white"
    >
      {children}
    </button>
  );

export default StyledButton;
