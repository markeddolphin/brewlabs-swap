import { CircleRightSVG, CircleMinusSVG, CirclePlusSVG } from "@components/dashboard/assets/svgs";
import { getChainLogo, getRarityColor } from "utils/functions";
import StyledButton from "views/directory/StyledButton";

const NFTCard = ({ nft }: { nft: any }) => {
  return (
    <div className="primary-shadow mt-2 cursor-pointer rounded bg-[#B9B8B80D] p-[16px_18px_16px_12px] font-roboto font-bold text-[#FFFFFFBF] transition hover:bg-[#b9b8b828] xsm:p-[16px_36px_16px_28px]">
      <div className="hidden items-center justify-between xl:flex">
        <div className="flex w-[280px] items-center justify-center">
          <img src={getChainLogo(nft.chainId)} alt={""} className="h-[30px] w-[30px] rounded-full" />
          <div className="mx-[30px] flex h-[58px] w-[72px] items-center justify-center overflow-hidden rounded">
            <img src={nft.logo} alt={""} className="w-full" />
          </div>
          <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{nft.name}</div>
        </div>
        <div className="w-[60px]  overflow-hidden text-ellipsis whitespace-nowrap text-center">ID {nft.tokenId}</div>
        <div className={`uppercase ${getRarityColor(nft.rarity)} w-[80px] text-center`}>{nft.rarity}</div>
        {nft.isStaked ? (
          <>
            <div className="w-[108px]">
              <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                  {CircleMinusSVG}
                </div>
                Unstake NFT
              </StyledButton>
            </div>
            <div className="w-[70px] text-center text-xs text-white">{nft.apr.toFixed(2)}% APR</div>
            <div className="relative w-[70px] overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[1.2] text-white">
              {nft.earning.amount.toFixed(2)} {nft.earning.currency.symbol}
              <div className="absolute right-0 text-[10px] text-[#FFFFFF80]">$20.23 USD</div>
            </div>
            <div className="w-[84px]">
              <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                  {CirclePlusSVG}
                </div>
                Harvest
              </StyledButton>
            </div>
            <div className="w-[104px]">
              <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                  {CircleRightSVG}
                </div>
                Marketplace
              </StyledButton>
            </div>
          </>
        ) : (
          <>
            <div className="w-[108px]">
              <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                  {CirclePlusSVG}
                </div>
                Stake NFT
              </StyledButton>
            </div>
            <div className="w-[70px]" />
            <div className="w-[70px]" />
            <div className="w-[84px]" />
            <div className="w-[104px]">
              <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                  {CircleRightSVG}
                </div>
                Marketplace
              </StyledButton>
            </div>
          </>
        )}
      </div>
      <div className="block xl:hidden">
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div className="flex w-full items-center justify-center sm:w-[340px]">
            <img src={getChainLogo(nft.chainId)} alt={""} className="h-[30px] w-[30px] rounded-full" />
            <div className="mx-4 flex h-[58px] w-[72px] items-center justify-center overflow-hidden rounded sm:mx-[30px]">
              <img src={nft.logo} alt={""} className="w-full" />
            </div>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{nft.name}</div>
            <div className="w-[60px]  overflow-hidden text-ellipsis whitespace-nowrap text-center">
              ID {nft.tokenId}
            </div>
          </div>
          <div className={`uppercase ${getRarityColor(nft.rarity)} mt-4 sm:mt-0`}>{nft.rarity}</div>
        </div>
        {nft.isStaked ? (
          <>
            <div className="mt-2 flex items-center justify-between">
              <div className="w-fit text-white">APR: {nft.apr.toFixed(2)}%</div>
              <div className="relative w-fit leading-[1.2] text-white">
                EARNING: {nft.earning.amount.toFixed(2)} {nft.earning.currency.symbol}
                <div className="absolute right-0 text-right text-[10px] text-[#FFFFFF80]">$20.23 USD</div>
              </div>
            </div>
            <div className="mt-6 flex flex-col justify-between xsm:flex-row">
              <StyledButton className="mb-2 !w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] xsm:mt-0 xsm:!w-fit [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                  {CircleMinusSVG}
                </div>
                Unstake NFT
              </StyledButton>
              <StyledButton className="mb-2 !w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] xsm:mt-0 xsm:!w-fit [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                  {CirclePlusSVG}
                </div>
                Harvest
              </StyledButton>
              <StyledButton className="!w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] xsm:!w-fit [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                  {CircleRightSVG}
                </div>
                Marketplace
              </StyledButton>
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-col justify-between xsm:flex-row">
            <StyledButton className="!w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] xsm:mb-0 mb-2 xsm:!w-fit [&>*:first-child]:enabled:hover:text-yellow">
              <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                {CirclePlusSVG}
              </div>
              Stake NFT
            </StyledButton>
            <StyledButton className="!w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] xsm:!w-fit [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
              <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                {CircleRightSVG}
              </div>
              Marketplace
            </StyledButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
