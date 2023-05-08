import { ReactElement, ReactEventHandler, ReactNode, useEffect } from "react";
import { Portal } from "react-portal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalState } from "../state";

interface KeyboardEvent {
  key: string;
}

type ModalProps = {
  layoutId: string;
  open: boolean;
  children?: ReactNode;
  disableAutoCloseOnClick?: boolean;
  closeFn: ReactEventHandler;
};

const AnimationModal = ({
  closeFn,
  open,
  layoutId,
  children,
  disableAutoCloseOnClick,
}: ModalProps): ReactElement | null => {
  // Retrieve global state
  const [modalIsOpen, setModalIsOpen] = useGlobalState("modalIsOpen");

  useEffect(() => {
    setModalIsOpen(true);
    // Function to close on Esc
    const handleEscClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFn;
      }
    };
    // Add event listener for keydown
    document.addEventListener("keydown", handleEscClose, false);

    return () => {
      setModalIsOpen(false);
      // Remove event listener for keydown
      window.removeEventListener("keydown", handleEscClose);
    };
  }, [closeFn, setModalIsOpen]);

  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <Portal node={document && document.getElementById("page_wrapper")}>
          <motion.div
            onClick={closeFn}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 z-50 h-full w-full bg-gray-300 bg-opacity-90 dark:bg-zinc-900 sm:dark:bg-opacity-90"
          >
            <motion.div
              layout
              layoutId={layoutId}
              onClick={(e) => disableAutoCloseOnClick && e.stopPropagation()}
              className="fixed inset-x-0 top-0 m-auto h-fit w-full sm:top-32 sm:w-7/12 md:w-2/6 md:min-w-[400px]"
            >
              <div className="overflow-hidden bg-white pt-12 dark:bg-zinc-900 sm:rounded-xl sm:border-2 sm:border-amber-300 sm:pt-0">
                {children}
              </div>

              <motion.button
                onClick={closeFn}
                className="absolute top-4 right-4 rounded-full bg-white p-2 dark:bg-zinc-900 sm:-top-2 sm:-right-2 sm:dark:bg-zinc-800"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
              </motion.button>
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export default AnimationModal;
