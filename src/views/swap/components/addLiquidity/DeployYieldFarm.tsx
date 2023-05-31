import CurrencyInputPanel from "components/currencyInputPanel";
import React, { useContext, useMemo, useState } from "react";
import SolidButton from "../button/SolidButton";
import OutlinedButton from "../button/OutlinedButton";
import CheckIcon from "../CheckIcon";
import { SwapContext } from "contexts/SwapContext";
import { Field } from "state/mint/actions";
import { Currency } from "@brewlabs/sdk";
import { CurrencyLogo } from "@components/logo";

export const CheckStatus = ({ status }: { status: number }) => {
  return status === 0 ? (
    <div className="h-6 w-6 rounded-full border border-gray-600 sm:h-8 sm:w-8"></div>
  ) : status === 1 ? (
    <CheckIcon className="h-6 w-6 fill-gray-600 sm:h-8 sm:w-8"></CheckIcon>
  ) : (
    <CheckIcon className="h-6 w-6 fill-[#2FD35D] sm:h-8 sm:w-8"></CheckIcon>
  );
};

export default function DeployYieldFarm({
  onAddLiquidity,
  attemptingTxn,
  hash,
  currencies,
}: {
  onAddLiquidity: () => void;
  attemptingTxn: boolean;
  hash: string | undefined;
  currencies: { [field in Field]?: Currency };
}) {
  const { setAddLiquidityStep }: any = useContext(SwapContext);

  const [initialReward, setInitialReward] = useState(0.1);

  const onUpdateInitialReward = (update) => {
    const newValue = initialReward + update;
    setInitialReward(Math.min(Math.max(newValue, 0), 100));
  };

  const justEntered = useMemo(() => {
    return !attemptingTxn && !hash;
  }, [attemptingTxn, hash]);

  const onBack = (e) => {
    e.preventDefault();
    if (justEntered) {
      setAddLiquidityStep(3);
    } else {
      setAddLiquidityStep(0);
    }
  };

  const data = [
    {
      key: "Total BREWLABS token supply",
      value: "1,000,000,000.00",
      large: true,
    },
    {
      key: "Yield farm duration",
      value: "Perpetual",
    },
    {
      key: "Initial reward supply for 12 months",
      value: initialReward.toFixed(2) + "%",
      controller: true,
      onUpdate: onUpdateInitialReward,
    },
    {
      key: "Tokens required",
      value: "10,000,000.00",
    },
    {
      key: "Yield farm launch",
      value: "1.00 ETH",
    },
    {
      key: "Deployment fee",
      value: "1,600.00 USDC",
    },
  ];

  const summaryData = [
    {
      key: "Yield farm contract address",
      value: "0x8793192319....",
      image: "/images/networks/eth.svg",
    },
    {
      key: "Yield farm reward start",
      value: "23:11:59",
    },
    {
      key: "Liquidity token address",
      value: "0x8793192319....",
      image: "/images/networks/eth.svg",
    },
  ];

  return (
    <>
      <div className="font-['Roboto'] text-xl text-white">Step 2/2: Deploy yield farm</div>

      <div className="flex items-center justify-between rounded-3xl border border-primary p-4">
        <img src="/images/networks/eth.svg" alt="" className="h-6 w-6 sm:h-8 sm:w-8"></img>
        <CheckIcon className="h-4 w-4 fill-[#eebb19]"></CheckIcon>
        <div className="flex min-w-[130px] items-center sm:min-w-[220px]">
          {currencies[Field.CURRENCY_A] && <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="30px" />}
          {currencies[Field.CURRENCY_B] && (
            <div className="-ml-2">
              <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="30px" />
            </div>
          )}
          <span className="ml-0 text-xs text-white sm:ml-2 sm:text-base">ETH-BREWLABS</span>
        </div>
        <button
          className="flex items-center rounded border border-gray-700 bg-gray-800 py-1 pl-[20px] pr-[7px]"
          onClick={onBack}
        >
          <span className="text-xs">Selected</span>
          <img src="images/swap/database_full.svg" alt=""></img>
        </button>
      </div>

      <div className="mt-4 px-0 sm:px-4">
        <div className="rounded-3xl border border-gray-600 px-5 pb-8 pt-3 font-['Roboto'] text-xs font-bold sm:text-sm">
          <div className="mb-3 flex justify-between">
            <div className="text-base text-gray-300 sm:text-xl">New yield farm metrics</div>
            <div className="flex min-w-[100px] items-center justify-center">
              {currencies[Field.CURRENCY_A] && <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="30px" />}
              {currencies[Field.CURRENCY_B] && (
                <div className="-ml-2">
                  <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="30px" />
                </div>
              )}
            </div>
          </div>

          {data.map((item) => (
            <div key={item.key} className="mt-1 flex justify-between">
              <div>{item.key}</div>
              <div className={`ml-2 flex min-w-[120px] ${item.large ? "sm:min-w-[150px]" : ""}`}>
                {!item.large && (
                  <div className="min-w-[12px] text-gray-600">
                    {item.controller && (
                      <button className="w-full text-left" onClick={() => item.onUpdate(0.05)}>
                        +
                      </button>
                    )}
                  </div>
                )}
                {item.value}
                {item.controller && (
                  <div className="min-w-[12px] text-gray-600">
                    <button className="w-full text-right" onClick={() => item.onUpdate(-0.05)}>
                      -
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="mt-3 flex items-center justify-between">
            <div className={`${!justEntered ? "text-[#2FD35D]" : ""}`}>
              {attemptingTxn ? "Deploying..." : hash ? "Deployed" : "Deployment transactions remaining"}
            </div>
            <div className="ml-2 flex min-w-[100px] items-center">
              <CheckStatus status={justEntered ? 0 : 2}></CheckStatus>
              <div className={`h-0 w-4 border sm:w-4 ${justEntered ? "border-gray-600" : "border-[#2FD35D]"}`}></div>
              <CheckStatus status={!hash ? 1 : 2}></CheckStatus>
            </div>
          </div>
        </div>
        <div className="mb-6 mt-2 rounded-3xl border border-gray-600 px-5 pb-4 pt-3 font-['Roboto'] text-xs font-bold sm:text-sm">
          <div className="text-lg text-gray-300">Summary</div>
          {justEntered ? (
            <div>Available after deployment</div>
          ) : (
            <>
              {summaryData.map((item) => (
                <div key={item.key} className="mt-1 flex justify-between">
                  <div>{item.key}</div>
                  <div className="ml-2 flex min-w-[130px] items-center sm:min-w-[150px]">
                    <div className="min-w-[20px]">
                      {item.image && <img src={item.image} alt="" className="h-4 w-4"></img>}
                    </div>
                    {item.value}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {justEntered && (
        <SolidButton disabled={false} onClick={onAddLiquidity}>
          Create pair & yield farm
        </SolidButton>
      )}
      {attemptingTxn && <SolidButton disabled={false}>Deploying...</SolidButton>}
      {!attemptingTxn && (
        <OutlinedButton className="mt-1 font-bold" small onClick={onBack}>
          {justEntered ? "Back" : "Close window"}
        </OutlinedButton>
      )}
    </>
  );
}
