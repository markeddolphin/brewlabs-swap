import { ReactElement, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import styled from "styled-components";
import { useActiveChainId } from "hooks/useActiveChainId";
import { TransactionFailedSVG } from "components/dashboard/assets/svgs";

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: string;
  tx: string;
};

const SCAN_URL = {
  1: "https://etherscan.io",
  56: "https://bscscan.com",
};
const ConfirmationModal = ({ open, setOpen, type, tx }: ModalProps): ReactElement | null => {
  const { chainId } = useActiveChainId();
  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
        >
          <div className="flex min-h-full items-start justify-end p-4 text-center">
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
                <div
                  className={`flex w-full items-center justify-between overflow-hidden rounded-t-lg ${
                    type === "failed" ? "bg-danger" : "bg-brand"
                  } py-1.5 px-4`}
                >
                  {type === "confirming" ? (
                    <img src={"/images/brewlabs-bubbling-seemless.gif"} alt={""} className="w-[70px]" />
                  ) : type === "failed" ? (
                    <div className="ml-2 flex h-[70px] items-center">{TransactionFailedSVG}</div>
                  ) : (
                    <div className="h-[70px]" />
                  )}
                  <div className="text-[22px] text-black">
                    {type === "confirming"
                      ? "Confirming Transaction"
                      : type === "failed"
                      ? "Transaction Failed"
                      : "Transaction Confirmed"}
                  </div>
                </div>
                <div className="border-t-0 flex overflow-hidden rounded-b-lg border border-[#FFFFFF80] bg-[rgb(38,44,55)] font-roboto font-semibold">
                  <a
                    className="flex w-[50%] cursor-pointer items-center justify-center border-r  border-[FFFFFF80] py-2 text-white transition hover:bg-[rgb(61,66,76)]"
                    target={"_blank"}
                    href={`${SCAN_URL[chainId]}/tx/${tx}`}
                    rel="noreferrer"
                  >
                    <img src={"/images/explorer/etherscan.png"} alt={""} className="mr-2 w-4" />
                    <div>Transaction</div>
                  </a>
                  <div
                    className="flex w-[50%] cursor-pointer items-center justify-center py-2 text-white transition hover:bg-[rgb(61,66,76)]"
                    onClick={() => setOpen(false)}
                  >
                    Dismiss
                  </div>
                </div>
              </StyledPanel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

const StyledPanel = styled.div`
  position: relative;
  width: calc(100vw - 24px);
  max-width: 360px;
`;

export default ConfirmationModal;
