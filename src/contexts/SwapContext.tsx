import { CurrencyAmount, Price } from "@brewlabs/sdk";
import { slippageDefault } from "config/constants";
import { BigNumber } from "ethers";
import React, { useState } from "react";
import { useDefaultsFromURLSearch } from "state/swap/hooks";

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
  addLiquidityStep: 0,
  openSettingModal: false,
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
  const [addLiquidityStep, setAddLiquidityStep] = useState(0);
  const [openSettingModal, setOpenSettingModal] = useState(false);

  useDefaultsFromURLSearch();

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
