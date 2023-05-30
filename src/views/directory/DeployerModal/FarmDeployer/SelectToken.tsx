/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";

import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { isAddress } from "utils";
import { getDexLogo } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import StyledButton from "../../StyledButton";
import ChainSelect from "../ChainSelect";
import RouterSelect from "../RouterSelect";

const SelectToken = ({ setStep, router, setRouter, lpAddress, setLpAddress, lpInfo }) => {
  const { chainId } = useActiveChainId();
  const { tokenList: supportedTokens }: any = useContext(DashboardContext);

  const token0Address = isAddress(lpInfo?.pair?.token0.address);
  const token1Address = isAddress(lpInfo?.pair?.token1.address);
  const notSupported =
    router?.factory?.toLowerCase() !== lpInfo?.pair?.factory?.toLowerCase() ||
    supportedTokens
      .filter((t) => t.chainId === chainId)
      .filter(
        (t) =>
          t.address.toLowerCase() === token0Address?.toLowerCase() ||
          t.address.toLowerCase() === token1Address?.toLowerCase()
      ).length < 2;

  return (
    <div>
      <div>
        <div className="mt-2 text-white">
          <div className="mb-1">1.Select deployment network:</div>
          <ChainSelect />
        </div>
        <div>
          <div className="mb-1 text-white">2. Select router:</div>
          <RouterSelect router={router} setRouter={setRouter} />
        </div>
      </div>

      <div className="mt-6">
        <div className={`mb-1 ${lpInfo.pair ? "text-white" : ""}`}>3. Select token:</div>
        <input
          className="h-[55px] w-full rounded-lg bg-[#FFFFFF0D] p-[16px_14px] text-base text-white outline-none"
          placeholder={`Search by contract address...`}
          value={lpAddress}
          onChange={(e) => {
            setLpAddress(e.target.value);
          }}
        />
      </div>
      <div className="mb-3 flex h-[130px] items-center justify-center text-[#FFFFFF40]">
        {lpInfo.pair ? (
          <div className="w-full text-sm text-white">
            <div className="text-center">{notSupported ? "Provided LP token is not supported" : `LP Token found!`}</div>
            {!notSupported && (
              <div className="mt-3 flex items-center">
                <img
                  src={getDexLogo(router.id)}
                  alt={""}
                  className="mr-4 block h-7 w-7 rounded-full shadow-[0px_0px_10px_rgba(255,255,255,0.5)] sm:hidden"
                  onError={(e: any) => {
                    e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
                  }}
                />
                <div className="relative mx-auto flex w-fit items-center overflow-hidden text-ellipsis whitespace-nowrap sm:flex sm:overflow-visible">
                  <img
                    src={getDexLogo(router.id)}
                    alt={""}
                    className="absolute -left-12 top-0 hidden h-7 w-7 rounded-full shadow-[0px_0px_10px_rgba(255,255,255,0.5)] sm:block"
                    onError={(e: any) => {
                      e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
                    }}
                  />
                  <img
                    src={getTokenLogoURL(token0Address, chainId)}
                    alt={""}
                    className="h-7 w-7 rounded-full"
                    onError={(e: any) => {
                      e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
                    }}
                  />
                  <img
                    src={getTokenLogoURL(token1Address, chainId)}
                    alt={""}
                    className="-ml-3 h-7 w-7 rounded-full"
                    onError={(e: any) => {
                      e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
                    }}
                  />
                  <div className="ml-2 flex-1  overflow-hidden text-ellipsis whitespace-nowrap xsm:flex-none">
                    {lpInfo.pair.address}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : lpAddress === "" || lpInfo.pending ? (
          "Pending..."
        ) : (
          "Not Found"
        )}
      </div>
      <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" />
      <div className="mx-auto h-12 max-w-[500px]">
        <StyledButton
          type="primary"
          onClick={() => {
            setStep(2);
          }}
          disabled={!lpInfo?.pair || notSupported}
        >
          Next
        </StyledButton>
      </div>
    </div>
  );
};

export default SelectToken;
