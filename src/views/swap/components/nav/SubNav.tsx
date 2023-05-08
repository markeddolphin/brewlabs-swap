import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";

import { SwapContext } from "../../../../contexts/SwapContext";
import MobileNav from "./MobileNav";

type Props = {
  openSettingModal: () => void;
};

const SubNav = ({ openSettingModal }: Props) => {
  const { swapTab, setSwapTab, setAddLiquidityStep }: any = useContext(SwapContext);

  const [toggle, setToggle] = useState(false);

  return (
    <div className="mb-8 flex">
      <div className="tabs tabs-boxed mr-[48px] hidden sm:block">
        <button className={`tab px-3 ${swapTab === 0 ? "tab-active" : ""}`} onClick={() => setSwapTab(0)}>
          <span className="dark:text-primary">Brew</span>Swap
          <img src="/images/logo-vector.svg" className="ml-3" alt="Brew swap" />
        </button>
        <button
          className={`tab px-3 ${swapTab === 1 ? "tab-active" : ""}`}
          onClick={() => {
            setSwapTab(1);
            setAddLiquidityStep(0);
          }}
          disabled
        >
          Add liquidity
        </button>
        <button className={`tab px-3 ${swapTab === 2 ? "tab-active" : ""}`} onClick={() => setSwapTab(2)} disabled>
          Swap Rewards
        </button>
      </div>
      <MobileNav></MobileNav>
      <div className="absolute right-7 top-6" onClick={openSettingModal}>
        <Cog8ToothIcon className="h-6 w-6 cursor-pointer hover:animate-spin dark:text-primary" />
      </div>
    </div>
  );
};

export default SubNav;
