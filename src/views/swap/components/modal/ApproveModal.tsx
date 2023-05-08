import { ReactElement, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";

type ModalProps = {
  open: boolean;
  onApprove: () => void;
  onClose: () => void;
};

const ApproveModal = ({ open, onClose, onApprove }: ModalProps): ReactElement | null => {
  const [approvalStep, setApprovalStep] = useState(1);

  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 dark:bg-zinc-900 dark:bg-opacity-80 font-brand"
        >
          <div className="flex min-h-full items-center justify-center p-4 text-center">
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
              <div className="relative w-full max-w-[450px]">
                <div className="m-2 overflow-hidden rounded-lg bg-white dark:bg-brand">
                  <div className="items-center justify-between gap-4 p-7 md:flex">
                    <div className="m-auto max-h-[150px] min-h-[150px] min-w-[150px] max-w-[150px]">
                      <CircularProgressbarWithChildren
                        value={approvalStep * 50}
                        strokeWidth={12}
                        styles={buildStyles({
                          rotation: 0,
                          // Text size
                          textSize: "16px",

                          // How long animation takes to go from one percentage to another, in seconds
                          pathTransitionDuration: 0.5,

                          // Colors
                          pathColor: `#2fd35d`,
                          textColor: "#f88",
                          trailColor: "#d9d9d9",
                          backgroundColor: "#3e98c7",
                        })}
                      >
                        <div className="min-h-[120px] min-w-[120px]">
                          <CircularProgressbarWithChildren
                            value={100}
                            strokeWidth={25}
                            styles={buildStyles({
                              rotation: 0,
                              // Text size
                              textSize: "16px",
                              // How long animation takes to go from one percentage to another, in seconds
                              pathTransitionDuration: 0.5,

                              // Colors
                              pathColor: `#1b212d`,
                              textColor: "#f88",
                              trailColor: "#d9d9d9",
                              backgroundColor: "#3e98c7",
                            })}
                          >
                            <img src="/images/brewlabs-bubbling-seamless.svg" alt="" />
                          </CircularProgressbarWithChildren>
                        </div>
                      </CircularProgressbarWithChildren>
                    </div>
                    <div className="mt-3 md:mt-1">
                      <p className="px-2 text-start text-xl dark:text-black">One off approvals for first time swap</p>
                      <div className="flex justify-center">
                        <img src="/images/brewlabs-letter-logo.svg" alt="" />
                      </div>
                      <button
                        className="rounded-xl px-8 py-1 text-xl dark:bg-[#1b212d] dark:text-white"
                        onClick={() => {
                          if (approvalStep < 2) {
                            setApprovalStep(approvalStep + 1);
                          } else {
                            onApprove();
                            onClose();
                          }
                        }}
                      >
                        Approval {approvalStep} of 2
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="absolute -top-2 -right-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
                </button>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ApproveModal;
