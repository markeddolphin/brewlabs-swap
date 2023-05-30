/* eslint-disable react-hooks/exhaustive-deps */

import { EXCHANGE_MAP, FACTORY_ADDRESS_MAP, ROUTER_ADDRESS_MAP } from "@brewlabs/sdk";
import { CheckIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { SUPPORTED_DEXES } from "config/constants/swap";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getDexLogo } from "utils/functions";

const RouterSelect = ({ router, setRouter }) => {
  const { chainId } = useActiveChainId();

  const [open, setOpen] = useState(false);
  const [supportedRouters, setSupportedRouters] = useState([]);

  useEffect(() => {
    setSupportedRouters(EXCHANGE_MAP[chainId].filter((dex) => SUPPORTED_DEXES[chainId]?.includes(dex.id)));
  }, [chainId]);

  useEffect(() => {
    setRouter({
      ...supportedRouters[0],
      address: ROUTER_ADDRESS_MAP[supportedRouters[0]?.key]?.[chainId],
      factory: FACTORY_ADDRESS_MAP[supportedRouters[0]?.key]?.[chainId],
    });
  }, [supportedRouters]);

  const handleRouterSelected = (index) => {
    setRouter({
      ...supportedRouters[index],
      address: ROUTER_ADDRESS_MAP[supportedRouters[index]?.key]?.[chainId],
      factory: FACTORY_ADDRESS_MAP[supportedRouters[index]?.key]?.[chainId],
    });

    setOpen(false)
  };

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
                <div className="p-4 font-brand">
                  <h5 className="mb-2 text-2xl dark:text-slate-400">Routers</h5>
                  <p className="dark:text-gray-500">Select a router</p>

                  <ul role="list" className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
                    {supportedRouters.map((data, index) => (
                      <li key={data.id}>
                        <button
                          className="flex w-full items-center py-4 hover:bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
                          onClick={() => handleRouterSelected(index)}
                        >
                          <img className="h-10 w-10 rounded-full" src={getDexLogo(data.id)} alt={data.name} />
                          <div className="ml-4 flex-col text-left">
                            <p className="text-sm font-medium text-gray-900">{data.name}</p>
                          </div>

                          <div className="ml-auto">
                            {data.id === router.id && <CheckIcon className="text-green-600 mr-2 h-6 w-6" />}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
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

      <button
        className="flex w-full items-center justify-between"
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="flex gap-2">
          <div
            className="-mr-4 h-6 w-6 overflow-hidden rounded-full bg-cover bg-no-repeat dark:bg-slate-800"
            style={{
              backgroundImage: `url(${getDexLogo(router?.id)})`,
            }}
          ></div>
          <span className="pl-4 pr-1">{router?.name}</span>
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
export default RouterSelect;
