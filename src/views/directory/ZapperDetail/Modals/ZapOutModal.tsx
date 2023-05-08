/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useMemo, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import StyledButton from "../../StyledButton";
import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import { AppId } from "config/constants/types";
import {
  fetchApeFarmUserDataAsync,
  fetchApeFarmsPublicDataAsync,
  fetchFarmUserDataAsync,
  fetchFarmsPublicDataAsync,
  fetchSushiFarmUserDataAsync,
  fetchSushiFarmsPublicDataAsync,
} from "state/zap";
import BigNumber from "bignumber.js";
import { useTranslation } from "contexts/localization";
import { getFullDisplayBalance } from "utils/formatBalance";
import { toast } from "react-toastify";
import { useBananaPrice, useFarmLpAprs, useFarmUser } from "state/zap/hooks";
import useUnstakeFarms from "../hooks/useUnstakeFarms";
import { usePerformanceFee } from "../hooks/useStakeFarms";
import { useAccount } from "wagmi";
import { useAppDispatch } from "state";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useLpTokenPrices } from "state/lpPrices/hooks";
import { DashboardContext } from "contexts/DashboardContext";

const ZapOutModal = ({ open, setOpen, data }: { open: boolean; setOpen: any; data: any }) => {
  const { lpAddress, pid, earningToken, chef, appId } = data;

  const [val, setVal] = useState("");
  const [pendingTx, setPendingTx] = useState(false);
  const { t } = useTranslation();
  const { stakedBalance } = useFarmUser(pid, appId);
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(stakedBalance);
  }, [stakedBalance]);

  const valNumber = new BigNumber(val);
  const fullBalanceNumber = new BigNumber(fullBalance);

  const { pending, setPending }: any = useContext(DashboardContext);
  const { chainId } = useActiveChainId();
  const dispatch = useAppDispatch();
  const { address: account } = useAccount();
  const performanceFee = usePerformanceFee(data.chainId);
  const { onUnstake } = useUnstakeFarms(chef, pid, earningToken.address, performanceFee);
  const { lpTokenPrices } = useLpTokenPrices();
  const bananaPrice = useBananaPrice();
  const farmLpAprs = useFarmLpAprs();
  const lpSymbol = data.lpSymbol.split(" ")[0]

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, "."));
      }
    },
    [setVal]
  );

  // const handleSelectMax = useCallback(() => {
  //   setVal(fullBalance);
  // }, [fullBalance, setVal]);

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount);

    if (appId === AppId.PANCAKESWAP) {
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
      dispatch(fetchFarmsPublicDataAsync([pid]));
    } else if (appId === AppId.APESWAP) {
      dispatch(fetchApeFarmUserDataAsync(chainId, account));
      dispatch(fetchApeFarmsPublicDataAsync(chainId, lpTokenPrices, new BigNumber(bananaPrice), farmLpAprs));
    } else if (appId === AppId.SUSHISWAP) {
      dispatch(fetchSushiFarmUserDataAsync(account));
      dispatch(fetchSushiFarmsPublicDataAsync(chainId));
    }
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
                <div className="h-8 w-[120px]">
                  <StyledButton
                    type="secondary"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center text-[#FFFFFF80]">
                      {chevronLeftSVG}
                      <div className="ml-2">Back a Page</div>
                    </div>
                  </StyledButton>
                </div>
              </div>
              <div className="border-b border-b-[#FFFFFF80] pb-2 text-xl text-[#FFFFFFBF]">
                Get <span className="text-primary">{lpSymbol}</span> LP
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
                  <StyledButton type="secondary">
                    Zap out all &nbsp;<span className="text-primary">CAKE-BNB LP</span>
                  </StyledButton>
                </div>
              </div>
              <div className="mt-[30px]">
                <StyledInput placeholder={`Enter amount ${lpSymbol}...`} value={val} onChange={handleChange} />
              </div>

              <div className="mt-1 text-right text-sm">
                <div>
                  Staked <span className="text-primary">{lpSymbol}</span> :{" "}
                  {stakedBalance ? stakedBalance.toFixed(2) : "0.00"}
                </div>
                <div>$4,531.00 USD</div>
              </div>

              <div className="my-[25px] h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto flex w-full max-w-[400px] flex-col items-end text-sm">
                <div className="h-12 w-full">
                  <StyledButton
                    disabled={pending || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
                    onClick={async () => {
                      setPending(true);
                      try {
                        await handleUnstake(val);
                        toast.success(t("Your earnings have also been harvested to your wallet"));
                      } catch (e: any) {
                        toast.error(e.message.split("(")[0]);
                        console.error(e);
                      } finally {
                        setPending(false);
                      }
                    }}
                  >
                    {pending ? t("Confirming") : t("Confirm")}
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
export default ZapOutModal;
