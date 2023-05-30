/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ConnectWallet from "./ConnectWallet";
import UserDashboard from "components/dashboard/UserDashboard";
import { useGlobalState } from "../../state";
import { useAccount, useConnect } from "wagmi";

let tempConnected;

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [sidebarContent, setSidebarContent] = useGlobalState("userSidebarContent");
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  tempConnected = isConnected;

  useEffect(() => {
    if (!window.ethereum) return;
    if (!tempConnected) connect({ connector: connectors[0] });
    window.ethereum.on("chainChanged", async (chainId) => {
      if (!tempConnected) connect({ connector: connectors[0] });
    });
  }, [window.ethereum]);

  return (
    <Transition.Root show={isOpen > 0} as={Fragment}>
      <Dialog as="div" onClose={() => setIsOpen(0)} className="relative z-40">
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex font-roboto">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-[750px] flex-1 flex-col items-center bg-white px-2 focus:outline-none dark:border-gray-800 dark:bg-zinc-900">
              <div
                className={clsx(
                  "absolute right-0 top-0 z-10 pt-2 sm:-mr-12",
                  isOpen ? "animate__animated animate__fadeInLeft animate__delay-1s" : "hidden"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(0);
                  }}
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-inset focus:ring-white sm:focus:ring-2"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="relative flex h-full w-full flex-1 flex-col items-center px-6 py-6">
                {sidebarContent ?? <UserDashboard />}
              </div>
              <ConnectWallet allowDisconnect />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UserSidebar;
