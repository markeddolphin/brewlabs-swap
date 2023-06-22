import React, { useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  classNames?: string;
  large?: boolean;
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const TokenLogo: React.FC<LogoProps> = ({ src, classNames, large, alt, ...rest }) => {
  const [isError, setIsError] = useState(false);

  if (src) {
    return (
      <div className={`relative ${classNames ?? ""}`}>
        <img
          {...rest}
          alt={alt ?? ""}
          src={src}
          className="w-full rounded-full"
          onError={(e: any) => {
            e.target.src = "/images/unknown.png";
            setIsError(true);
          }}
        />
        {(isError || src === "/images/unknown.png") && (
          <div
            className={`absolute -right-1 ${large ? "scale-1 top-0" : "-top-1"}`}
            style={large ? {} : { width: "50%" }}
          >
            <img src={"/images/question.png"} alt={""} />
          </div>
        )}
      </div>
    );
  }

  return <QuestionMarkCircleIcon />;
};

export default TokenLogo;
