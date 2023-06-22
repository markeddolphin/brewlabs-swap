/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { checkSVG, chevronLeftSVG } from "components/dashboard/assets/svgs";
import LogoIcon from "components/LogoIcon";
import TokenLogo from "@components/logo/TokenLogo";
import { DashboardContext } from "contexts/DashboardContext";
import { getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { updateNftAllowance } from "state/indexes";
import { DeserializedIndex } from "state/indexes/types";
import { getIndexName } from "utils/functions";
import { formatAmount } from "utils/formatApy";
import getTokenLogoURL from "utils/getTokenLogoURL";

import useIndex from "../hooks/useIndex";
import useNftApprove from "../hooks/useNftApprove";
import useIndexImpl from "../hooks/useIndexImpl";

import StyledButton from "../../StyledButton";

const AddNFTModal = ({ open, setOpen, data }: { open: boolean; setOpen: any; data: DeserializedIndex }) => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  const { pending, setPending }: any = useContext(DashboardContext);
  const { tokens, userData, tokenPrices } = data;

  const [tokenId, setTokenId] = useState<number | undefined>();

  const { onStakeNft: onStakeNftOld } = useIndex(data.pid, data.address, data.performanceFee);
  const { onStakeNft } = useIndexImpl(data.pid, data.address, data.performanceFee);
  const { onApprove } = useNftApprove(data.category === undefined ? data.nft : data.indexNft);

  useEffect(() => {
    if (!userData.indexNftItems?.length) return;
    if (userData.indexNftItems.map((n) => n.tokenId).includes(tokenId)) return;

    setTokenId(userData.indexNftItems[0].tokenId);
  }, [userData.indexNftItems.length, data.pid]);

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleApproveNft = async () => {
    setPending(true);
    try {
      await onApprove(data.address);
      dispatch(updateNftAllowance(data.pid, address, data.chainId));

      toast.success(`Approved NFT staking`);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const handleStakeNft = async () => {
    setPending(true);
    try {
      if (data.category >= 0) {
        await onStakeNft(tokenId);
      } else {
        await onStakeNftOld(tokenId);
      }

      toast.success(`Index NFT was unlocked`);
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
                <div className="mt-5 flex items-center pl-3 text-xl text-[#FFFFFFBF] xmd:mt-0">
                  <LogoIcon classNames="w-9 text-brand mr-3" />
                  <div>Add Brewlabs Origin Index NFT</div>
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
              <div>
                <div className="mb-2 mt-6 text-xl text-[#FFFFFFBF]">Index NFT&apos;s Available</div>
                <div className="flex flex-col justify-between xmd:flex-row">
                  <div className="mb-5 mr-0 min-h-[240px] flex-1 rounded border border-primary bg-[#B9B8B81A] px-3.5 py-3 xmd:mb-0 sm:mr-6">
                    {userData.indexNftItems &&
                      userData.indexNftItems.map((nft) => (
                        <div
                          key={nft.tokenId}
                          className="flex cursor-pointer items-center justify-between"
                          onClick={() => setTokenId(nft.tokenId)}
                        >
                          <div className="flex items-center text-[#FFFFFFBF]">
                            <div className={nft.tokenId === tokenId ? "text-[#F5F5F5]" : "text-[#F5F5F540]"}>
                              {checkSVG}
                            </div>
                            <div className="ml-1">
                              {getIndexName(tokens)} [{nft.tokenId}]
                            </div>
                          </div>
                          <div className="text-xs">${formatAmount(nft.usdAmount, 2)} USD</div>
                        </div>
                      ))}
                  </div>
                  <div className="min-w-[180px]">
                    {tokens.map((token, index) => {
                      const selectedNft = userData.indexNftItems?.find((nft) => nft.tokenId === tokenId);
                      return (
                        <div className="mb-3 flex items-center" key={token.address}>
                          <TokenLogo src={getTokenLogoURL(token.address, token.chainId)} classNames="w-12" large />
                          <div className="ml-3 leading-none">
                            <div className="text-xl text-[#FFFFFFBF]">
                              {selectedNft
                                ? formatAmount(ethers.utils.formatUnits(selectedNft.amounts[index], token.decimals), 6)
                                : "0.00"}
                            </div>
                            <div className="text-xs text-[#FFFFFF80]">
                              $
                              {selectedNft && tokenPrices?.[index]
                                ? formatAmount(
                                    +ethers.utils.formatUnits(selectedNft.amounts[index], token.decimals) *
                                      tokenPrices[index]
                                  )
                                : "0.00"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="my-6 h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[480px]">
                <div className="h-12">
                  <StyledButton
                    type="quinary"
                    disabled={
                      pending ||
                      !userData.indexNftItems?.length ||
                      !userData.indexNftItems?.map((n) => n.tokenId).includes(tokenId)
                    }
                    onClick={userData?.allowance ? handleStakeNft : handleApproveNft}
                  >
                    {userData?.allowance ? `Add Index NFT` : "Approve Index NFT"}
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

export default AddNFTModal;
