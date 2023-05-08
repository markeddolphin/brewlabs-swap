import React, { ReactElement } from "react";

const Button = ({
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
        className="flex items-center justify-center rounded-md outline-none bg-dark px-4 py-2 text-base font-bold tracking-wider text-brand shadow-sm transition hover:bg-brand hover:text-dark font-brand"
      >
        {children}
      </a>
    ) : (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex items-center justify-center rounded-md outline-none bg-dark px-4 py-2 text-base font-bold tracking-wider text-brand shadow-sm transition hover:bg-brand hover:text-dark font-brand"
      >
        {children}
      </button>
    )}
  </>
);

export default Button;
