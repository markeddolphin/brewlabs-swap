/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { checkCircleSVG, InfoSVG, MinusSVG, PlusSVG, UploadSVG } from "components/dashboard/assets/svgs";
import IndexLogo from "@components/logo/IndexLogo";
import LoadingText from "@components/LoadingText";

import IndexFactoryAbi from "config/abi/indexes/factory.json";
import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useTokenApprove } from "@hooks/useApprove";
import { getExplorerLink, getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { useIndexFactory } from "state/deploy/hooks";
import { getBep20Contract } from "utils/contractHelpers";
import { getChainLogo, getExplorerLogo, getIndexName } from "utils/functions";

import StyledButton from "../../StyledButton";

import { useFactory } from "./hooks";
import StyledInput from "@components/StyledInput";

const Deploy = ({ step, setStep, setOpen, tokens }) => {
  const { chainId } = useActiveChainId();
  const { address: account } = useAccount();
  const { pending, setPending }: any = useContext(DashboardContext);

  const factory = useIndexFactory(chainId);
  const { onCreate } = useFactory(chainId, factory.payingToken.isNative ? factory.serviceFee : "0");
  const { onApprove } = useTokenApprove();

  const [name, setName] = useState("");
  const [indexAddr, setIndexAddr] = useState("");
  const [depositFee, setDepositFee] = useState(0);
  const [commissionFee, setCommissionFee] = useState(0);
  const [commissionWallet, setCommissionWallet] = useState<string | undefined>();
  const [visibleType, setVisibleType] = useState(true);

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleDeploy = async () => {
    if (!factory) {
      toast.error("Not supported current chain");
      return;
    }

    if (!ethers.utils.isAddress(commissionWallet) && commissionWallet) {
      toast.error("Invalid commission wallet");
      return;
    }

    if (name.length > 25) {
      toast.error("Index name cannot exceed 25 characters");
      return;
    }

    setStep(3);
    setPending(true);

    try {
      if (factory.payingToken.isToken && +factory.serviceFee > 0) {
        const payingToken = getBep20Contract(chainId, factory.payingToken.address);
        const allowance = await payingToken.allowance(account, factory.address);

        // approve paying token for deployment
        if (
          factory.payingToken.isToken &&
          +factory.serviceFee > 0 &&
          allowance.lt(ethers.BigNumber.from(factory.serviceFee))
        ) {
          await onApprove(factory.payingToken.address, factory.address);
        }
      }

      // deploy farm contract
      const tx = await onCreate(
        name,
        tokens.map((t) => t.address),
        [depositFee, commissionFee],
        commissionWallet ?? account,
        !visibleType
      );

      const iface = new ethers.utils.Interface(IndexFactoryAbi);
      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "IndexCreated") {
            setIndexAddr(log.args.index);
            break;
          }
        } catch (e) {}
      }

      setStep(4);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(chainId));
      setStep(2);
    }

    setPending(false);
  };

  const makePendingText = () => {
    return (
      <div className="primary-shadow flex w-28 items-center justify-between rounded-lg bg-[#B9B8B81A] px-2 py-1 text-sm">
        <div className="text-[#FFFFFFBF]">{step === 2 ? "Pending" : step === 4 ? "Deployed" : "Deploying"}</div>
        {step === 4 ? (
          <div className="ml-3 scale-50 text-primary">{checkCircleSVG}</div>
        ) : (
          <div className="text-primary">{UploadSVG}</div>
        )}
      </div>
    );
  };

  return (
    <div className="font-roboto text-white">
      <div className="primary-shadow mt-4 flex items-center justify-between rounded-[30px] px-4 py-3">
        <div className="mx-auto flex w-fit items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap sm:mx-0">
          <img src={getChainLogo(chainId)} alt={""} className="h-7 w-7" />
          <div className="scale-50 text-primary">{checkCircleSVG}</div>
          <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
            <IndexLogo type="line" tokens={tokens} classNames="mx-3" />
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{getIndexName(tokens)}</div>
          </div>
        </div>
        {/* <div className="hidden sm:block">{makePendingText()}</div> */}
      </div>
      {/* <div className=" mb-5 mt-3 flex w-full justify-end sm:hidden">{makePendingText()}</div> */}

      {step === 2 && (
        <div className="mt-4  text-sm font-semibold text-[#FFFFFF80]">
          <div className="ml-4 ">
            <div className="mb-1">Set index name</div>
            <StyledInput value={name} setValue={setName} placeholder={getIndexName(tokens)} className="w-full" />
          </div>

          <div className="mt-3.5">
            <div className="mb-1 flex w-full items-end justify-between">
              <div className="flex items-center">
                <div className="tooltip" data-tip="This wallet can be changed at a later date.">
                  <div className="-mt-0.5 mr-1.5 scale-125 text-white">
                    <InfoSVG />
                  </div>
                </div>
                <div>Set deposit and commission fee wallet</div>
              </div>
            </div>
            <StyledInput
              value={commissionWallet}
              setValue={setCommissionWallet}
              placeholder="Default is your connected wallet"
              className="ml-4 w-[calc(100%-16px)]"
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="tooltip"
                  data-tip="This fee is charged when a user enters your index. This fee is sent to your nominated address. Your deposit fee is combined with Brewlabs fixed fee's of 0.25% on every index"
                >
                  <div className="-mt-0.5 mr-1.5 scale-125 text-white">
                    <InfoSVG />
                  </div>
                </div>
                <div>Set deposit fee</div>
              </div>
              <div className="flex items-center">
                <div
                  className="mx-2 scale-150 cursor-pointer text-tailwind hover:text-[#87878a]"
                  onClick={() => setDepositFee(Math.min(factory ? factory.depositFeeLimit : 0.25, depositFee + 0.01))}
                >
                  {PlusSVG}
                </div>
                <div>{depositFee.toFixed(2)}%</div>
                <div
                  className="ml-2 scale-150 cursor-pointer text-tailwind hover:text-[#87878a]"
                  onClick={() => setDepositFee(Math.max(0, depositFee - 0.01))}
                >
                  {MinusSVG}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="tooltip"
                  data-tip="This fee is charged when a user exits your index in a profitable position."
                >
                  <div className="-mt-0.5 mr-1.5 scale-125 text-white">
                    <InfoSVG />
                  </div>
                </div>
                <div>Set commission fee</div>
              </div>
              <div className="flex items-center">
                <div
                  className="mx-2 scale-150 cursor-pointer text-tailwind hover:text-[#87878a]"
                  onClick={() =>
                    setCommissionFee(Math.min(factory ? factory.commissionFeeLimit : 1, commissionFee + 0.01))
                  }
                >
                  {PlusSVG}
                </div>
                <div>{commissionFee.toFixed(2)}%</div>
                <div
                  className="ml-2 scale-150 cursor-pointer text-tailwind hover:text-[#87878a]"
                  onClick={() => setCommissionFee(Math.max(0, commissionFee - 0.01))}
                >
                  {MinusSVG}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center">
              <div className="tooltip" data-tip="Display your index to other users.">
                <div className="-mt-0.5 mr-1.5 scale-125 text-white">
                  <InfoSVG />
                </div>
              </div>
              <div>Make my index visible to others?</div>
            </div>
            <div className="ml-4 mt-4 flex">
              <StyledButton
                type={"default"}
                className={`${
                  visibleType ? "text-primary" : "text-[#FFFFFF80]"
                } !h-9 !w-36 bg-[#B9B8B81A] font-brand !text-base font-normal`}
                onClick={() => setVisibleType(true)}
              >
                Public
                {visibleType && <div className="absolute left-3 scale-[40%]">{checkCircleSVG}</div>}
              </StyledButton>
              <div className="mr-2" />
              <StyledButton
                type={"default"}
                className={`${
                  !visibleType ? "text-primary" : "text-[#FFFFFF80]"
                } !h-9 !w-36 bg-[#B9B8B81A] font-brand !text-base font-normal`}
                onClick={() => setVisibleType(false)}
              >
                Private
                {!visibleType && <div className="absolute left-3 scale-[40%]">{checkCircleSVG}</div>}
              </StyledButton>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="my-5 rounded-[30px] border border-[#FFFFFF80] px-8 py-4 font-roboto text-sm font-semibold text-[#FFFFFF80]">
          <div className="text-[#FFFFFFBF]">Summary</div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-2 xsm:flex-row ">
            <div>Index contract address</div>
            <div className="flex w-full max-w-[140px] items-center">
              <img src={getExplorerLogo(chainId)} className="mr-1 h-4 w-4" alt="explorer" />
              <a
                href={getExplorerLink(chainId, "address", indexAddr)}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {indexAddr}
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Index name</div>
            <div className=" w-fit max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap pl-0 xsm:w-full xsm:pl-7">
              {name === "" ? getIndexName(tokens) : name}
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-2 xsm:flex-row ">
            <div>Commission wallet</div>
            <div className="flex w-full max-w-[140px] items-center">
              <img src={getExplorerLogo(chainId)} className="mr-1 h-4 w-4" alt="explorer" />
              <a
                href={getExplorerLink(chainId, "address", commissionWallet ?? account)}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {commissionWallet ?? account}
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Commission fee</div>
            <div className="w-fit max-w-[140px] pl-0 xsm:w-full xsm:pl-7">{commissionFee.toFixed(2)}%</div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Visibility</div>
            <div className="w-fit max-w-[140px] pl-0 xsm:w-full xsm:pl-7">{visibleType ? "Public" : "Priveate"}</div>
          </div>
        </div>
      )}

      <div className="mb-5 mt-4 flex items-center justify-between text-[#FFFFFF80]">
        {step === 2 ? (
          <div className="text-sm font-semibold text-[#FFFFFF40]">
            <LoadingText text={"Waiting for deploy"} />
          </div>
        ) : step === 3 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">
            <LoadingText text={"Deploying smart contract"} />
          </div>
        ) : step === 4 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">Complete</div>
        ) : (
          ""
        )}
        <div className="flex items-center">
          <div className={step > 2 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
          <div className="h-[1px] w-5 bg-[#B9B8B8]" />
          <div className={step > 3 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
        </div>
      </div>

      <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" />
      <div className="mx-auto h-12 max-w-[500px]">
        {step === 2 ? (
          <StyledButton type="primary" onClick={handleDeploy} disabled={pending || !factory}>
            Deploy
          </StyledButton>
        ) : step === 4 ? (
          <StyledButton type="deployer" onClick={() => setOpen(false)}>
            Close window & Visit index
          </StyledButton>
        ) : (
          <StyledButton type="deployer">Do not close this window</StyledButton>
        )}
      </div>
    </div>
  );
};

export default Deploy;
