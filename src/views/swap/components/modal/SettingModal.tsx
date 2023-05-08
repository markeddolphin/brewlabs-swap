import { ReactElement } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useUserSlippageTolerance } from "state/user/hooks";

type ModalProps = {
  autoMode: boolean;
  setAutoMode: (autoMode: boolean) => void;
  slippage: number;
  slippageInput: string;
  parseCustomSlippage: (slippage: string) => void;
};

const SettingModal = ({
  autoMode,
  setAutoMode,
  slippage,
  slippageInput,
  parseCustomSlippage,
}: ModalProps): ReactElement | null => {
  const [userSlippageTolerance] = useUserSlippageTolerance();

  const spring = {
    type: "spring",
    stiffness: 1200,
    damping: 30,
  };

  return (
    <div className="flex min-h-full items-center justify-center p-4 text-center">
      <div className="relative w-full md:min-w-[500px] md:max-w-[500px]">
        <div className="m-2 overflow-hidden rounded-lg px-8 py-4 font-brand ">
          <div className="title flex items-center justify-between pl-3">
            <p className="text-[21px] dark:text-white">Settings</p>
          </div>
          <div className="slippage-tab mt-2 flex items-center justify-between rounded-xl p-4">
            <div className="hidden text-[16px] dark:text-white sm:block">
              <p className="flex items-center justify-between gap-1">
                Slippage tolerance{" "}
                <ExclamationCircleIcon className="h-4 w-4 dark:text-white" data-tooltip-target="tooltip-default" />
              </p>
            </div>
            <div className="relative grid grid-flow-col grid-cols-2 rounded-full border text-center dark:border-primary dark:text-white">
              <motion.div
                layout
                transition={spring}
                className={`absolute flex h-full w-1/2 rounded-full bg-primary ${
                  autoMode ? "justify-self-start" : "justify-self-end"
                }`}
              ></motion.div>
              <span
                onClick={() => setAutoMode(true)}
                className="z-10 flex cursor-pointer justify-center px-4 py-2 dark:text-white"
              >
                Auto
              </span>
              <span
                onClick={() => setAutoMode(false)}
                className="z-10 flex cursor-pointer justify-center px-4 py-2 dark:text-white"
              >
                Custom
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-xl px-4 py-2 ">
            <div className="hidden text-[16px] dark:text-white sm:block">
              <p className="flex items-center justify-between gap-1">
                Custom slippage{" "}
                <ExclamationCircleIcon className="h-4 w-4 dark:text-white" data-tooltip-target="tooltip-default" />
              </p>
            </div>
            <input
              type="text"
              value={autoMode ? (slippage / 100).toFixed(2) : slippageInput}
              onBlur={() => parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))}
              onChange={(e) => parseCustomSlippage(e.target.value)}
              placeholder={(autoMode ? slippage / 100 : userSlippageTolerance / 100).toFixed(2)}
              className={`max-w-[180px] rounded-xl bg-transparent text-end text-white outline-0 focus:outline-none dark:border-primary ${
                autoMode ? "opacity-25" : ""
              }`}
              disabled={autoMode}
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
