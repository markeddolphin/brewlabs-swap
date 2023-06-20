/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { WNATIVE } from "@brewlabs/sdk";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { chevronLeftSVG } from "components/dashboard/assets/svgs";

import { Version } from "config/constants/types";
import { DashboardContext } from "contexts/DashboardContext";
import { getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import useTokenPrice from "hooks/useTokenPrice";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/farms";
import { numberWithCommas } from "utils/functions";

import StyledButton from "../../StyledButton";
import useApproveFarm from "../hooks/useApprove";
import useFarm from "../hooks/useFarm";
import { getBalanceAmount } from "utils/formatBalance";
import useFarmImpl from "../hooks/useFarmImpl";

const StakingModal = ({
  open,
  setOpen,
  type,
  data,
  accountData,
}: {
  open: boolean;
  setOpen: any;
  type: string;
  data: any;
  accountData: any;
}) => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  const { pending, setPending }: any = useContext(DashboardContext);
  const lpPrice = useTokenPrice(data.chainId, data.lpAddress, true);

  const [amount, setAmount] = useState("");
  const [insufficient, setInsufficient] = useState(false);
  const [maxPressed, setMaxPressed] = useState(false);

  const { onApprove } = useApproveFarm(data.lpAddress, data.pid, data.contractAddress);
  const { onStake, onUnstake } = useFarm(
    data.poolId,
    data.farmId,
    data.chainId,
    data.contractAddress,
    data.version >= Version.V2 && data.performanceFee ? data.performanceFee : "0",
    data.enableEmergencyWithdraw
  );
  const { onStake: onStakeImpl, onUnstake: onUnstakeImpl } = useFarmImpl(
    data.poolId,
    data.farmId,
    data.chainId,
    data.contractAddress,
    data.version >= Version.V2 && data.performanceFee ? data.performanceFee : "0",
    data.enableEmergencyWithdraw
  );

  const balance: any = getBalanceAmount(
    type === "deposit" ? accountData.tokenBalance : accountData.stakedBalance
  ).toString();

  useEffect(() => {
    if (Number(amount) > +balance && !maxPressed) setInsufficient(true);
    else setInsufficient(false);
  }, [amount, maxPressed]);

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleApprove = async () => {
    setPending(true);
    try {
      await onApprove();
      dispatch(fetchFarmUserDataAsync({ account: address, chainId: data.chainId, pids: [data.pid] }));
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const handleConfirm = async () => {
    setPending(true);
    try {
      if (data.category) {
        if (type === "deposit") {
          await onStakeImpl(amount);
        } else {
          await onUnstakeImpl(amount);
        }
      } else {
        if (type === "deposit") {
          await onStake(amount);
        } else {
          await onUnstake(amount);
        }
      }

      dispatch(fetchFarmUserDataAsync({ account: address, chainId: data.chainId, pids: [data.pid] }));
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog
        open={open}
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
        onClose={() => {}}
      >
        <div className="flex min-h-full items-center justify-center p-4 ">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: "easeOut",
                duration: 0.15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
            transition={{ duration: 0.25 }}
          >
            <StyledPanel>
              <div className="border-b border-b-[#FFFFFF80] pb-2 text-xl text-[#FFFFFFBF]">
                {type === "deposit" ? "Deposit" : "Withdraw"} Amount
              </div>
              <div className="mx-auto mt-5 flex h-12 w-full max-w-[470px]">
                <div className="mr-2 flex-1">
                  <StyledButton type="secondary" onClick={() => setOpen(false)}>
                    <div className="flex items-center text-[#FFFFFFBF]">
                      {chevronLeftSVG}
                      <div className="ml-2">Back to pool info</div>
                    </div>
                  </StyledButton>
                </div>
                <a
                  className="flex-1"
                  href={`/add/${data.chainId}/${
                    data.quoteToken.isNative || data.quoteToken.symbol === WNATIVE[data.chainId].symbol
                      ? getNativeSybmol(data.chainId)
                      : data.quoteToken.address
                  }/${
                    data.token.isNative || data.token.symbol === WNATIVE[data.chainId].symbol
                      ? getNativeSybmol(data.chainId)
                      : data.token.address
                  }`}
                >
                  <a target="_blank" className="flex-1">
                    <StyledButton type="secondary">
                      <div className="flex items-center text-[#FFFFFFBF]">
                        <div>
                          Get <span className="text-primary">{data.lpSymbol}</span>
                        </div>
                        <div className="ml-2 -scale-100">{chevronLeftSVG}</div>
                      </div>
                    </StyledButton>
                  </a>
                </a>
              </div>
              <div className="mt-[30px]">
                <StyledInput
                  placeholder={`Enter amount ${data.lpSymbol}...`}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setMaxPressed(false);
                  }}
                />
              </div>
              <div className="mt-1 flex w-full flex-col items-end text-sm">
                <div className="text-[#FFFFFFBF]">
                  {type === "deposit" ? "My" : "Staked"} <span className="text-primary">{data.lpSymbol}</span>:{" "}
                  {numberWithCommas(+(balance ? +balance : 0).toFixed(5))}
                </div>
                <div className="text-[#FFFFFF80]">${(lpPrice && balance ? lpPrice * +balance : 0).toFixed(2)} USD</div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[400px]">
                <div className="h-12">
                  <StyledButton
                    type="secondary"
                    onClick={() => {
                      setMaxPressed(true);
                      setAmount(balance);
                    }}
                  >
                    <div className="text-[#FFFFFFBF]">
                      Select maximum <span className="text-primary">{data.lpSymbol}</span>
                    </div>
                  </StyledButton>
                </div>
                <div className="mt-3 h-12">
                  {+accountData.allowance.toString() >
                  +ethers.utils.parseEther(amount && amount !== "" ? amount : "0") ? (
                    <StyledButton type="primary" disabled={!amount || insufficient || pending} onClick={handleConfirm}>
                      {insufficient ? "Insufficient" : type === "deposit" ? "Deposit" : "Withdraw"} {data.lpSymbol}
                    </StyledButton>
                  ) : (
                    <StyledButton type="primary" onClick={handleApprove} disabled={pending}>
                      Approve&nbsp;
                      {data.lpSymbol}
                    </StyledButton>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute -right-2 -top-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
              </button>
            </StyledPanel>
          </motion.div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
};

const StyledPanel = styled.div`
  position: relative;
  width: calc(100vw - 24px);
  max-width: 600px;
  border-radius: 8px;
  background: #1b212d;
  padding: 40px 50px;
  @media screen and (max-width: 450px) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;
const StyledInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 16px 14px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(238, 187, 25, 0.75);
  box-shadow: 0px 1px 1px rgba(238, 187, 25, 0.75);
  border-radius: 6px;
  color: #eebb19;
  outline: none;
`;
export default StakingModal;
