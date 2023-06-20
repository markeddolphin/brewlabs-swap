/* eslint-disable react-hooks/exhaustive-deps */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import styled from "styled-components";

import { chevronLeftSVG, warningCircleSVG } from "components/dashboard/assets/svgs";
import LogoIcon from "components/LogoIcon";
import { DashboardContext } from "contexts/DashboardContext";
import { getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { setIndexesPublicData } from "state/indexes";
import { DeserializedIndex } from "state/indexes/types";
import { getIndexName } from "utils/functions";

import StyledButton from "../../StyledButton";
import useIndexImpl from "../hooks/useIndexImpl";

const UpdateFeeModal = ({ open, setOpen, data }: { open: boolean; setOpen: any; data: DeserializedIndex }) => {
  const dispatch = useAppDispatch();

  const { pending, setPending }: any = useContext(DashboardContext);
  const { onUpdateFeeAddress } = useIndexImpl(data.pid, data.address, data.performanceFee);

  const [feeAddress, setFeeAddress] = useState("");

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleUpdateFeeAddress = async () => {
    if (pending) return;
    if (!ethers.utils.isAddress(feeAddress) || feeAddress === ethers.constants.AddressZero) {
      toast.error("Invalid fee address");
    }

    setPending(true);
    try {
      const tx = await onUpdateFeeAddress(feeAddress);

      dispatch(setIndexesPublicData([{ pid: data.pid, feeWallet: feeAddress }]));
      toast.success("Fee wallet was updated");

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
                  <div>Update fee address</div>
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
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-lg text-[#FFFFFFBF]">Current fee address</div>
                  <div className="text-sm text-[#FFFFFF80]">
                    {data.name !== "" ? data.name : getIndexName(data.tokens)}
                  </div>
                </div>
                <div className="mt-2 text-sm">{data.feeWallet}</div>
                <div className="mt-3 text-lg text-[#FFFFFFBF]">New fee address</div>
                <StyledInput value={feeAddress} onChange={(e) => setFeeAddress(e.target.value)} placeholder="0x..." />
                <div className="mx-auto mt-2.5 flex w-full max-w-[360px] items-center justify-between text-sm text-[#FFFFFF80]">
                  <div className="flex items-center">
                    <div
                      className="tooltip"
                      data-tip="Fee percentage charged to users on deposit sent to your nominated address."
                    >
                      <div className="mr-2 scale-125 cursor-pointer text-tailwind">{warningCircleSVG}</div>
                    </div>
                    <div>Deposit Fee {data.depositFee ?? 0.25}%</div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="tooltip"
                      data-tip="Fee percentage charged to users on withdrawal in profit sent to your nominated address."
                    >
                      <div className="mr-2 scale-125 cursor-pointer text-tailwind">{warningCircleSVG}</div>
                    </div>
                    <div>Commission Fee {data.commissionFee ?? 1}%</div>
                  </div>
                </div>
                <div className="mt-3.5 h-12">
                  <StyledButton
                    type="quaternary"
                    onClick={handleUpdateFeeAddress}
                    disabled={
                      pending || !ethers.utils.isAddress(feeAddress) || feeAddress === ethers.constants.AddressZero
                    }
                  >
                    Update fee address
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

const StyledInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 16px 14px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 6px;
  color: white;
  outline: none;
`;

export default UpdateFeeModal;
