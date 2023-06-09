import React, { ReactElement } from "react";
import { Oval } from "react-loader-spinner";

const PrimarySolidButton = ({
  children,
  onClick,
  externalLink,
  disabled,
  pending,
}: {
  onClick?: any;
  externalLink?: string;
  disabled?: boolean;
  children: React.ReactNode;
  pending?: boolean;
}): ReactElement => (
  <>
    {externalLink !== undefined ? (
      <a
        href={externalLink}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center rounded-lg bg-primary px-7 py-1 font-brand text-lg font-bold tracking-wider text-dark shadow-sm outline-none transition hover:bg-opacity-60"
      >
        {children}
      </a>
    ) : (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="relative flex items-center justify-center rounded-lg bg-primary px-7 py-1 font-brand text-lg font-bold tracking-wider text-dark shadow-sm outline-none transition enabled:hover:bg-opacity-60 disabled:cursor-not-allowed disabled:opacity-80"
      >
        {children}
        {pending ? (
          <div className="absolute right-2 top-0 flex h-full items-center">
            <Oval
              width={21}
              height={21}
              color={"white"}
              secondaryColor="black"
              strokeWidth={3}
              strokeWidthSecondary={3}
            />
          </div>
        ) : (
          ""
        )}
      </button>
    )}
  </>
);

export default PrimarySolidButton;
