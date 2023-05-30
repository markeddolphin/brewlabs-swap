import React from "react";
import { useBrewsUsdPrice } from "hooks/useUsdPrice";
import { useAccount, useBalance } from "wagmi";

const BrewlabsBalance = () => {
  const { address } = useAccount();
  const brewsPriceUsd = useBrewsUsdPrice() || 0;

  const { data, isError, isLoading } = useBalance({
    chainId: 56,
    watch: true,
    address,
    token: "0x6aac56305825f712fd44599e59f2ede51d42c3e7",
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;

  const brewlabs = data?.formatted || "0";
  const brewlabsUsd = parseInt(brewlabs) * brewsPriceUsd;

  return (
    <div className="my-4">
      <h3 className="text-2xl">
        Your Brewlabs balance: $<span className="text-bold">{brewlabsUsd.toFixed(2)}</span>
      </h3>
      <small className="text-xs">Approximate in USD</small>
      <br />
      <small className="text-xs">Currently trading at ${brewsPriceUsd.toFixed(4)} USD</small>
    </div>
  );
};

export default BrewlabsBalance;
