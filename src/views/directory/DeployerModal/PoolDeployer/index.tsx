/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import SelectToken from "./SelectToken";
import Deploy from "./Deploy";

const PoolDeployer = ({ setOpen }) => {
  const [step, setStep] = useState(1);

  return (
    <div>
      {step === 1 ? (
        <SelectToken step={step} setStep={setStep} />
      ) : (
        <Deploy step={step} setStep={setStep} setOpen={setOpen} />
      )}
    </div>
  );
};

export default PoolDeployer;
