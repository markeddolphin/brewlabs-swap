/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import { SkeletonComponent } from "components/SkeletonComponent";

import { PoolCategory } from "config/constants/types";
import { DashboardContext } from "contexts/DashboardContext";
import useTokenPrice from "hooks/useTokenPrice";
import { getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { BIG_ZERO } from "utils/bigNumber";
import { formatAmount } from "utils/formatApy";
import { getBalanceNumber } from "utils/formatBalance";
import { numberWithCommas } from "utils/functions";

import StyledButton from "../../StyledButton";
import useLockupPool from "../hooks/useLockupPool";
import useUnlockupPool from "../hooks/useUnlockupPool";

const EmergencyModal = ({ open, setOpen, data }: { open: boolean; setOpen: any; data: any }) => {
  const { pending, setPending }: any = useContext(DashboardContext);
  const { userData: accountData, earningToken, stakingToken, reflectionTokens } = data;

  const isLockup = data.poolCategory === PoolCategory.LOCKUP;
  const tokenPrice = useTokenPrice(data.chainId, data.stakingToken.address);

  const { onReward: onRewardLockup, onDividend: onDividendLockup } = useLockupPool(
    data.sousId,
    data.contractAddress,
    data.lockup,
    data.performanceFee
  );
  const { onReward, onDividend } = useUnlockupPool(data.sousId, data.contractAddress, data.performanceFee);

  const { onUnStake: onUnStakeLockup } = useLockupPool(
    data.sousId,
    data.contractAddress,
    data.lockup,
    data.version ? data.performanceFee : "0",
    data.enableEmergencyWithdraw
  );
  const { onUnstake } = useUnlockupPool(
    data.sousId,
    data.contractAddress,
    data.version ? data.performanceFee : "0",
    data.enableEmergencyWithdraw
  );

  let hasReflections = false;
  const reflectionTokenBalances = [];
  for (let i = 0; i < reflectionTokens.length; i++) {
    reflectionTokenBalances.push(
      getBalanceNumber(accountData.reflections[i] ?? BIG_ZERO, reflectionTokens[i].decimals)
    );
    if (accountData.reflections[i]?.gt(0)) hasReflections = true;
  }
  const earningTokenBalance = getBalanceNumber(accountData.earnings ?? BIG_ZERO, earningToken.decimals);
  const stakedBalance = getBalanceNumber(accountData.stakedBalance ?? BIG_ZERO, stakingToken.decimals);

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleConfirm = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onUnStakeLockup(stakedBalance, stakingToken.decimals);
      } else {
        await onUnstake(stakedBalance.toString(), stakingToken.decimals);
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onHarvestReward = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onRewardLockup();
      } else {
        await onReward();
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onHarvestReflection = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onDividendLockup();
      } else {
        await onDividend();
      }
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
              <div className="flex w-full justify-end">
                <div className="h-9 w-full max-w-[180px]">
                  <StyledButton type="secondary" onClick={() => setOpen(false)}>
                    <div className="flex items-center text-[#FFFFFFBF]">
                      {chevronLeftSVG}
                      <div className="ml-2">Back to pool info</div>
                    </div>
                  </StyledButton>
                </div>
              </div>
              <div className="-mt-5 border-b border-b-[#FFFFFF80] pb-2 text-xl text-[#FFFFFFBF]">Withdraw Amount</div>
              <div className="mt-[30px]">
                <StyledInput
                  placeholder={`Enter amount ${stakingToken.symbol}...`}
                  value={stakedBalance ?? "0"}
                  readOnly
                />
              </div>
              <div className="mt-1 flex w-full flex-col items-end text-sm">
                <div className="text-[#FFFFFFBF]">
                  Staked&nbsp;
                  <span className="text-primary">{stakingToken.symbol}</span>{" "}
                  {numberWithCommas(stakedBalance.toFixed(2))}
                </div>
                <div className="text-[#FFFFFF80]">
                  ${numberWithCommas(tokenPrice ? (tokenPrice * stakedBalance).toFixed(2) : "0.00")}
                </div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[400px]">
                {data.reflection && (
                  <div className="h-12">
                    <StyledButton
                      type={"secondary"}
                      onClick={onHarvestReflection}
                      disabled={pending || !hasReflections || (data.enableEmergencyWithdraw && data.disableHarvest)}
                    >
                      <div className="flex text-[#FFFFFFBF]">
                        Step 1 : Harvest{" "}
                        {reflectionTokens.length === 1 &&
                          (data.enableEmergencyWithdraw && data.disableHarvest ? (
                            "0.00"
                          ) : accountData.reflections[0] ? (
                            formatAmount(reflectionTokenBalances[0].toFixed(4))
                          ) : (
                            <SkeletonComponent />
                          ))}
                        <span className="ml-1 text-brand">
                          {reflectionTokens.length === 1 ? reflectionTokens[0].symbol : "Reflections"}
                        </span>
                      </div>
                    </StyledButton>
                  </div>
                )}
                <div className="mt-3" />
                <div className="h-12">
                  <StyledButton
                    type={"secondary"}
                    onClick={onHarvestReward}
                    disabled={
                      pending || earningTokenBalance === 0 || (data.enableEmergencyWithdraw && data.disableHarvest)
                    }
                  >
                    <div className="text-[#FFFFFFBF]">
                      Step {data.reflection ? 2 : 1} : Harvest{" "}
                      {data.enableEmergencyWithdraw && data.disableHarvest ? (
                        "0.00"
                      ) : accountData.earnings !== undefined ? (
                        formatAmount(earningTokenBalance.toFixed(2))
                      ) : (
                        <SkeletonComponent />
                      )}
                      <span className="ml-1 text-brand">{stakingToken.symbol}</span>
                    </div>
                  </StyledButton>
                </div>
                <div className="mt-3" />
                <div className="h-12">
                  <StyledButton type={"danger"} onClick={handleConfirm} disabled={pending || stakedBalance === 0}>
                    Step {data.reflection ? 3 : 2} : Emergency withdraw {stakingToken.symbol}
                  </StyledButton>
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
  padding: 30px 50px 40px 50px;
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
  border-radius: 6px;
  color: #eebb19;
  outline: none;
`;
export default EmergencyModal;
