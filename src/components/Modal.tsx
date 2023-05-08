import { ReactElement, ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";

type ModalProps = {
  open: boolean;
  children?: ReactNode;
  onClose: () => void;
};

const Modal = ({ open, children, onClose }: ModalProps): ReactElement | null => {
  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog open={open} className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto bg-gray-300 bg-opacity-90 dark:bg-zinc-900 dark:bg-opacity-80">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full md:w-2/6 md:min-w-[400px]">
              <Dialog.Panel>
                <div className="m-2 overflow-hidden rounded-xl border-2 border-amber-300 bg-white dark:bg-zinc-900">
                  {children}
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full bg-white p-2 dark:bg-zinc-900 sm:-top-2 sm:-right-2 sm:dark:bg-zinc-800"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
                </button>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
};

export default Modal;
