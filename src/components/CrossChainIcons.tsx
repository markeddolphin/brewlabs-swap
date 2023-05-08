import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type CrossChainIconsProps = {
  chainOne: string;
  chainTwo: string;
  slim?: boolean;
};

const CrossChainIcons = ({ chainOne, chainTwo, slim }: CrossChainIconsProps) => {
  return (
    <div className="flex items-center ">
      <div
        className={clsx(
          slim ? "border-1 -mr-1 h-8 w-8" : "-mr-6 h-16 w-16 border-4",
          "overflow-hidden rounded-full border-white bg-cover bg-no-repeat"
        )}
        style={{
          backgroundImage: `url('${chainOne}')`,
        }}
      />

      {!slim && <ArrowRightCircleIcon className="z-10 h-6 w-6 overflow-hidden rounded-full bg-white text-gray-900" />}

      <div
        className={clsx(
          slim ? "border-1 -ml-1 h-8 w-8" : "-ml-6 h-16 w-16 border-4",
          "overflow-hidden rounded-full border-white bg-cover bg-no-repeat"
        )}
        style={{
          backgroundImage: `url('${chainTwo}')`,
        }}
      />
    </div>
  );
};

export default CrossChainIcons;
