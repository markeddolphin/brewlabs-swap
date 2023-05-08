/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import styled from "styled-components";
import { useMemo, useState } from "react";

import ChainSelector from "components/ChainSelector";
import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { useActiveChainId } from "hooks/useActiveChainId";

const ChainSelect = () => {
  const supportedNetworks = useSupportedNetworks();
  const { switchNetwork } = useSwitchNetwork();
  const { chainId } = useActiveChainId();

  const [open, setOpen] = useState(false);

  const network = useMemo(() => {
    return supportedNetworks.find((network) => network.id === chainId) || supportedNetworks[0];
  }, [chainId, supportedNetworks]);

  return (
    <motion.div className="mb-4 rounded-full border border-gray-600 border-transparent bg-opacity-60 py-2 pl-2 pr-4 font-brand text-gray-400 focus-within:border-amber-300 hover:border-amber-300 dark:bg-zinc-900 dark:bg-opacity-60 dark:text-white">
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
                <ChainSelector
                  bSwitchChain
                  networks={supportedNetworks}
                  currentChainId={chainId}
                  onDismiss={() => setOpen(false)}
                  selectFn={(selectedValue) => switchNetwork(selectedValue.id)}
                />
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

      <button
        className="flex w-full items-center justify-between"
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="flex gap-2">
          {network && network.image !== "" && (
            <div
              className="-mr-4 h-6 w-6 overflow-hidden rounded-full bg-cover bg-no-repeat dark:bg-slate-800"
              style={{
                backgroundImage: `url('${network.image}')`,
              }}
            ></div>
          )}
          <span className="pl-4 pr-1">{!network || network.name === "" ? "Choose a network" : network.name}</span>
        </div>
        <ChevronDownIcon className="ml-2 h-5 w-5 dark:text-brand" />
      </button>
    </motion.div>
  );
};

const StyledPanel = styled.div`
  position: relative;
  width: calc(100vw - 24px);
  max-width: 600px;
  border-radius: 8px;
  background: rgb(24 24 27);
  border: 2px solid rgb(252 211 77);
  border-radius: 12px;
`;
export default ChainSelect;
