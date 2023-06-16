import React, { useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const BAD_SRCS: { [tokenAddress: string]: true } = {};

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcs: string[];
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: React.FC<LogoProps> = ({ srcs, alt, ...rest }) => {
  const [, refresh] = useState<number>(0);
  const [isError, setIsError] = useState(false);

  const src: string | undefined = srcs.find((s) => !BAD_SRCS[s]);

  if (src) {
    return (
      <div className="relative">
        <img
          {...rest}
          alt={alt}
          src={src}
          onError={(e: any) => {
            // if (src) BAD_SRCS[src] = true;
            e.target.src = "/images/unknown.png";
            setIsError(true);
            // refresh((i) => i + 1);
          }}
        />
        {isError ? (
          <div className="absolute -right-1 -top-1 scale-75">
            <img src={"/images/question.png"} alt={""} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  return <QuestionMarkCircleIcon />;
};

export default Logo;
