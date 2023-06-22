/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useMemo, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import StyledButton from "../../StyledButton";
import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import { Currency, NATIVE_CURRENCIES, WNATIVE } from "@brewlabs/sdk";
import { useActiveChainId } from "@hooks/useActiveChainId";
import useStakeFarms from "../hooks/useStakeFarms";
import { AppId, Chef } from "config/constants/types";
import { usePerformanceFee } from "../hooks/useStakeFarms";
import { useAccount } from "wagmi";
import { useAppDispatch } from "state";
import {
  fetchApeFarmUserDataAsync,
  fetchApeFarmsPublicDataAsync,
  fetchFarmUserDataAsync,
  fetchFarmsPublicDataAsync,
  fetchSushiFarmUserDataAsync,
  fetchSushiFarmsPublicDataAsync,
} from "state/zap";
import BigNumber from "bignumber.js";
import { useLpTokenPrices } from "state/lpPrices/hooks";
import { useBananaPrice, useFarmLpAprs, useLpTokenPrice } from "state/zap/hooks";
import { tryParseAmount } from "state/swap/hooks";
import { useTranslation } from "contexts/localization";
import { getFullDisplayBalance } from "utils/formatBalance";
import { useCurrencyBalance } from "state/wallet/hooks";
import { BIG_ONE, BIG_ZERO } from "utils/bigNumber";
import { toast } from "react-toastify";
import { ApprovalState, useApproveCallback } from "@hooks/useApproveCallback";
import { DashboardContext } from "contexts/DashboardContext";
import { getExternalMasterChefAddress } from "utils/addressHelpers";
import { useNativeTokenPrice } from "@hooks/useUsdPrice";
import useUnstakeFarms from "../hooks/useUnstakeFarms";
import Link from "next/link";
import { getNativeSybmol } from "lib/bridge/helpers";

const ZapInModal = ({ open, setOpen, data }: { open: boolean; setOpen: any; data: any }) => {
  const { chainId } = useActiveChainId();
  const [amount, setAmount] = useState("");
  const { lpAddress, pid, earningToken, chef, appId, token, quoteToken } = data;
  const [currency, setCurrency] = useState<Currency>(NATIVE_CURRENCIES[chainId]);

  const { address: account } = useAccount();
  const performanceFee = usePerformanceFee(data.chainId);
  const dispatch = useAppDispatch();
  const { lpTokenPrices } = useLpTokenPrices();
  const bananaPrice = useBananaPrice();
  const farmLpAprs = useFarmLpAprs();
  const parsedAmount = tryParseAmount(amount, currency);
  const masterChefAddress = getExternalMasterChefAddress(appId);
  const { t } = useTranslation();
  const { pending, setPending }: any = useContext(DashboardContext);

  const { onStake } = useStakeFarms(chef ?? Chef.MASTERCHEF, lpAddress, pid, earningToken.address, performanceFee);
  const { onUnstake } = useUnstakeFarms(chef ?? Chef.MASTERCHEF, pid, earningToken.address, performanceFee);

  const [approval, approveCallback] = useApproveCallback(parsedAmount, masterChefAddress);

  const ethPrice = useNativeTokenPrice();
  const lpPrice = useLpTokenPrice(data.lpSymbol, appId);
  const lpSymbol = data.lpSymbol.split(" ")[0];

  const tokensToStake = new BigNumber(amount !== "" ? amount : 0);
  const usdToStake = currency.isNative
    ? tokensToStake.multipliedBy(ethPrice?.toSignificant() ?? BIG_ONE)
    : tokensToStake;

  const lpTokensToStake = usdToStake.dividedBy(lpPrice ?? BIG_ONE);

  const currencyBalance = useCurrencyBalance(account, currency);
  const max = useMemo(
    () => (currencyBalance ? new BigNumber(currencyBalance.raw.toString()) : BIG_ZERO),
    [currencyBalance]
  );
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, currency?.decimals);
  }, [max, currency]);

  const fullBalanceNumber = new BigNumber(fullBalance);
  let inputError: string | undefined;
  if (!parsedAmount) {
    inputError = t("Enter an amount");
  }

  if (tokensToStake.gt(fullBalanceNumber)) {
    inputError = t("Insufficient %symbol% balance", { symbol: currency.symbol });
  }

  const handleStake = async (currency: Currency, amount: string) => {
    await onStake(currency, amount);

    if (appId === AppId.PANCAKESWAP) {
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
      dispatch(fetchFarmsPublicDataAsync([pid]));
    } else if (appId === AppId.APESWAP) {
      dispatch(fetchApeFarmUserDataAsync(chainId, account));
      dispatch(
        fetchApeFarmsPublicDataAsync(chainId, lpTokenPrices, new BigNumber(bananaPrice), farmLpAprs[AppId.APESWAP])
      );
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
                  <StyledButton type="secondary">
                    <div className="flex items-center text-[#FFFFFFBF]">
                      Zap<span className="mx-1 text-primary">{lpSymbol}</span> LP
                    </div>
                  </StyledButton>
                </div>
                <Link
                  className="flex-1"
                  href={`/add/${data.chainId}/${
                    quoteToken.isNative || quoteToken.symbol === WNATIVE[data.chainId].symbol
                      ? getNativeSybmol(data.chainId)
                      : quoteToken.address
                  }/${
                    token.isNative || token.symbol === WNATIVE[data.chainId].symbol
                      ? getNativeSybmol(data.chainId)
                      : token.address
                  }`}
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <StyledButton type="secondary">
                    <div className="text-[#FFFFFF59] hover:text-white">Classic {lpSymbol} LP</div>
                  </StyledButton>
                </Link>
              </div>
              <div className="mt-[30px]">
                <StyledInput
                  placeholder={`Enter amount ${currency.symbol}...`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="mt-1 text-right text-sm">
                <div>
                  My <span className="text-primary">{getNativeSybmol(chainId)}</span> :{" "}
                  {currencyBalance ? currencyBalance.toFixed(2) : "0.00"}
                </div>
                <div>
                  $
                  {currencyBalance && ethPrice
                    ? (+currencyBalance?.toFixed(8) * +ethPrice?.toSignificant()).toFixed(2)
                    : "0.00"}{" "}
                  USD
                </div>
              </div>

              <div className="mt-2.5 flex justify-between rounded border border-[#FFFFFF] bg-[#B9B8B81A] px-5 py-2.5 text-[#FFFFFF59]">
                <div>Zap output</div>
                <div>
                  {lpTokensToStake.toFixed(2)} {lpSymbol} LP
                </div>
              </div>

              <div className="my-[25px] h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto flex w-full max-w-[400px] flex-col items-end text-sm">
                <div className="h-12 w-full">
                  {inputError ? (
                    <StyledButton disabled>{t(inputError)}</StyledButton>
                  ) : approval <= ApprovalState.PENDING ? (
                    <StyledButton onClick={approveCallback}>
                      {approval === ApprovalState.PENDING ? t("Approving") : t("Approve")}
                    </StyledButton>
                  ) : (
                    <StyledButton
                      disabled={pending}
                      onClick={async () => {
                        setPending(true);
                        try {
                          await handleStake(currency, amount);
                          toast.success(t("Your funds have been staked in the farm"));
                        } catch (e: any) {
                          toast.error(e.message.split("(")[0]);
                          console.error(e);
                        } finally {
                          setPending(false);
                        }
                      }}
                    >
                      {pending ? t("Confirming") : t("Zap")} {lpSymbol}
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
export default ZapInModal;
