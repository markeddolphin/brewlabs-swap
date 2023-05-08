/* eslint-disable react-hooks/exhaustive-deps */
import SelectToken from "./SelectToken";
import Deploy from "./Deploy";

const PoolDeployer = ({ step, setStep, setOpen }) => {
  return (
    <div>
      {step === 1 ? (
        <SelectToken step={step} setStep={setStep} />
      ) : step > 1 ? (
        <Deploy step={step} setStep={setStep} setOpen={setOpen} />
      ) : (
        ""
      )}
    </div>
  );
};

export default PoolDeployer;
