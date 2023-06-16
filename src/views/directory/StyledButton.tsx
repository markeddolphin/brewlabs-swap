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
}): ReactElement => {
  const base =
    "flex items-center justify-center disabled:cursor-[not-allowed] rounded relative primary-shadow text-sm transition w-full h-full";

  return type === "secondary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border border-[#FFFFFF80] bg-[#B9B8B81A] font-medium  enabled:hover:opacity-70 disabled:bg-transparent disabled:text-white ${base}`}
    >
      {children}
    </button>
  ) : type === "quaternary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border border-[#FFFFFF80] bg-[#B9B8B81A] font-medium enabled:hover:border-green enabled:hover:shadow-[0_1px_4px_rgba(47,211,93,0.75)] disabled:opacity-70 ${base}`}
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
      } border bg-[#B9B8B81A] font-medium text-[#FFFFFFBF]  enabled:hover:border-transparent enabled:hover:bg-dark enabled:hover:text-brand  disabled:opacity-70 ${base}`}
    >
      {children}
    </button>
  ) : type === "quinary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border border-[#FFFFFF80] bg-[#B9B8B81A] font-medium  hover:border-[#FFFFFFBF] hover:shadow-[0_1px_4px_rgba(255,255,255,0.75)]  disabled:opacity-70 ${base}`}
    >
      {children}
    </button>
  ) : type === "senary" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border border-primary bg-transparent font-medium text-[#FFFFFFBF]  hover:shadow-[0_1px_4px_#EEBB19]  disabled:opacity-70 ${base}`}
    >
      {children}
    </button>
  ) : type === "truenft" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#1B212D] font-medium text-[#FFFFFFBF]  hover:text-brand  disabled:opacity-70 ${base}`}
    >
      {children}
    </button>
  ) : type === "danger" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bg-danger font-semibold text-black  hover:text-white  disabled:opacity-70 ${base}`}
    >
      {children}
    </button>
  ) : type === "deployer" ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border border-[#FFFFFF40] bg-transparent text-[#FFFFFFBF]   disabled:opacity-70 ${base}`}
    >
      {children}
    </button>
  ) : type === "default" ? (
    <button type="button" onClick={onClick} disabled={disabled} className={`${className} ${base}`}>
      {children}
    </button>
  ) : (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bg-primary font-semibold text-black enabled:hover:opacity-70 disabled:opacity-70 ${base}`}
    >
      {children}
    </button>
  );
};

export default StyledButton;
