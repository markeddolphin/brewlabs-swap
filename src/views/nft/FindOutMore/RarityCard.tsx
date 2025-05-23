/* eslint-disable react-hooks/exhaustive-deps */

import { LighteningSVG, QuestionSVG } from "@components/dashboard/assets/svgs";
import ReactPlayer from "react-player";
import { getChainLogo } from "utils/functions";
import StyledButton from "views/directory/StyledButton";

const RarityCard = ({ rarity }) => {
  return (
    <div className="w-full font-roboto font-medium">
      <div className="flex items-center justify-between text-sm text-white ">
        <div>{rarity.type}</div>
        {rarity.isActive ? (
          <div className="flex items-center">
            <img src={getChainLogo(rarity.chainId)} alt={""} className="h-5 w-5 rounded-full" />
            <div className="ml-2">ACTIVE</div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="mx-auto mt-2 flex h-[240px] w-[240px] items-center justify-center overflow-hidden rounded text-tailwind md:w-full xl:h-[180px]">
        <ReactPlayer
          className="!w-full"
          url={rarity.logo}
          playing={true}
          autoPlay={true}
          muted={true}
          loop={true}
          playsinline={true}
          controls={false}
        />
      </div>
      <div className="mt-1.5 h-36">
        <div className="text-sm text-[#FFFFFFBF]">Benefits</div>
        <ul className="mt-4 list-disc pl-5 text-xs text-white">
          {rarity.benefits.map((data: string, i: number) => {
            return <li key={i}>{data}</li>;
          })}
        </ul>
      </div>
      {rarity.isUpgradeable ? (
        <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] [&>*:first-child]:enabled:hover:text-yellow">
          <div className="absolute -right-[13px] text-tailwind transition-all duration-500 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
            {LighteningSVG}
          </div>
          Upgradeable
        </StyledButton>
      ) : (
        <div className="h-0 md:h-[26px]" />
      )}
      <div className="mt-10">
        <div className="text-sm text-[#FFFFFFBF]">{rarity.features.title}</div>
        <ul className="mt-4 list-disc pl-5 text-xs text-[#FFFFFF80]">
          {rarity.features.data.map((data: string, i: number) => {
            return <li key={i}>{data}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default RarityCard;
