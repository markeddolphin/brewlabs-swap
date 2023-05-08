import { useEffect, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { fetchAmbVersion } from "lib/bridge/amb";
import { getNetworkLabel } from "lib/bridge/helpers";
import { provider as getProvider } from "utils/wagmi";

export const useAmbVersion = (foreignChainId: ChainId, foreignAmbAddress: string) => {
  const [foreignAmbVersion, setForeignAmbVersion] = useState<string | null>("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const label = getNetworkLabel(foreignChainId).toUpperCase();
    const key = `${label}-AMB-VERSION`;
    const fetchVersion = async () => {
      const provider = await getProvider({ chainId: foreignChainId });
      await fetchAmbVersion(foreignAmbAddress, provider)
        .then((versionString) => {
          setForeignAmbVersion(versionString);
          sessionStorage.setItem(key, versionString);
        })
        .catch((versionError) => console.error({ versionError }));
      setFetching(false);
    };
    const version = sessionStorage.getItem(key);
    if (!version && !fetching) {
      setFetching(true);
      fetchVersion();
    } else {
      setForeignAmbVersion(version);
    }
  }, [foreignAmbAddress, foreignChainId, fetching]);

  return foreignAmbVersion;
};
