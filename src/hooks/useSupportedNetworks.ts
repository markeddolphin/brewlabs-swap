import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { NetworkOptions, PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { NetworkConfig } from "config/constants/types";

export const useSupportedNetworks = () => {
  const [networks, setNetworks] = useState<NetworkConfig[]>([]);
  const { pathname } = useRouter();

  useEffect(() => {
    const page = pathname.split("/")[1];
    setNetworks(NetworkOptions.filter((network) => PAGE_SUPPORTED_CHAINS[page]?.includes(network.id)));
  }, [pathname]);

  return networks || [];
};
