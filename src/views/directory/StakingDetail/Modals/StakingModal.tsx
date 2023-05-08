/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { PoolCategory } from "config/constants/types";
import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import { DashboardContext } from "contexts/DashboardContext";
import useTokenPrice from "hooks/useTokenPrice";
import { getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { getFullDisplayBalance } from "utils/formatBalance";

import StyledButton from "../../StyledButton";
import useApprovePool from "../hooks/useApprove";
import useLockupPool from "../hooks/useLockupPool";
import useUnlockupPool from "../hooks/useUnlockupPool";

const StakingModal = ({
  open,
  setOpen,
  type,
  data,
  defaultAmount,
}: {
  open: boolean;
  setOpen: any;
  type: string;
  data: any;
  defaultAmount?: string;
}) => {
  const { pending, setPending }: any = useContext(DashboardContext);
  const { userData: accountData } = data;
  const tokenPrice = useTokenPrice(data.chainId, data.stakingToken.address);

  const [amount, setAmount] = useState("");
  const [insufficient, setInsufficient] = useState(false);
  const [maxPressed, setMaxPressed] = useState(false);

  const isLockup = data.poolCategory === PoolCategory.LOCKUP;
  const { onApprove } = useApprovePool(data.stakingToken.address, data.sousId, data.contractAddress);
  const { onStake: onStakeLockup, onUnStake: onUnStakeLockup } = useLockupPool(
    data.sousId,
    data.contractAddress,
    data.lockup,
    data.version ? data.performanceFee : "0",
    data.enableEmergencyWithdraw
  );
  const { onStake, onUnstake } = useUnlockupPool(
    data.sousId,
    data.contractAddress,
    data.version ? data.performanceFee : "0",
    data.enableEmergencyWithdraw
  );

  useEffect(() => {
    if (defaultAmount && +defaultAmount > 0) {
      setAmount(defaultAmount);
    }
  }, [defaultAmount]);

  const getCalculatedStakingLimit = () => {
    let balance;
    if (!accountData) return "0";

    if (type !== "deposit") {
      if (data.enableEmergencyWithdraw || data.penaltyFee) {
        balance = accountData.stakedBalance;
      } else {
        balance = accountData.stakedBalance.minus(accountData.lockedBalance);
      }
    } else {
      balance =
        data.stakingLimit.gt(0) && accountData.stakingTokenBalance.gt(data.stakingLimit)
          ? accountData.stakingLimit
          : accountData.stakingTokenBalance;
    }
    return getFullDisplayBalance(balance, data.stakingToken.decimals);
  };
  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  useEffect(() => {
    if (Number(amount) > +getCalculatedStakingLimit() && !maxPressed) setInsufficient(true);
    else setInsufficient(false);
  }, [amount, maxPressed]);

  const handleApprove = async () => {
    setPending(true);
    try {
      await onApprove();
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const handleConfirm = async () => {
    setPending(true);
    try {
      if (type === "deposit") {
        if (isLockup) {
          await onStakeLockup(amount, data.stakingToken.decimals);
        } else {
          await onStake(amount, data.stakingToken.decimals);
        }
      } else {
        if (isLockup) {
          await onUnStakeLockup(amount, data.stakingToken.decimals);
        } else {
          await onUnstake(amount, data.stakingToken.decimals);
        }
      }
      setAmount("0");
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
        onClose={() => setOpen(false)}
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
                  href={`https://bridge.brewlabs.info/swap?outputCurrency=${data.stakingToken.address}`}
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <StyledButton type="secondary">
                    <div className="flex items-center text-[#FFFFFFBF]">
                      <div>
                        Get <span className="text-primary">{data.stakingToken.symbol}</span>
                      </div>
                      <div className="ml-2 -scale-100">{chevronLeftSVG}</div>
                    </div>
                  </StyledButton>
                </a>
              </div>
              <div className="mt-[30px]">
                <StyledInput
                  placeholder={`Enter amount ${data.stakingToken.symbol}...`}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setMaxPressed(false);
                  }}
                />
              </div>
              <div className="mt-1 flex w-full flex-col items-end text-sm">
                <div className="text-[#FFFFFFBF]">
                  {type === "deposit" ? "My" : "Staked"}{" "}
                  <span className="text-primary">{data.stakingToken.symbol}</span>: {getCalculatedStakingLimit()}
                </div>
                <div className="text-[#FFFFFF80]">
                  $
                  {(tokenPrice && +getCalculatedStakingLimit() ? tokenPrice * +getCalculatedStakingLimit() : 0).toFixed(
                    2
                  )}
                </div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[400px]">
                <div className="h-12">
                  <StyledButton
                    type="secondary"
                    onClick={() => {
                      setMaxPressed(true);
                      setAmount(getCalculatedStakingLimit());
                    }}
                  >
                    <div className="text-[#FFFFFFBF]">
                      Select maximum <span className="text-primary">{data.stakingToken.symbol}</span>
                    </div>
                  </StyledButton>
                </div>
                <div className="mt-3 h-12">
                  {accountData?.allowance?.gt(1000) ? (
                    <StyledButton
                      type="primary"
                      disabled={!amount || insufficient || pending}
                      onClick={() => handleConfirm()}
                    >
                      {insufficient ? "Insufficient" : type === "deposit" ? "Deposit" : "Withdraw"}{" "}
                      {data.stakingToken.symbol}
                    </StyledButton>
                  ) : (
                    <StyledButton type="primary" onClick={() => handleApprove()} disabled={pending}>
                      Approve&nbsp;
                      {data.stakingToken.symbol}
                    </StyledButton>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-2 -right-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
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
