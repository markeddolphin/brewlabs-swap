/* eslint-disable react-hooks/exhaustive-deps */
import { WNATIVE } from "@brewlabs/sdk";
import styled from "styled-components";

import { PlusSVG } from "components/dashboard/assets/svgs";

import contracts from "config/constants/contracts";
import { useActiveChainId } from "hooks/useActiveChainId";

import StyledButton from "../../StyledButton";
import ChainSelect from "../ChainSelect";
import TokenSelect from "../TokenSelect";

const SelectToken = ({ setStep, tokens, setTokens }) => {
  const { chainId } = useActiveChainId();

  const isSupportedChain = Object.keys(contracts.indexFactory).includes(chainId.toString());
  const isDuplicated = tokens
    .map((t) => `${t?.chainId}-${t?.address}`)
    .some((item, idx) => tokens.map((t) => `${t?.chainId}-${t?.address}`).indexOf(item) !== idx);

  const handleTokenSelected = (index, currency) => {
    let _tokens = tokens;
    _tokens[index] = currency.address ? currency : WNATIVE[currency.chainId];
    setTokens(_tokens);
  };
  const addToken = () => {
    setTokens([...tokens, undefined]);
  };

  return (
    <div>
      <div>
        <div className="mt-2 text-white">
          <div className="mb-1">1.Select deployment network:</div>
          <ChainSelect />
        </div>
        <div className="text-white">
          <div className="mb-1">2. Select token:</div>

          {tokens.map((token, i) => (
            <div className="my-2" key={i}>
              <TokenSelect selectedCurrency={token} setSelectedCurrency={(c) => handleTokenSelected(i, c)} />
            </div>
          ))}
          {tokens.length < 5 && (
            <div
              className="mt-4 flex w-full scale-150 cursor-pointer justify-center text-[#5D616A] hover:text-white"
              onClick={addToken}
            >
              {PlusSVG}
            </div>
          )}
        </div>
      </div>
      <div className="mb-5 mt-8 h-[1px] w-full bg-[#FFFFFF80]" />
      <div className="mx-auto h-12 max-w-[500px]">
        <StyledButton
          type="primary"
          onClick={() => setStep(2)}
          disabled={!isSupportedChain || isDuplicated || tokens.length == 0 || tokens.filter((t) => !t).length > 0}
        >
          {isSupportedChain ? "Next" : "Not support current chain"}
        </StyledButton>
      </div>
    </div>
  );
};

const StyledInput = styled.input`
  height: 55px;
  font-size: 16px;
  flex: 1;
  color: white;
  outline: none;
  background: transparent;
`;

const CircleImage = styled.div`
  background: #d9d9d9;
  border: 1px solid #000000;
  border-radius: 50%;
`;

export default SelectToken;
