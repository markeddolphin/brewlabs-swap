import PageWrapper from "components/layout/PageWrapper";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import getCurrencyId from "utils/getCurrencyId";
import { useFarms } from "state/farms/hooks";
import FarmingDetail from "views/directory/FarmingDetail";

const Farms: NextPage = () => {
  const router = useRouter();
  const { chainId, address }: any = router.query;
  const { data: farms } = useFarms();
  const { lpPrices } = useContext(TokenPriceContext);
  const allPools = [
    ...farms
      .filter((p) => p.visible)
      .map((farm) => {
        let price = lpPrices[getCurrencyId(farm.chainId, farm.lpAddress, true)];
        return { ...farm, tvl: farm.totalStaked && price ? +farm.totalStaked * price : 0 };
      }),
  ];

  const data = allPools.find(
    (pool: any) =>
      pool.type === 2 &&
      pool["contractAddress"].toLowerCase() === address.toLowerCase() &&
      pool["chainId"] / 1 === chainId / 1
  );
  if (!data) return;

  return (
    <PageWrapper>
      <FarmingDetail
        detailDatas={{
          data,
        }}
      />
    </PageWrapper>
  );
};

export default Farms;
