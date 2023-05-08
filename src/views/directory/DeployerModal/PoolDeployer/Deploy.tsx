/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import StyledButton from "../../StyledButton";
import ChainSelect from "views/swap/components/ChainSelect";
import { useEffect, useState } from "react";
import { checkCircleSVG, InfoSVG, MinusSVG, PlusSVG, UploadSVG } from "components/dashboard/assets/svgs";
import DropDown from "./Dropdown";
import SwitchButton from "./SwitchButton";

const Deploy = ({ step, setStep, setOpen }) => {
  const [contractAddress, setContractAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState(null);
  const [withdrawFee, setWithdrawFee] = useState(1);
  const [depositFee, setDepositFee] = useState(1);
  const [initialSupply, setInitialSupply] = useState(1);
  const [stakingDuration, setStakingDuration] = useState(12);
  const [lockUpPeriod, setLockupPeriod] = useState(0);
  const [rewardType, setRewardType] = useState(0);

  useEffect(() => {
    if (contractAddress.length) setTokenAddress("0x330518cc95c92881bCaC1526185a514283A5584D");
    else setTokenAddress(null);
  }, [contractAddress]);

  useEffect(() => {
    if (step === 3) {
      setTimeout(() => {
        setStep(4);
      }, 5000);
    }
  }, [step]);

  const makePendingText = () => {
    return (
      <div className="flex w-28 items-center justify-between rounded-lg border border-[#FFFFFF80] bg-[#B9B8B81A] px-2 py-1 text-sm">
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
      <div className="mt-4 flex items-center justify-between rounded-[30px] border border-primary px-4 py-3">
        <div className="mx-auto flex w-full max-w-[280px] items-center justify-between sm:mx-0">
          <CircleImage className="h-8 w-8" />
          <div className="scale-50 text-primary">{checkCircleSVG}</div>
          <div className="flex items-center">
            <CircleImage className="h-8 w-8" />

            <div className="ml-4">TICKER Staking Pool</div>
          </div>
        </div>
        <div className="hidden sm:block">{makePendingText()}</div>
      </div>
      <div className=" mb-5 mt-3 flex w-full justify-end sm:hidden">{makePendingText()}</div>

      <div className="mt-4  text-sm font-semibold text-[#FFFFFF80]">
        <div className="ml-4 flex flex-col items-center justify-between xs:flex-row xs:items-start">
          <div>Total BREWLABS token supply</div>
          <div>1,000,000,000.00</div>
        </div>
        <div className="ml-4 mt-4 flex flex-col items-center justify-between xs:mt-1 xs:flex-row xs:items-start">
          <div>Stakig pool duration</div>
          <div className="flex items-center">
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setStakingDuration(Math.min(12, stakingDuration + 1))}
            >
              {PlusSVG}
            </div>
            <div className="mx-2">{stakingDuration} Months</div>
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setStakingDuration(Math.max(1, stakingDuration - 1))}
            >
              {MinusSVG}
            </div>
          </div>
        </div>
        <div className="ml-4 mt-4 flex flex-col items-center justify-between xs:mt-1 xs:flex-row xs:items-start">
          <div>Initial reward supply for 12 months</div>
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
        <div className="ml-4 mt-4 flex flex-col items-center justify-between xs:mt-1 xs:flex-row xs:items-start">
          <div>Tokens required</div>
          <div>10,000,000.00</div>
        </div>
        <div className="mt-4  flex flex-col items-center justify-between xs:mt-1 xs:flex-row xs:items-start">
          <div className="flex items-center">
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
        <div className="mt-4  flex flex-col items-center justify-between xs:mt-1 xs:flex-row xs:items-start">
          <div className="flex items-center">
            <div className="-mt-0.5 mr-1.5 scale-125 text-white">
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
        <div className="mt-4 flex flex-col items-center justify-between xs:mt-1 xs:flex-row">
          <div className="flex items-center">
            <div className="-mt-0.5 mr-1.5 scale-125 text-white">
              <InfoSVG />
            </div>
            <div>Lockup Period</div>
          </div>
          <div className="w-[100px]">
            <DropDown
              data={["Flexible", "30 days", "60 days", "90 days"]}
              value={lockUpPeriod}
              setValue={setLockupPeriod}
            />
          </div>
        </div>

        <div className="ml-4 mt-6 flex flex-col items-center justify-between xs:mt-1 xs:flex-row ">
          <div>Reflections/Rewards</div>
          <SwitchButton value={rewardType} setValue={setRewardType} />
        </div>

        <div className="ml-4 mt-6 xs:mt-1">
          <div>Reflection/Reward Token</div>
          <div className="font-questrial mt-2 flex w-full items-center justify-between rounded-xl border border-white bg-[#FFFFFF0D] px-3 py-1.5 font-normal text-white">
            <div>0x330518cc95c92881bCaC1526185a514283A5584D</div>
            <CircleImage className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mb-5 mt-4 flex items-center justify-between text-[#FFFFFF80]">
        {step === 2 ? (
          <div className="text-sm font-semibold text-[#FFFFFF40]">Waiting for deploy...</div>
        ) : step === 3 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">Deploying smart contract...</div>
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

      {step === 4 ? (
        <div className="mb-5 rounded-[30px] border border-[#FFFFFF80] px-8 py-4 font-roboto text-sm font-semibold text-[#FFFFFF80]">
          <div className="text-[#FFFFFFBF]">Summary</div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-2 xsm:flex-row ">
            <div>Staking contract address</div>
            <div className="flex w-full max-w-[140px] items-center">
              <CircleImage className="mr-2 h-5 w-5" />
              <div>0x8793192319....</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-2 xsm:flex-row ">
            <div>Reflections/Rewards</div>
            <div className="flex w-full max-w-[140px] items-center">
              <CircleImage className="mr-2 h-5 w-5" />
              <div>TICKER</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Lockup Period</div>
            <div className=" w-full max-w-[140px] pl-7">30 Days</div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between text-white xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Start Reward</div>
            <div className=" w-full max-w-[140px] pl-7">24:00:00:00</div>
          </div>
        </div>
      ) : (
        ""
      )}

      {step !== 5 ? <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" /> : ""}
      <div className="mx-auto h-12 max-w-[500px]">
        {step === 2 ? (
          <StyledButton type="primary" onClick={() => setStep(3)}>
            Deploy
          </StyledButton>
        ) : step === 4 ? (
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

const CircleImage = styled.div`
  background: #d9d9d9;
  border: 1px solid #000000;
  border-radius: 50%;
`;

export default Deploy;
