import { CurrencyAmount, Price } from "@brewlabs/sdk";
import { useOwnedLiquidityPools } from "@hooks/swap/useLiquidityPools";
import { slippageDefault } from "config/constants";
import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import { useDefaultsFromURLSearch } from "state/swap/hooks";
import { getStringfy } from "utils/functions";

const SwapContext: any = React.createContext({
  quoteData: {},
  outputAmount: "",
  slippageInput: "",
  autoMode: true,
  basePrice: "",
  quotePrice: "",
  onTyping: false,
  parsedAmount: "",
  buyTax: 0,
  sellTax: 0,
  slippage: slippageDefault,
  verified: false,
  apporveStep: 0,
  swapTab: 0,
  addLiquidityStep: "default",
  openSettingModal: false,
  swapFeeData: "",
  setQuoteData: () => {},
  setOutputAmount: () => {},
  setSlippageInput: () => {},
  setAutoMode: () => {},
  setBasePrice: () => {},
  setQuotePrice: () => {},
  setTyping: () => {},
  setParsedAmount: () => {},
  setBuyTax: () => {},
  setSellTax: () => {},
  setSlippage: () => {},
  setVerified: () => {},
  setApproveStep: () => {},
  setSwapTab: () => {},
  setAddLiquidityStep: () => {},
  setOpenSettingModal: () => {},
});

const SwapContextProvider = ({ children }: any) => {
  const [quoteData, setQuoteData] = useState({});
  const [outputAmount, setOutputAmount] = useState<CurrencyAmount>();
  const [slippageInput, setSlippageInput] = useState("");
  const [autoMode, setAutoMode] = useState(true);
  const [basePrice, setBasePrice] = useState<Price>();
  const [quotePrice, setQuotePrice] = useState<Price>();
  const [onTyping, setTyping] = useState(false);
  const [parsedAmount, setParsedAmount] = useState<BigNumber>();
  const [buyTax, setBuyTax] = useState(0);
  const [sellTax, setSellTax] = useState(0);
  const [slippage, setSlippage] = useState(slippageDefault);
  const [verified, setVerified] = useState(false);
  const [apporveStep, setApproveStep] = useState(0);

  const [swapTab, setSwapTab] = useState(0);
  const [addLiquidityStep, setAddLiquidityStep] = useState("default");
  const [openSettingModal, setOpenSettingModal] = useState(false);

  const [swapFeeData, setSwapFeeData] = useState({
    eligiblePairs: [],
    ownedPairs: [],
    lpBalances: {},
    collectiblePairs: [],
    rewards: [],
    pairTokens: {},
  });

  useDefaultsFromURLSearch();

  const { eligiblePairs, ownedPairs, lpBalances, collectiblePairs, rewards, pairTokens } = useOwnedLiquidityPools();

  const s_eligiblePairs = getStringfy(eligiblePairs);
  const s_ownedPairs = getStringfy(ownedPairs);
  const s_lpBalances = getStringfy(lpBalances);
  const s_collectiblePairs = getStringfy(collectiblePairs);
  const s_rewards = getStringfy(rewards);
  const s_pairTokens = getStringfy(pairTokens);

  useEffect(() => {
    setSwapFeeData({ eligiblePairs, ownedPairs, lpBalances, collectiblePairs, rewards, pairTokens });
  }, [s_eligiblePairs, s_ownedPairs, s_lpBalances, s_collectiblePairs, s_rewards, s_pairTokens]);

  return (
    <SwapContext.Provider
      value={{
        quoteData,
        outputAmount,
        slippageInput,
        autoMode,
        basePrice,
        quotePrice,
        onTyping,
        parsedAmount,
        buyTax,
        sellTax,
        slippage,
        verified,
        apporveStep,
        swapTab,
        addLiquidityStep,
        openSettingModal,
        swapFeeData,
        setQuoteData,
        setOutputAmount,
        setSlippageInput,
        setAutoMode,
        setBasePrice,
        setQuotePrice,
        setTyping,
        setParsedAmount,
        setBuyTax,
        setSellTax,
        setSlippage,
        setVerified,
        setApproveStep,
        setSwapTab,
        setAddLiquidityStep,
        setOpenSettingModal,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};

export { SwapContext, SwapContextProvider };
