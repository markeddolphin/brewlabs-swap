/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useMemo, useRef } from "react";
import { Token } from "@brewlabs/sdk";
import { getAddress } from "@ethersproject/address";

import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useGlobalState } from "state";
import getTokenLogoURL from "utils/getTokenLogoURL";

import CurrencySelector from "components/CurrencySelector";
import { DrawSVG } from "components/dashboard/assets/svgs";

const TokenSelect = ({ selectedCurrency, setSelectedCurrency }) => {
  const { chainId } = useActiveChainId();
  const { tokens, tokenList: supportedTokens }: any = useContext(DashboardContext);

  const dropdownRef: any = useRef();
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [, setSidebarContent] = useGlobalState("userSidebarContent");

  const filteredTokenList = useMemo(
    () =>
      tokens
        .filter((t) => supportedTokens.map((st) => st.address.toLowerCase()).includes(t.address.toLowerCase()))
        .map(
          (t) =>
            new Token(
              chainId,
              getAddress(t.address),
              t.decimals,
              t.symbol,
              t.name,
              undefined,
              supportedTokens.find((st) => st.address.toLowerCase() === t.address.toLowerCase())?.logoURI
            )
        ),
    [supportedTokens.length, tokens.length]
  );

  function onUserInput(input, currency) {}
  function onCurrencySelect(input, currency) {
    setSelectedCurrency(currency);
  }
 
  return (
    <div className="relative z-20" ref={dropdownRef}>
      <div
        className={`flex h-[36px] cursor-pointer items-center justify-between overflow-hidden rounded-md bg-[#B9B8B81A] pl-3.5`}
        onClick={() => {
          setIsOpen(isOpen === 1 ? 1 : 2);
          setSidebarContent(
            <CurrencySelector
              inputType={"input"}
              selectedCurrency={null}
              onUserInput={onUserInput}
              type={""}
              onCurrencySelect={onCurrencySelect}
              filteredCurrencies={filteredTokenList}
            />
          );
        }}
      >
        {selectedCurrency ? (
          <div className="flex flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap">
            <img
              src={getTokenLogoURL(selectedCurrency.address, chainId, selectedCurrency.logo)}
              alt={""}
              className="h-6 w-6 rounded-full"
              onError={(e: any) => (e.target.src = "/images/unknown.png")}
            />
            <div className="mx-4 w-[100px] xsm:w-[140px]">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[#FFFFFFBF]">
                {selectedCurrency.symbol}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 text-sm font-medium">Select Token...</div>
        )}
        <div className="flex h-full w-10 items-center justify-center bg-[rgb(35,40,52)] text-primary">{DrawSVG}</div>
      </div>
    </div>
  );
};

export default TokenSelect;
