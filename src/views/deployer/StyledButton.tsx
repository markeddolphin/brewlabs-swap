import React, { ReactElement } from "react";

const StyledButton = ({
  onClick,
  disabled,
  children,
  type,
  boxShadow,
  className,
}: {
  onClick?: any;
  disabled?: boolean;
  children?: any;
  type?: string;
  boxShadow?: boolean;
  className?: string;
}): ReactElement =>
  type === "secondary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="portfolio-shadow relative flex h-full w-full items-center justify-center rounded border border-[#FFFFFF80] bg-[#B9B8B81A] text-sm font-medium transition hover:border-transparent hover:bg-dark hover:text-brand disabled:cursor-[not-allowed] disabled:bg-transparent disabled:text-white"
    >
      {children}
    </button>
  ) : type === "quaternary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative flex h-full w-full items-center justify-center rounded border border-[#FFFFFF80] bg-[#B9B8B81A] text-sm font-medium transition enabled:hover:border-green enabled:hover:shadow-[0_1px_4px_rgba(47,211,93,0.75)] disabled:cursor-[not-allowed] disabled:opacity-70"
    >
      {children}
    </button>
  ) : type === "teritary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${
        boxShadow ? "staking-button-shadow border-[#EEBB19]" : "border-transparent"
      } relative flex h-full w-full items-center justify-center rounded border bg-[#B9B8B81A] font-medium text-[#FFFFFFBF] transition enabled:hover:border-transparent enabled:hover:bg-dark enabled:hover:text-brand disabled:cursor-[not-allowed] disabled:opacity-70`}
    >
      {children}
    </button>
  ) : type === "quinary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex h-full w-full items-center justify-center rounded border border-[#FFFFFF80] bg-[#B9B8B81A] text-sm font-medium transition hover:border-[#FFFFFFBF] hover:shadow-[0_1px_4px_rgba(255,255,255,0.75)] disabled:cursor-[not-allowed] disabled:opacity-70`}
    >
      {children}
    </button>
  ) : type === "senary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex h-full w-full items-center justify-center rounded border border-primary bg-transparent text-sm font-medium text-[#FFFFFFBF] transition hover:shadow-[0_1px_4px_#EEBB19] disabled:cursor-[not-allowed] disabled:opacity-70`}
    >
      {children}
    </button>
  ) : type === "truenft" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex h-full w-full items-center justify-center rounded bg-[#1B212D] text-sm font-medium text-[#FFFFFFBF] transition hover:text-brand disabled:cursor-[not-allowed] disabled:opacity-70`}
    >
      {children}
    </button>
  ) : type === "danger" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex h-full w-full items-center justify-center rounded bg-danger text-sm font-semibold text-black transition hover:text-white disabled:cursor-[not-allowed] disabled:opacity-70`}
    >
      {children}
    </button>
  ) : type === "deployer" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative flex h-full w-full items-center justify-center rounded border border-[#FFFFFF40] bg-transparent text-sm text-[#FFFFFFBF] transition disabled:cursor-[not-allowed] disabled:opacity-70"
    >
      {children}
    </button>
  ) : type === "default" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${className} flex justify-center items-center disabled:cursor-[not-allowed] disabled:opacity-70`}
    >
      {children}
    </button>
  ) : (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="portfolio-shadow  relative flex h-full w-full items-center justify-center rounded bg-primary text-sm font-semibold text-black transition enabled:hover:bg-dark enabled:hover:text-brand disabled:cursor-[not-allowed] disabled:opacity-70"
    >
      {children}
    </button>
  );

export default StyledButton;
