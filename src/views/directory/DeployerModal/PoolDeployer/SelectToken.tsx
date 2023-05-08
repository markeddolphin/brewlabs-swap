/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import StyledButton from "../../StyledButton";
import { useEffect, useState } from "react";
import ChainSelect from "../ChainSelect";
import RouterSelect from "../RouterSelect";
import { useActiveChainId } from "hooks/useActiveChainId";

const SelectToken = ({ step, setStep }) => {
  const [contractAddress, setContractAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState(null);
  const [routerAddress, setRouterAddress] = useState(null);
  const { chainId } = useActiveChainId();

  useEffect(() => {
    if (contractAddress.length) setTokenAddress("0x330518cc95c92881bCaC1526185a514283A5584D");
    else setTokenAddress(null);
  }, [contractAddress]);

  return (
    <div>
      <div>
        <div className="mt-2 text-white">
          <div className="mb-1">1.Select deployment network:</div>
          {/* <ChainSelect id="chain-select" /> */}
          <ChainSelect />
        </div>
        <div className={tokenAddress ? "text-white" : "text-[#FFFFFF40]"}>
          <div className="mb-1">2. Select token:</div>
          <StyledInput
            placeholder={`Search by contract address...`}
            value={contractAddress}
            onChange={(e) => {
              setContractAddress(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex h-[130px] items-center justify-center text-[#FFFFFF40]">
        {tokenAddress ? (
          <div className="w-full text-sm text-white">
            <div className="text-center">Token found!</div>
            <div className="mt-3 flex w-full items-center justify-center">
              <div className="mr-1.5 h-7 w-7 rounded-full bg-[#D9D9D9]" />
              <div className="flex-1 overflow-hidden  text-ellipsis whitespace-nowrap xsm:flex-none">
                {tokenAddress}
              </div>
            </div>
          </div>
        ) : (
          "Pending..."
        )}
      </div>
      <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" />
      <div className="mx-auto h-12 max-w-[500px]">
        <StyledButton type="primary" onClick={() => setStep(2)} disabled={!tokenAddress}>
          Next
        </StyledButton>
      </div>
    </div>
  );
};

const StyledInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 16px 14px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: white;
  outline: none;
`;
export default SelectToken;
