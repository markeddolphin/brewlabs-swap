/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import SelectToken from "./SelectToken";
import Deploy from "./Deploy";

const IndexDeployer = ({ setOpen, step, setStep }) => {
  const [tokens, setTokens] = useState(new Array(2).fill(undefined));

  return (
    <div>
      {step === 1 ? (
        <SelectToken setStep={setStep} tokens={tokens} setTokens={setTokens} />
      ) : (
        <Deploy step={step} setStep={setStep} setOpen={setOpen}  tokens={tokens}/>
      )}
    </div>
  );
};

export default IndexDeployer;
