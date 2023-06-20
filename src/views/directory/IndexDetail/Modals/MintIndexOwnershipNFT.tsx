/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import styled from "styled-components";

import IndexImplAbi from "config/abi/indexes/indexImpl.json";
import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import LogoIcon from "components/LogoIcon";
import { DashboardContext } from "contexts/DashboardContext";
import { getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { setIndexesPublicData } from "state/indexes";
import { DeserializedIndex } from "state/indexes/types";

import StyledButton from "../../StyledButton";
import useIndexImpl from "../hooks/useIndexImpl";

const MintIndexOwnershipNFT = ({ open, setOpen, data }: { open: boolean; setOpen: any; data: DeserializedIndex }) => {
  const dispatch = useAppDispatch();
  const { pending, setPending }: any = useContext(DashboardContext);

  const { onMintDeployerNft } = useIndexImpl(data.pid, data.address, data.performanceFee);

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleMintDeployerNft = async () => {
    if (pending) return;

    setPending(true);
    try {
      const tx = await onMintDeployerNft();

      const iface = new ethers.utils.Interface(IndexImplAbi);
      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "DeployerNftMinted") {
            console.log("deployerNftId", log.args.tokenId, log);
            dispatch(setIndexesPublicData([{ pid: data.pid, deployerNftId: log.args.tokenId }]));
            break;
          }
        } catch (e) {}
      }
      toast.success("Deployer NFT was mint");

      setOpen(false);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog
        open={open}
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
        onClose={() => {}}
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
                  <StyledButton type="quaternary" onClick={handleMintDeployerNft} disabled={pending}>
                    Mint index ownership NFT
                    {pending && (
                      <div className="absolute right-2 top-0 flex h-full items-center">
                        <Oval
                          width={21}
                          height={21}
                          color={"white"}
                          secondaryColor="black"
                          strokeWidth={3}
                          strokeWidthSecondary={3}
                        />
                      </div>
                    )}
                  </StyledButton>
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
