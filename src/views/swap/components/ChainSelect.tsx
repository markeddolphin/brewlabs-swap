import { useMemo, useState } from "react";
import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { motion } from "framer-motion";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import Modal from "components/MotionModal";
import ChainSelector from "components/ChainSelector";
import { useActiveChainId } from "hooks/useActiveChainId";

type ChainSelectProps = {
  id: string;
};

const ChainSelect = ({ id }: ChainSelectProps) => {
  const { chainId } = useActiveChainId();
  const supportedNetworks = useSupportedNetworks();
  const { switchNetwork } = useSwitchNetwork();
  const network = useMemo(() => {
    return supportedNetworks.find((network) => network.id === chainId) || supportedNetworks[0];
  }, [chainId, supportedNetworks]);
  const [selected, setSelected] = useState(false);

  const closeSelected = () => {
    setSelected(false);
  };

  return (
    <>
      <motion.div className="mb-4 rounded-full border border-gray-600  bg-opacity-60 py-2 pl-2 pr-4 font-brand text-gray-400 focus-within:border-amber-300 hover:border-amber-300 dark:bg-zinc-900 dark:bg-opacity-60 dark:text-white">
        <button
          className="flex w-full items-center justify-between"
          onClick={() => {
            setSelected(true);
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
      {selected && (
        <Modal open={selected} closeFn={closeSelected} layoutId={id} disableAutoCloseOnClick={true}>
          <ChainSelector
            bSwitchChain
            networks={supportedNetworks}
            currentChainId={chainId}
            onDismiss={() => setSelected(false)}
            selectFn={(selectedValue) => switchNetwork(selectedValue.id)}
          />
        </Modal>
      )}
    </>
  );
};

export default ChainSelect;
