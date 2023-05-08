import { ReactElement, ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ChevronDownIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { NetworkConfig } from "config/constants/types";
import Modal from "../MotionModal";

type CryptoCardProps = {
  id: string;
  title?: string;
  active?: boolean;
  tokenPrice: number;
  children: ReactNode;
  network: NetworkConfig;
  modal: {
    disableAutoCloseOnClick?: boolean;
    openModal?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    buttonText: string;
    modalContent: ReactElement;
  };
};

const CryptoCard = ({ id, title, tokenPrice, modal, active, network, children }: CryptoCardProps) => {
  const [selected, setSelected] = useState(false);

  const closeSelected = () => {
    if (modal.onClose) {
      modal.onClose();
    }
    setSelected(false);
  };

  useEffect(() => {
    setSelected(!!modal?.openModal);
  }, [modal?.openModal]);

  const shadowColor = network.name === "BNB Smart Chain" ? "shadow-amber-400/60" : "shadow-indigo-400/60";
  const shadowColorLighter = network.name === "BNB Smart Chain" ? "shadow-amber-500/20" : "shadow-indigo-500/20";

  return (
    <>
      <motion.div
        layoutId={id}
        className={clsx(
          "max-w-sm rounded-3xl border-2 border-transparent font-brand focus-within:border-amber-300 hover:border-amber-300 sm:relative sm:max-w-screen-md",
          active && `shadow-xl ${shadowColor} md:shadow-transparent`
        )}
      >
        <div
          className={`h-72 rounded-3xl border-t border-slate-100 bg-gray-50 shadow-lg ${shadowColorLighter} dark:border-slate-600 dark:bg-zinc-900`}
        >
          <div className="p-10">
            <header className="text-center text-gray-700 dark:text-gray-500">
              <h4 className="text-2xl">{title}</h4>
              <div className="mx-auto mt-4 flex items-center justify-center">
                <button
                  className="flex items-center gap-2 rounded-full border border-gray-700"
                  onClick={() => {
                    setSelected(true);
                    if (modal.onOpen) modal.onOpen();
                  }}
                >
                  {network.image !== "" && (
                    <div
                      className="-mr-4 h-6 w-6 overflow-hidden rounded-full bg-cover bg-no-repeat dark:bg-slate-800"
                      style={{
                        backgroundImage: `url('${network.image}')`,
                      }}
                    ></div>
                  )}
                  <span className="pl-4 pr-1">{network.name === "" ? "Choose a network" : network.name}</span>
                  <ChevronDownIcon className="h-6 w-6 pr-2" />
                </button>
                <div className="tooltip" data-tip="Transfer fee: 0.10%">
                  <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer" />
                </div>
              </div>
            </header>

            {children}

            <h5 className="mt-6 text-center dark:text-gray-500">Current price: ${tokenPrice.toFixed(6)}</h5>
          </div>
        </div>
      </motion.div>

      {selected && modal && (id === "bridge_card_to" || modal.openModal) && (
        <Modal
          open={selected}
          closeFn={closeSelected}
          layoutId={id}
          disableAutoCloseOnClick={modal.disableAutoCloseOnClick}
        >
          {modal.modalContent}
        </Modal>
      )}
    </>
  );
};

export default CryptoCard;
