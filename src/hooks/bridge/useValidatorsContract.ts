import { useEffect, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { getNetworkLabel } from "lib/bridge/helpers";
import { fetchRequiredSignatures, fetchValidatorList } from "lib/bridge/message";
import { provider as getProvider } from "utils/wagmi";

export const useValidatorsContract = (foreignChainId: ChainId, foreignAmbAddress: string) => {
  const [requiredSignatures, setRequiredSignatures] = useState(0);
  const [validatorList, setValidatorList] = useState([]);

  useEffect(() => {
    const label = getNetworkLabel(foreignChainId).toUpperCase();
    const key = `${label}-${foreignAmbAddress.toUpperCase()}-REQUIRED-SIGNATURES`;
    const fetchValue = async () => {
      try {
        const provider = await getProvider({ chainId: foreignChainId });
        const res = await fetchRequiredSignatures(foreignAmbAddress, provider);
        const signatures = Number.parseInt(res.toString(), 10);
        setRequiredSignatures(signatures);
        sessionStorage.setItem(key, signatures.toString());
      } catch (versionError) {
        console.error({ versionError });
      }
    };
    const storedValue = sessionStorage.getItem(key);
    if (storedValue) {
      setRequiredSignatures(Number.parseInt(storedValue, 10));
    } else {
      fetchValue();
    }
  }, [foreignAmbAddress, foreignChainId]);

  useEffect(() => {
    const label = getNetworkLabel(foreignChainId).toUpperCase();
    const key = `${label}-${foreignAmbAddress.toUpperCase()}-VALIDATOR-LIST`;
    const fetchValue = async () => {
      try {
        const provider = await getProvider({ chainId: foreignChainId });
        const res = await fetchValidatorList(foreignAmbAddress, provider);
        setValidatorList(res);
        sessionStorage.setItem(key, JSON.stringify(res));
      } catch (versionError) {
        console.error({ versionError });
      }
    };
    const storedValue = sessionStorage.getItem(key);
    if (storedValue) {
      setValidatorList(JSON.parse(storedValue));
    } else {
      fetchValue();
    }
  }, [foreignAmbAddress, foreignChainId]);

  return { requiredSignatures, validatorList };
};
