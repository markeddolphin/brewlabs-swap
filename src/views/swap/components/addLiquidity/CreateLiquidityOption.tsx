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
          setSwapTab(2);
        }}
      >
        View and&nbsp;<span className="text-white">harvest</span>
        &nbsp;my&nbsp;<span className="dark:text-primary">Brew</span>
        <span className="text-white">Swap</span>&nbsp;fees
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
      >
        <div className = 'flex flex-wrap justify-center'>
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
          setAddLiquidityStep(3);
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
