/* eslint-disable react-hooks/exhaustive-deps */

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  MinusSVG,
  NFTFillSVG,
  PlusSVG,
  QuestionSVG,
  checkCircleSVG,
  chevronLeftSVG,
  warningFillSVG,
} from "@components/dashboard/assets/svgs";
import StyledButton from "views/directory/StyledButton";
import LogoIcon from "@components/LogoIcon";
import CurrencyDropdown from "@components/CurrencyDropdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { tokens } from "config/constants/tokens";
import ReactPlayer from "react-player";

const MintNFTModal = ({ open, setOpen }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(tokens[1].usdc);
  const [quantity, setQuantity] = useState(1);
  const [isMinted, setIsMinted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const currencies = [tokens[1].usdc, tokens[1].usdt];
  const isValid = true;

  useEffect(() => {
    setIsEnded(false);
    setIsMinted(false);
  }, []);

  return (
    <Dialog
      open={open}
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
      onClose={() => setOpen(false)}
    >
      <div className="flex min-h-full items-center justify-center p-4 ">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.75,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              ease: "easeOut",
              duration: 0.15,
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.75,
            transition: {
              ease: "easeIn",
              duration: 0.15,
            },
          }}
          transition={{ duration: 0.25 }}
        >
          <div className="relative w-[calc(100vw-24px)] max-w-[600px] rounded-lg bg-[#18181B] p-[36px_12px] text-white sm:p-[36px_48px]">
            <div className="flex flex-col-reverse justify-between border-b border-b-[#FFFFFF80] pb-3 xmd:flex-row xmd:items-center">
              <div className="mt-5 flex items-center pl-3 text-xl text-[#FFFFFFBF] xmd:mt-0">
                <LogoIcon classNames="w-9 text-brand mr-3" />
                <div>Mint Brewlabs NFT</div>
              </div>
              <div className="h-10 min-w-[130px]">
                <StyledButton type="secondary" onClick={() => setOpen(false)}>
                  <div className="flex items-center text-[#FFFFFFBF]">
                    {chevronLeftSVG}
                    <div className="ml-2">Back a page</div>
                  </div>
                </StyledButton>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mt-2.5 flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded bg-[#B9B8B80D] text-tailwind">
                {isMinted ? (
                  isEnded ? (
                    <ReactPlayer
                      className="!h-full !w-full"
                      url={"/images/nfts/brewlabs-flask-nfts/brewlabs-flask-common.mp4"}
                      playing={true}
                      autoPlay={true}
                      muted={true}
                      loop={true}
                      playsinline={true}
                      controls={false}
                      onEnded={() => setIsEnded(true)}
                    />
                  ) : (
                    <ReactPlayer
                      className="!h-full !w-full"
                      url={"/images/nfts/brewlabs-flask-nfts/brewlabs-mint-animation-common.mp4"}
                      playing={true}
                      autoPlay={true}
                      muted={true}
                      playsinline={true}
                      controls={false}
                      onEnded={() => setIsEnded(true)}
                    />
                  )
                ) : (
                  QuestionSVG
                )}
              </div>
              {!isMinted ? (
                <div>
                  <div className="mt-[22px] flex min-w-[300px] items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div
                        className={`mr-3 ${
                          isValid ? "text-primary" : "text-[#FFFFFF80]"
                        } [&>*:first-child]:h-4 [&>*:first-child]:w-4`}
                      >
                        {checkCircleSVG}
                      </div>
                      <div
                        className={`rounded-lg p-[6px_10px] leading-none text-[#18181B] ${
                          isValid ? "bg-primary" : "bg-[#FFFFFF80]"
                        } text-sm`}
                      >
                        Brewlabs Token
                      </div>
                    </div>
                    <div className="text-[#FFFFFF80]">3500.00 BREWLABS</div>
                  </div>
                  <div className="mt-2.5 flex min-w-[300px] items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div
                        className={`mr-3 ${
                          isValid ? "text-primary" : "text-[#FFFFFF80]"
                        } [&>*:first-child]:h-4 [&>*:first-child]:w-4`}
                      >
                        {checkCircleSVG}
                      </div>
                      <div
                        className={`rounded-lg p-[6px_10px] leading-none text-[#18181B] ${
                          isValid ? "bg-primary" : "bg-[#FFFFFF80]"
                        } text-sm`}
                      >
                        Stablecoin
                      </div>
                    </div>
                    <div className="flex items-center text-[#FFFFFF80]">
                      <div className="mr-2">100.00</div>
                      <CurrencyDropdown
                        currencies={currencies}
                        value={selectedCurrency}
                        setValue={setSelectedCurrency}
                        className="w-[110px] bg-[#17171C]"
                      />
                    </div>
                  </div>
                  <div className="mt-2.5 flex min-w-[300px] items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`mr-3 ${
                          isValid ? "text-primary" : "text-[#FFFFFF80]"
                        } [&>*:first-child]:h-4 [&>*:first-child]:w-4`}
                      >
                        {NFTFillSVG}
                      </div>
                      <div
                        className={`rounded-lg p-[6px_10px] leading-none text-[#18181B] ${
                          isValid ? "bg-primary" : "bg-[#FFFFFF80]"
                        } text-sm`}
                      >
                        Quantity
                      </div>
                    </div>
                    <div>{quantity}</div>
                    <div className="flex w-[110px] justify-between">
                      <div
                        className="primary-shadow flex h-10 w-10 cursor-pointer items-center justify-center rounded text-tailwind transition-all hover:bg-[#292929] hover:text-white"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        {PlusSVG}
                      </div>
                      <div
                        className="primary-shadow flex h-10 w-10 cursor-pointer items-center justify-center rounded text-tailwind transition-all hover:bg-[#292929] hover:text-white"
                        onClick={() => setQuantity(quantity - 1)}
                      >
                        {MinusSVG}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    {isValid ? (
                      <StyledButton className="p-[10px_12px] !font-normal" onClick={() => setIsMinted(true)}>
                        Mint&nbsp;<span className="font-bold">BREWLABS</span>&nbsp;NFT on&nbsp;
                        <span className="font-bold">Ethereum</span>
                      </StyledButton>
                    ) : (
                      <StyledButton className="p-[10px_12px] !font-normal">
                        Get&nbsp;<span className="font-bold">BREWLABS</span>&nbsp;&&nbsp;
                        <span className="font-bold">USDC</span>
                      </StyledButton>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="my-4 text-center">
                    Congratulations you minted a RARE <span className="text-primary">BREWLABS</span> NFT
                  </div>
                  <div className="flex flex-col justify-center sm:flex-row">
                    <StyledButton className="w-full p-[10px_12px] sm:!w-fit">
                      <div className="flex items-center">
                        <div>
                          Next Mint&nbsp;<span className="font-normal">(5 remaining)</span>
                        </div>
                        <div className="ml-2 -scale-x-100 [&>*:first-child]:!h-3">{chevronLeftSVG}</div>
                      </div>
                    </StyledButton>
                    <div className="mr-0 mt-2 sm:mr-5 sm:mt-0" />
                    <StyledButton className="w-full p-[10px_12px] sm:!w-fit" onClick={() => setOpen(false)}>
                      Skip&nbsp;<span className="font-normal">and close window</span>
                    </StyledButton>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="absolute -right-2 -top-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default MintNFTModal;
