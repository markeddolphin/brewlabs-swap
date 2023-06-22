/* eslint-disable react-hooks/exhaustive-deps */

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { warningFillSVG } from "@components/dashboard/assets/svgs";
import StyledButton from "views/directory/StyledButton";

const WarningModal = ({ open, setOpen, type, onClick }) => {
  let warningText;

  switch (type) {
    case "notverified":
      warningText = (
        <div>
          <div>This token may be malicious, it has unverified code.</div>
          <div className="my-2">Do you wish to continue?</div>
        </div>
      );
      break;
    case "notlisted":
      warningText = (
        <div>
          <div>This token may be malicious, it is not listed by other routers or third parties yet.</div>
          <div className="my-2">Do you wish to continue?</div>
        </div>
      );
      break;
    case "highpriceimpact":
      warningText = (
        <div>
          <div>This swap has a price impact of 5.00% or higher.</div>
          <div className="my-2">Do you wish to continue?</div>
        </div>
      );
      break;
    default:
      break;
  }

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
          <div className="relative w-[calc(100vw-24px)] max-w-[600px] rounded-lg border-[2px] border-[#D9563ABF] bg-[rgb(24,24,27)] p-[36px_48px] text-white">
            <div>
              <h5 className="relative mb-2 text-2xl">
                Warning
                <div className="absolute -left-6 top-2 scale-125 text-[#D9563A]">{warningFillSVG}</div>
              </h5>
              <p className="text-white">{warningText}</p>
              <div className="mt-5 flex">
                <div className="mr-3 h-9 w-28">
                  <StyledButton type={"secondary"} onClick={() => setOpen(false)}>
                    No
                  </StyledButton>
                </div>
                <div
                  className="h-9 w-28"
                  onClick={() => {
                    onClick();
                    setOpen(false);
                  }}
                >
                  <StyledButton type={"primary"}>Yes</StyledButton>
                </div>
              </div>
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

export default WarningModal;
