/* eslint-disable react-hooks/exhaustive-deps */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import LogoIcon from "components/LogoIcon";

import StyledButton from "../../StyledButton";

const MintIndexOwnershipNFT = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  return (
    <AnimatePresence exitBeforeEnter>
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
            <StyledPanel>
              <div className="flex flex-col-reverse justify-between border-b border-b-[#FFFFFF80] pb-3 xmd:flex-row xmd:items-center">
                <div className="mt-5 flex items-center pl-3 text-xl xmd:mt-0">
                  <LogoIcon classNames="w-9 text-brand mr-3" />
                  <div>Mint index Ownership NFT</div>
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
              <div className="mx-auto w-full max-w-[480px]">
                <div className="mt-4 text-xl text-[#FFFFFFBF]">How does this work?</div>
                <div className="mt-2 text-sm leading-[1.2] text-[#FFFFFF80]">
                  As the deployer or current owner of this index, you can sell the ownership of this index to another
                  user. When selling an index, an NFT will be minted to your wallet representing the ownership of this
                  index. You can then list that NFT on a marketplace for sale. The NFT once sold will transfer all
                  pending commissions to the new owner and update the new owner of the index to receive future
                  commissions and deposit fees. <br />
                  <br />
                  Importantly, as soon as you mint an index ownership NFT you will stop receiving deposit fees and
                  commissions. At any time you can stake your index ownership NFT to resume your control over the index,
                  fee income and commission income. At this time you will also collect any pending fee income or
                  commissions due.
                </div>
                <div className="mt-10 h-12">
                  <StyledButton type="quaternary">Mint index ownership NFT</StyledButton>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute -right-2 -top-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
              </button>
            </StyledPanel>
          </motion.div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
};

const StyledPanel = styled.div`
  position: relative;
  width: calc(100vw - 24px);
  max-width: 640px;
  border-radius: 8px;
  background: #1b212d;
  padding: 40px 50px;
  @media screen and (max-width: 450px) {
    padding-left: 12px;
    padding-right: 12px;
  }
  display: flex;
  flex-direction: column;
`;

export default MintIndexOwnershipNFT;
