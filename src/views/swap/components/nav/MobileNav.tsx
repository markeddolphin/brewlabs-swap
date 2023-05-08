import { Menu, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Hambuger from "../button/Hambuger";
import { SwapContext } from "contexts/SwapContext";

export default function MobileNav() {
  const { swapTab, setSwapTab, setAddLiquidityStep }: any = useContext(SwapContext);

  return (
    <Menu as="div" className="relative mt-1 inline-block text-left sm:hidden">
      {({ open, close }) => (
        <>
          <div>
            <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <Hambuger open={open} onClick={close}></Hambuger>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-[#262B36] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        swapTab === 0 || active ? "bg-[#4B5563] text-white" : "text-gray-400/50"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => setSwapTab(0)}
                    >
                      <span className="dark:text-primary">Brew</span>Swap
                      <img src="/images/logo-vector.svg" className="ml-3" alt="Brew swap" />
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        swapTab === 1 || active ? "bg-[#4B5563] text-white" : "text-gray-400/50"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => {
                        setSwapTab(1);
                        setAddLiquidityStep(0);
                      }}
                      disabled
                    >
                      Add liquidity
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        swapTab === 2 || active ? "bg-[#4B5563] text-white" : "text-gray-400/50"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => setSwapTab(2)}
                      disabled
                    >
                      Swap Rewards
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
