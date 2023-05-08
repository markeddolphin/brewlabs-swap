import { ReactElement } from "react";
import clsx from "clsx";
import { Bars3Icon } from "@heroicons/react/24/outline";
import LogoIcon from "../LogoIcon";
import { setGlobalState, useGlobalState } from "../../state";

const HeaderMobile = (): ReactElement => {
  // Retrieve global state
  const [modalIsOpen] = useGlobalState("modalIsOpen");

  return (
    <div
      className={clsx(
        modalIsOpen ? "z-0" : "z-10",
        "fixed top-0 left-0 flex w-full items-center justify-between bg-gradient-to-b from-zinc-900 via-zinc-900 to-transparent px-4 py-2 lg:hidden"
      )}
    >
      <LogoIcon classNames="w-12 text-dark dark:text-brand" />
      <button
        type="button"
        className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-dark hover:text-gray-900 dark:text-brand"
        onClick={() => setGlobalState("mobileNavOpen", true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
};

export default HeaderMobile;
