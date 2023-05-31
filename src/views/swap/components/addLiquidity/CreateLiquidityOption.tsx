import { SwapContext } from "contexts/SwapContext";
import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";

import OutlinedButton from "../button/OutlinedButton";

export default function CreateLiquidityOption() {
  const { addLiquidityStep, setAddLiquidityStep, setSwapTab }: any = useContext(SwapContext);

  return addLiquidityStep === 0 ? (
    <>
      <div className="font-['Roboto'] text-xl text-white">Create and manage your liquidity</div>

      <OutlinedButton
        image="/images/swap/database.svg"
        className="mt-6"
        onClick={(e) => {
          e.preventDefault();
          setAddLiquidityStep(1);
        }}
        borderDotted
      >
        Create&nbsp;<span className="text-white">new</span>
        &nbsp;liquidity pool on&nbsp;<span className="dark:text-primary">Brew</span>
        <span className="text-white">Swap</span>
      </OutlinedButton>

      <OutlinedButton
        image="/images/swap/logout.svg"
        className="mt-2"
        onClick={() => {
          // setSwapTab(2);
        }}
      >
        View and&nbsp;<span className="text-white">harvest</span>
        &nbsp;my&nbsp;<span className="dark:text-primary">Brew</span>
        <span className="text-white">Swap</span>&nbsp;rewards
      </OutlinedButton>

      <OutlinedButton href="https://earn.brewlabs.info/liquidity" image="/images/swap/logout.svg" className="mt-2" small>
        Visit my pools
      </OutlinedButton>
    </>
  ) : addLiquidityStep === 1 ? (
    <>
      <div className="font-['Roboto'] text-xl text-white">Create new liquidity pool</div>

      <OutlinedButton
        image="/images/swap/database.svg"
        className="mt-6"
        onClick={(e) => {
          e.preventDefault();
          setAddLiquidityStep(2);
        }}
        borderDotted
        description="Regular pool"
      >
        Create a&nbsp;<span className="text-white">basic</span>
        &nbsp;liquidity pool on&nbsp;<span className="dark:text-primary">Brew</span>
        <span className="text-white">Swap</span>
      </OutlinedButton>

      <OutlinedButton
        image="/images/swap/database.svg"
        className="mt-2"
        onClick={(e) => {
          e.preventDefault();
          setAddLiquidityStep(3);
        }}
        description="Regular pool + yield farm"
        borderDotted
      >
        Create a&nbsp;<span className="text-white">bundle</span>
        &nbsp;liquidity pool on&nbsp;<span className="dark:text-primary">Brew</span>
        <span className="text-white">Swap</span>
      </OutlinedButton>

      <OutlinedButton
        className="mt-2"
        onClick={(e) => {
          e.preventDefault();
          setAddLiquidityStep(0);
        }}
        small
      >
        Back
      </OutlinedButton>
    </>
  ) : null;
}
