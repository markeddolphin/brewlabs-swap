import React from "react";

type SolidButtonProps = {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  disabled: boolean;
  className?: string;
  disabled?: boolean;
};

const SolidButton = ({ children, onClick, className, disabled }: SolidButtonProps) => {
  return (
    <button
      className={`cursor-pointer rounded-3xl bg-primary py-3 text-center font-['Roboto'] text-sm font-bold text-black transition enabled:hover:bg-opacity-60 enabled:hover:border-primary ${
        className ?? ""
      } disabled:cursor-not-allowed disabled:opacity-70`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SolidButton;
