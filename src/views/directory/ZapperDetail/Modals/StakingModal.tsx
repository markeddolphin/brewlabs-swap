/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import StyledButton from "../../StyledButton";
import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import { makeBigNumber, numberWithCommas } from "utils/functions";
import { DashboardContext } from "contexts/DashboardContext";
import { getBep20Contract, getUnLockStakingContract } from "utils/contractHelpers";
import { useAccount, useSigner } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";
import { ethers } from "ethers";
import GetLPModal from "./ZapInModal";
import { useCurrencyBalance } from "state/wallet/hooks";
import { useCurrency } from "@hooks/Tokens";

const StakingModal = ({ open, setOpen, type, data }: { open: boolean; setOpen: any; type: string; data: any }) => {
  const { pending, setPending }: any = useContext(DashboardContext);
  const { data: signer }: any = useSigner();
  const { chainId } = useActiveChainId();
  const { address: account } = useAccount();

  const [amount, setAmount] = useState("");
  const [insufficient, setInsufficient] = useState(false);
  const [maxPressed, setMaxPressed] = useState(false);

  const [getOpen, setGetOpen] = useState(false);

  const lpCurrency = useCurrency(data.lpAddress);
  const balance: any = useCurrencyBalance(account, lpCurrency);

  useEffect(() => {
    if (Number(amount) > balance && !maxPressed) setInsufficient(true);
    else setInsufficient(false);
  }, [amount, maxPressed]);

  const onApprove = async () => {
    setPending(true);
    try {
      const tokenContract = getBep20Contract(chainId, data.stakingToken.address, signer);
      const estimateGas = await tokenContract.estimateGas.approve(data.address, ethers.constants.MaxUint256);
      const tx = {
        gasLimit: estimateGas.toString(),
      };
      const approvetx = await tokenContract.approve(data.address, ethers.constants.MaxUint256, tx);
      await approvetx.wait();
    } catch (error) {
      console.log(error);
    }
    setPending(false);
  };

  const onConfirm = async () => {
    setPending(true);

    setPending(false);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {/* <GetLPModal open={getOpen} setOpen={setGetOpen} setStakingOpen={setOpen} /> */}
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
                {type === "zapin" ? "Deposit" : "Zap Out"} Amount
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
                <div className="flex-1">
                  {type === "zapin" ? (
                    <StyledButton
                      type="secondary"
                      onClick={() => {
                        setGetOpen(true);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center text-[#FFFFFFBF]">
                        <div>
                          Get <span className="text-primary">{data.stakingToken.symbol}</span>
                        </div>
                        <div className="ml-2 -scale-100">{chevronLeftSVG}</div>
                      </div>
                    </StyledButton>
                  ) : (
                    <StyledButton type="secondary">
                      Zap out all &nbsp;<span className="text-primary">CAKE-BNB LP</span>
                    </StyledButton>
                  )}
                </div>
              </div>
              {type !== "zapin" ? (
                <div className="mx-auto w-full max-w-[470px]">
                  <div className="mt-1 flex w-full justify-end text-sm">
                    Approx&nbsp;<span className="text-primary">BNB</span>: 45.00
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="mt-6">
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
                  {type === "zapin" ? "My" : "Staked"} <span className="text-primary">{data.stakingToken.symbol}</span>:{" "}
                  {numberWithCommas((balance ? balance : 0).toFixed(2))}
                </div>
                <div className="text-[#FFFFFF80]">
                  ${(data.price && balance ? data.price * balance : 0).toFixed(2)} USD
                </div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[400px]">
                {type === "zapin" ? (
                  <div className="h-12">
                    <StyledButton
                      type="secondary"
                      onClick={() => {
                        setMaxPressed(true);
                        setAmount(balance);
                      }}
                    >
                      <div className="text-[#FFFFFFBF]">
                        Select maximum <span className="text-primary">{data.stakingToken.symbol}</span>
                      </div>
                    </StyledButton>
                  </div>
                ) : (
                  ""
                )}
                <div className="mt-3 h-12">
                  <StyledButton type="primary" onClick={() => onApprove()} disabled={pending}>
                    {type === "zapin" ? "Deposit" : "Zap out"} CAKE-BNB LP
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
