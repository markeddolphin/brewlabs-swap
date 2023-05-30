/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useActiveChainId } from "@hooks/useActiveChainId";
import useLPTokenInfo from "@hooks/useLPTokenInfo";
import SelectToken from "./SelectToken";
import Deploy from "./Deploy";


const FarmDeployer = ({ setOpen, step, setStep }) => {
  const { chainId } = useActiveChainId();

  const [router, setRouter] = useState<any>({ name: "" });
  const [lpAddress, setLpAddress] = useState("");

  const lpInfo = useLPTokenInfo(lpAddress, chainId);

  return (
    <div>
      {step === 1 ? (
        <SelectToken
          setStep={setStep}
          router={router}
          setRouter={setRouter}
          lpAddress={lpAddress}
          setLpAddress={setLpAddress}
          lpInfo={lpInfo}
        />
      ) : step > 1 ? (
        <Deploy
          setOpen={setOpen}
          step={step}
          setStep={setStep}
          router={router}
          lpInfo={lpInfo?.pair}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default FarmDeployer;
