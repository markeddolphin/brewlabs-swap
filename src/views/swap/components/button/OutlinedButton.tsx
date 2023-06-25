import React from "react";

type OutlinedButtonProps = {
  children: React.ReactNode;
  image?: string;
  onClick?: (e: any) => void;
  borderDotted?: boolean;
  className?: string;
  small?: boolean;
  href?: string;
  description?: string;
};

const OutlinedButton = ({
  children,
  onClick,
  image,
  className,
  borderDotted,
  small,
  href,
  description,
}: OutlinedButtonProps) => {
  return (
    <a
      className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-gray-600 px-2 text-center font-brand text-sm !text-gray-400 transition hover:border-primary ${
        className ?? "" 
      } ${borderDotted ? "border-dotted" : ""} ${small ? "py-3" : "py-12"}`}
      href={href}
      onClick={onClick}
      {...(href ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <div className="flex items-start">
        {image && <img src={image} className="mr-1 w-4" alt=""></img>}
        {children}
      </div>
      {description && <div>{description}</div>}
    </a>
  );
};

export default OutlinedButton;
