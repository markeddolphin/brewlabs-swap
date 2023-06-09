/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useSigner } from "wagmi";

import FarmFactoryAbi from "config/abi/farm/factory.json";
import FarmImplAbi from "config/abi/farm/farmImpl.json";

import { BLOCKS_PER_DAY } from "config/constants";
import { DashboardContext } from "contexts/DashboardContext";
import { useCurrency } from "hooks/Tokens";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useTokenApprove } from "hooks/useApprove";
import useTotalSupply from "hooks/useTotalSupply";
import { getExplorerLink, getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { useFarmFactories } from "state/deploy/hooks";
import { fetchFarmsPublicDataFromApiAsync } from "state/farms";
import { calculateGasMargin, isAddress } from "utils";
import { getContract } from "utils/contractHelpers";
import { getDexLogo, getExplorerLogo, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import { checkCircleSVG, InfoSVG, MinusSVG, PlusSVG, UploadSVG } from "components/dashboard/assets/svgs";
import DropDown from "components/dashboard/TokenList/Dropdown";
import StyledButton from "../../StyledButton";
import TokenSelect from "../TokenSelect";
import { useFarmFactory } from "./hooks";
import LoadingText from "@components/LoadingText";

const DURATIONS = [365, 180, 90, 60];

const Deploy = ({ setOpen, step, setStep, router, lpInfo }) => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveChainId();
  const { data: signer } = useSigner();

  const { pending, setPending, tokens }: any = useContext(DashboardContext);

  const factory = useFarmFactories(chainId);
  const { onCreate } = useFarmFactory(chainId, factory.payingToken.isNative ? factory.serviceFee : "0");
  const { onApprove } = useTokenApprove();

  const [duration, setDuration] = useState(0);
  const [rewardToken, setRewardToken] = useState(null);
  const [initialSupply, setInitialSupply] = useState(1);
  const [depositFee, setDepositFee] = useState(0);
  const [withdrawFee, setWithdrawFee] = useState(0);
  const [farmAddr, setFarmAddr] = useState("");

  const rewardCurrency: any = useCurrency(rewardToken?.address);
  const rewardTokenBalance = tokens.find((t) => t.address === rewardCurrency?.address.toLowerCase())?.balance ?? 0;

  let totalSupply: any = useTotalSupply(rewardCurrency);
  totalSupply = totalSupply ?? 0;
  const token0Address: any = lpInfo && isAddress(lpInfo.token0.address);
  const token1Address: any = lpInfo && isAddress(lpInfo.token1.address);

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleDeploy = async () => {
    if (initialSupply === 0) {
      toast.error("Should be set rewards");
      return;
    }
    if (rewardTokenBalance < (totalSupply.toFixed(2) * initialSupply) / 100) {
      toast.error("Insufficient reward token");
      return;
    }

    setStep(3);
    setPending(true);
    setFarmAddr("");

    try {
      let rewardPerBlock = ethers.utils.parseUnits(
        ((+totalSupply.toFixed(2) * initialSupply) / 100).toString(),
        rewardCurrency.decimals
      );
      rewardPerBlock = rewardPerBlock
        .div(ethers.BigNumber.from(DURATIONS[duration]))
        .div(ethers.BigNumber.from(BLOCKS_PER_DAY[chainId]));

      const hasDividend = false;
      const dividendToken = ethers.constants.AddressZero;

      // approve paying token for deployment
      if (factory.payingToken.isToken && +factory.serviceFee > 0) {
        await onApprove(factory.payingToken.address, factory.address);
      }

      // deploy farm contract
      const tx = await onCreate(
        lpInfo.address,
        rewardCurrency.address,
        dividendToken,
        rewardPerBlock.toString(),
        depositFee * 100,
        withdrawFee * 100,
        DURATIONS[duration],
        hasDividend
      );

      let farm = "";
      const iface = new ethers.utils.Interface(FarmFactoryAbi);
      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "FarmCreated") {
            farm = log.args.farm;
            setFarmAddr(log.args.farm);
            break;
          }
        } catch (e) {}
      }

      handleTransferRewards(farm);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(chainId));
      setStep(2);
    }
    setPending(false);
  };

  const handleTransferRewards = async (farm) => {
    setStep(4);
    setPending(true);

    try {
      const farmContract = getContract(chainId, farm, FarmImplAbi, signer);

      // approve reward token
      await onApprove(rewardCurrency.address, farm);

      // calls depositRewards method
      let amount = await farmContract.insufficientRewards();
      let gasLimit = await farmContract.estimateGas.depositRewards(amount);
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await farmContract.depositRewards(amount, { gasLimit });
      await tx.wait();

      handleStartFarming(farm);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(chainId));
    }
    setPending(false);
  };

  const handleStartFarming = async (farm) => {
    setStep(5);
    setPending(true);

    try {
      const farmContract = getContract(chainId, farm, FarmImplAbi, signer);

      // calls startRewards
      let gasLimit = await farmContract.estimateGas.startReward();
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await farmContract.startReward({ gasLimit });
      await tx.wait();

      setStep(6);
      dispatch(fetchFarmsPublicDataFromApiAsync());
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(chainId));
    }
    setPending(false);
  };

  const makePendingText = () => {
    return (
      <div className="flex w-28 items-center justify-between rounded-lg border border-[#FFFFFF80] bg-[#B9B8B81A] px-2 py-1 text-sm">
        <div className="text-[#FFFFFFBF]">{step === 2 ? "Pending" : step === 6 ? "Deployed" : "Deploying"}</div>
        {step === 6 ? (
          <div className="ml-3 scale-50 text-primary">{checkCircleSVG}</div>
        ) : (
          <div className="text-primary">{UploadSVG}</div>
        )}
      </div>
    );
  };

  return (
    <div className="font-roboto text-white">
      <div className="mt-4 flex items-center justify-between rounded-[30px] px-4 py-5 bg-[#1A1E28] primary-shadow">
        <div className="mx-auto flex items-center justify-between sm:mx-0">
          <img
            src={getDexLogo(router?.id)}
            alt={""}
            className="h-8 w-8 rounded-full shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
            onError={(e: any) => {
              e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
            }}
          />
          <div className="scale-50 text-primary">{checkCircleSVG}</div>
          <div className="flex items-center">
            <img
              src={getTokenLogoURL(token0Address, chainId)}
              alt={""}
              className="max-h-[32px] min-h-[32px] min-w-[32px] max-w-[32px] rounded-full"
              onError={(e: any) => {
                e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
              }}
            />

            <div className="-ml-2 mr-2">
              <img
                src={getTokenLogoURL(token1Address, chainId)}
                alt={""}
                className="max-h-[32px] min-h-[32px] min-w-[32px] max-w-[32px] rounded-full"
                onError={(e: any) => {
                  e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
                }}
              />
            </div>
            <div>
              {lpInfo?.token0?.symbol}-{lpInfo?.token1?.symbol} Yield farm
            </div>
          </div>
        </div>
        <div className="hidden sm:block">{makePendingText()}</div>
      </div>
      <div className=" mb-5 mt-3 flex w-full justify-end sm:hidden">{makePendingText()}</div>

      <div className="mt-4  text-sm font-semibold text-[#FFFFFF80]">
        <div className="ml-0 xs:ml-4">
          <div className="mb-1 text-white">*Please select the token reward for the yield farm</div>
          <TokenSelect selectedCurrency={rewardToken} setSelectedCurrency={setRewardToken} />
        </div>
        <div className="mb-6 mt-4 h-[1px] w-[calc(100%+18px)] bg-[#FFFFFF80]" />

        <div className="ml-0 mt-4 flex flex-col items-center justify-between xs:ml-4 xs:flex-row xs:items-start">
          <div>Total {rewardToken?.symbol} token supply</div>
          <div>{numberWithCommas(totalSupply.toFixed(2))}</div>
        </div>
        <div className="ml-0 mt-4 flex flex-col items-center justify-between xs:ml-4 xs:mt-1 xs:flex-row">
          <div>Yield farm duration</div>
          <div>
            <DropDown
              value={duration}
              setValue={setDuration}
              values={DURATIONS.map((d) => `${d} Days`)}
              width={"w-32"}
            />
          </div>
        </div>
        <div className="ml-0 mt-4 flex flex-col items-center justify-between xs:ml-4 xs:mt-1 xs:flex-row xs:items-start">
          <div>Reward supply for {DURATIONS[duration]} Days</div>
          <div className="flex items-center">
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setInitialSupply(Math.min(3, initialSupply + 0.1))}
            >
              {PlusSVG}
            </div>
            <div className="mx-2">{initialSupply.toFixed(2)}%</div>
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setInitialSupply(Math.max(0, initialSupply - 0.1))}
            >
              {MinusSVG}
            </div>
          </div>
        </div>
        <div className="ml-0 mt-4 flex flex-col items-center justify-between xs:ml-4 xs:mt-1 xs:flex-row xs:items-start">
          <div>Tokens required</div>
          <div>{numberWithCommas(((totalSupply.toFixed(2) * initialSupply) / 100).toFixed(2))}</div>
        </div>

        <div className="mt-4  flex flex-col items-center justify-between xs:mt-1 xs:flex-row xs:items-start">
          <div className="tooltip flex items-center" data-tip="Deposit fees are sent to deployer address.">
            <div className=" -mt-0.5 mr-1.5 scale-125 text-sm text-white">
              <InfoSVG />
            </div>
            <div>Deposit fee</div>
          </div>
          <div className="flex items-center">
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setDepositFee(Math.min(2, depositFee + 0.1))}
            >
              {PlusSVG}
            </div>
            <div className="mx-2">{depositFee.toFixed(2)}%</div>
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setDepositFee(Math.max(0, depositFee - 0.1))}
            >
              {MinusSVG}
            </div>
          </div>
        </div>
        <div className="mt-4  flex flex-col items-center justify-between xs:mt-1 xs:flex-row xs:items-start">
          <div className="tooltip flex items-center" data-tip="Withdraw fees are sent to deployer address.">
            <div className="-mt-0.5 mr-1.5 scale-125 text-white">
              <InfoSVG />
            </div>
            <div>Withdrawal fee</div>
          </div>
          <div className="flex items-center">
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setWithdrawFee(Math.min(2, withdrawFee + 0.1))}
            >
              {PlusSVG}
            </div>
            <div className="mx-2">{withdrawFee.toFixed(2)}%</div>
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setWithdrawFee(Math.max(0, withdrawFee - 0.1))}
            >
              {MinusSVG}
            </div>
          </div>
        </div>
        <div className="ml-0 mt-4 flex flex-col items-center justify-between text-[#FFFFFFBF] xs:ml-4 xs:mt-1 xs:flex-row xs:items-start">
          <div>Deployment fee</div>
          <div>
            {ethers.utils.formatUnits(factory.serviceFee, factory.payingToken.decimals).toString()}{" "}
            {factory.payingToken.symbol}
          </div>
        </div>
      </div>

      <div className="mb-5 mt-4 flex items-center justify-between text-[#FFFFFF80]">
        {step === 2 ? (
          <div className="text-sm font-semibold text-[#FFFFFF40]">Waiting for deploy...</div>
        ) : step === 3 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">
            <LoadingText text={"Deploying yield farm contract"} />
          </div>
        ) : step === 4 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">
            <LoadingText text={"Adding yield farm rewards"} />
          </div>
        ) : step === 5 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">
            <LoadingText text={"Starting yield farm"} />
          </div>
        ) : step === 6 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">Complete</div>
        ) : (
          ""
        )}
        <div className="flex items-center">
          <div className={step > 3 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
          <div className="h-[1px] w-5 bg-[#B9B8B8]" />
          <div className={step > 4 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
          <div className="h-[1px] w-5 bg-[#B9B8B8]" />
          <div className={step > 5 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
        </div>
      </div>

      {step === 6 ? (
        <div className="mb-5 rounded-[30px] border border-[#FFFFFF80] px-8 py-4 font-roboto text-sm font-semibold text-[#FFFFFF80]">
          <div className="text-[#FFFFFFBF]">Summary</div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-2 xsm:flex-row ">
            <div>Yield farm contract address</div>
            <div className="flex w-full max-w-[140px] items-center">
              <img src={getExplorerLogo(chainId)} className="mr-1 h-4 w-4" alt="explorer" />
              <a href={getExplorerLink(chainId, "address", farmAddr)} target="_blank" rel="noreferrer">
                {farmAddr.slice(0, 12)}....
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Liquidity token address</div>
            <div className="flex w-full  max-w-[140px] items-center">
              <img src={getExplorerLogo(chainId)} className="mr-1 h-4 w-4" alt="explorer" />
              <a href={getExplorerLink(chainId, "address", lpInfo.address)} target="_blank" rel="noreferrer">
                {lpInfo.address.slice(0, 12)}....
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Yield farm reward start</div>
            <div className=" w-full max-w-[140px] pl-7">After 100 blocks</div>
          </div>
        </div>
      ) : (
        ""
      )}

      {step !== 6 ? <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" /> : ""}
      <div className="mx-auto h-12 max-w-[500px]">
        {step === 2 ? (
          <StyledButton
            type="primary"
            onClick={handleDeploy}
            disabled={
              pending ||
              !rewardToken ||
              initialSupply === 0 ||
              rewardTokenBalance < (totalSupply.toFixed(2) * initialSupply) / 100
            }
          >
            {rewardTokenBalance < (totalSupply.toFixed(2) * initialSupply) / 100 ? `Insufficent rewards` : `Deploy`}
          </StyledButton>
        ) : step === 4 ? (
          <StyledButton
            type="primary"
            onClick={() => handleTransferRewards(farmAddr)}
            disabled={pending || !rewardToken || farmAddr === ""}
          >
            Transfer yield farm rewards
          </StyledButton>
        ) : step === 5 ? (
          <StyledButton
            type="primary"
            onClick={() => handleStartFarming(farmAddr)}
            disabled={pending || !rewardToken || farmAddr === ""}
          >
            Start yield farm
          </StyledButton>
        ) : step === 6 ? (
          <StyledButton type="deployer" onClick={() => setOpen(false)}>
            Close window
          </StyledButton>
        ) : (
          <StyledButton type="deployer">Do not close this window</StyledButton>
        )}
      </div>
    </div>
  );
};

export default Deploy;
