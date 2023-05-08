/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import StyledButton from "../../StyledButton";
import { useEffect, useState } from "react";
import ChainSelect from "../ChainSelect";
import RouterSelect from "../RouterSelect";
import { useActiveChainId } from "hooks/useActiveChainId";
import { PlusSVG } from "@components/dashboard/assets/svgs";

const SelectToken = ({ step, setStep }) => {
  const [contractAddress, setContractAddress] = useState(new Array(5).fill(""));
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
          {["", "", "", "", ""].map((data, i) => {
            return (
              <div key={i}>
                <div className="flex items-center rounded-lg bg-[#FFFFFF0D] p-[0px_14px]">
                  <StyledInput
                    placeholder={`Search by contract address...`}
                    value={contractAddress[i]}
                    onChange={(e) => {
                      let temp = [...contractAddress];
                      temp[i] = e.target.value;
                      setContractAddress(temp);
                    }}
                  />
                  <CircleImage className="h-8 w-8" />
                </div>
                {i !== 4 ? (
                  <div className="my-2 flex w-full scale-150 justify-center text-[#5D616A]">{PlusSVG}</div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-5 mt-8 h-[1px] w-full bg-[#FFFFFF80]" />
      <div className="mx-auto h-12 max-w-[500px]">
        <StyledButton type="primary" onClick={() => setStep(2)} disabled={!tokenAddress}>
          Next
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
