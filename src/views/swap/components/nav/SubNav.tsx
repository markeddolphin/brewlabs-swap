import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";

import { SwapContext } from "../../../../contexts/SwapContext";
import MobileNav from "./MobileNav";
import Link from "next/link";
import Notification from "@components/Notification";
import { useOwnedLiquidityPools } from "@hooks/swap/useLiquidityPools";

type Props = {
  openSettingModal: () => void;
};

const SubNav = ({ openSettingModal }: Props) => {
  const { swapTab, setSwapTab, setAddLiquidityStep, swapFeeData }: any = useContext(SwapContext);

  const { collectiblePairs } = swapFeeData;

  const [toggle, setToggle] = useState(false);

  return (
    <div className="mb-8 flex">
      <div className="tabs tabs-boxed mr-[48px] hidden sm:block">
        <button className={`tab px-3 ${swapTab === 0 ? "tab-active" : ""}`} onClick={() => setSwapTab(0)}>
          <span className="dark:text-primary">Brew</span>Swap
          <img src="/images/logo-vector.svg" className="ml-3" alt="Brew swap" />
        </button>
        <button
          className={`tab px-3 ${swapTab === 1 ? "tab-active" : ""} relative`}
          onClick={() => {
            setSwapTab(1);
            setAddLiquidityStep("default");
          }}
          // disabled
        >
          Liquidity tools
          <Notification count={collectiblePairs.length} />
        </button>
        <Link href={"/tradingPairs"}>
          <button
            className={`tab px-3 ${swapTab === 2 ? "tab-active" : ""}`}
            //  onClick={() => setSwapTab(2)}
          >
            Pools & analytics
          </button>
        </Link>
      </div>
      <MobileNav></MobileNav>
      <div className="absolute right-7 top-6" onClick={openSettingModal}>
        <Cog8ToothIcon className="h-6 w-6 cursor-pointer hover:animate-spin dark:text-primary" />
      </div>
    </div>
  );
};

export default SubNav;
