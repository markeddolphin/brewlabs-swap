import { SwapContext } from "contexts/SwapContext";
import React, { useContext } from "react";

import OutlinedButton from "../button/OutlinedButton";
import Notification from "@components/Notification";
import Link from "next/link";

export default function CreateLiquidityOption() {
  const { addLiquidityStep, setAddLiquidityStep, swapFeeData }: any = useContext(SwapContext);
  const { collectiblePairs } = swapFeeData;
  return addLiquidityStep === "default" ? (
    <>
      <div className="font-brand text-xl text-white">Create and manage your liquidity</div>

      <OutlinedButton
        image="/images/swap/database.svg"
        className="mt-6"
        onClick={(e) => {
          setAddLiquidityStep("CreateNewLiquidityPool");
          e.preventDefault();
        }}
        borderDotted
      >
        Create&nbsp;<span className="text-white">new</span>
        &nbsp;liquidity pool on&nbsp;<span className="dark:text-primary">Brew</span>
        <span className="text-white">Swap</span>
      </OutlinedButton>

      <Link href={"/constructor"}>
        <OutlinedButton image="/images/swap/plus-minus.svg" className="mt-2">
          <div className="relative">
            <span className="text-white">Add or remove </span>
            &nbsp;<span className="dark:text-primary">Brew</span>
            <span className="text-white">Swap</span>&nbsp;pair liquidity
          </div>
        </OutlinedButton>
      </Link>

      <OutlinedButton
        image="/images/swap/logout.svg"
        className="mt-2"
        onClick={() => setAddLiquidityStep("ViewHarvestFees")}
      >
        <div className="relative">
          View and&nbsp;<span className="text-white">harvest</span>
          &nbsp;my&nbsp;<span className="dark:text-primary">Brew</span>
          <span className="text-white">Swap</span>&nbsp;fees
          <Notification count={collectiblePairs.length} className="!-right-[26px] !-top-2.5" />
        </div>
      </OutlinedButton>
    </>
  ) : addLiquidityStep === "CreateNewLiquidityPool" ? (
    <>
      <div className="font-brand text-xl text-white">Create new liquidity pool</div>

      <OutlinedButton
        image="/images/swap/database.svg"
        className="mt-6"
        onClick={(e) => {
          e.preventDefault();
          setAddLiquidityStep("CreateBasicLiquidityPool");
        }}
        borderDotted
      >
        <div className="flex flex-wrap justify-center">
          Create a&nbsp;<span className="text-white">basic</span>
          &nbsp;liquidity pool on&nbsp;<span className="dark:text-primary">Brew</span>
          <span className="text-white">Swap</span>
        </div>
      </OutlinedButton>

      <OutlinedButton
        image="/images/swap/database.svg"
        className="mt-2"
        onClick={(e) => {
          e.preventDefault();
          setAddLiquidityStep("CreateBundleLiquidityPool");
        }}
        borderDotted
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap">
            <div className="whitespace-nowrap">Create a</div>&nbsp;<span className="text-white">bundle</span>
            &nbsp;<div className="whitespace-nowrap">liquidity pool</div>&nbsp;&
          </div>
          <div className="flex flex-wrap">
            <div className="whitespace-nowrap">yield farm on</div>&nbsp;
            <span className="dark:text-primary">Brew</span>
            <span className="text-white">Swap</span>
          </div>
        </div>
      </OutlinedButton>

      <OutlinedButton
        className="mt-2"
        onClick={(e) => {
          setAddLiquidityStep("default");
          e.preventDefault();
        }}
        small
      >
        Back
      </OutlinedButton>
    </>
  ) : null;
}
