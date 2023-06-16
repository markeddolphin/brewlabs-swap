/* eslint-disable react-hooks/exhaustive-deps */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

import { chevronLeftSVG, downloadSVG, LinkSVG } from "components/dashboard/assets/svgs";
import LogoIcon from "components/LogoIcon";

import StyledButton from "../../StyledButton";
import { useAccount } from "wagmi";
import { useIndexes } from "state/indexes/hooks";
import { getChainLogo, getIndexName } from "utils/functions";
import IndexLogo from "../IndexLogo";
import Link from "next/link";

const StakeIndexOwnershipNFT = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const { address: account } = useAccount();
  const { indexes, userDataLoaded } = useIndexes();
  let allPools = [
    ...indexes
      .map((_index) => {
        return { ..._index };
      })
      .filter((data) => data.deployer?.toLowerCase() === account.toLowerCase()),
  ];
  console.log(allPools);
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
                  If you have an Index Ownership NFT in your wallet it will appear below. You can stake your chosen
                  Index Ownership NFT to claim ownership of the Index, pending fees/commissions and future
                  fees/commissions.
                </div>

                {allPools.length ? (
                  <>
                    <div className="mt-5 text-[#FFFFFFBF]">Available Index Ownership NFT’s found!</div>
                    <div className="yellowScroll mb-[50px] mt-2.5 max-h-[400px] overflow-y-scroll text-[#FFFFFFBF]">
                      {allPools.map((data, i) => {
                        return (
                          <div className="mb-2.5" key={i}>
                            <div className="text-sm">Index name</div>
                            <div className="flex flex-col sm:flex-row">
                              <div className="primary-shadow min-h-12 mb-1 mr-0 flex flex-1 items-center justify-between rounded-md bg-[#B9B8B81A] px-4 sm:mb-0 sm:mr-1">
                                <div className="flex flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap">
                                  <img src={getChainLogo(data.chainId)} alt="" className="h-6 w-6 rounded-full" />
                                  <div className="mx-4 w-fit sm:w-[80px]">
                                    <IndexLogo type={"line"} tokens={data.tokens ?? []} />
                                  </div>
                                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {getIndexName(data.tokens)}
                                  </div>
                                </div>
                                <Link
                                  className="scale-125 !text-[#ffffff6e] hover:!text-white"
                                  href={`/indexes/${data.pid}`}
                                  onClick={() => setOpen(false)}
                                >
                                  {LinkSVG}
                                </Link>
                              </div>
                              <div className="primary-shadow flex h-12 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-[#B9B8B81A] transition hover:bg-[#b9b8b850] sm:w-24">
                                <div className="scale-125 text-[#D9D9D9]">{downloadSVG}</div>
                                <div className="text-sm">Stake</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="mt-5 text-[#FFFFFFBF] text-lg text-center">No Index Ownership NFT Found!</div>
                )}
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

export default StakeIndexOwnershipNFT;
