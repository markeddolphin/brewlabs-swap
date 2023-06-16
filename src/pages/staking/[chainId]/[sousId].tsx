import PageWrapper from "components/layout/PageWrapper";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { usePools } from "state/pools/hooks";
import getCurrencyId from "utils/getCurrencyId";
import StakingDetail from "views/directory/StakingDetail";

const Staking: NextPage = () => {
  const router = useRouter();
  const { chainId, sousId }: any = router.query;
  const { pools } = usePools();
  const { tokenPrices } = useContext(TokenPriceContext);
  const allPools = [
    ...pools
      .filter((p) => p.visible)
      .map((pool) => {
        let price = tokenPrices[getCurrencyId(pool.chainId, pool.stakingToken.address)];
        if (price > 500000) price = 0;
        return { ...pool, tvl: pool.totalStaked && price ? +pool.totalStaked * price : 0 };
      }),
  ];

  const data = allPools.find(
    (pool: any) => pool.type === 1 && pool["sousId"] === +sousId && pool["chainId"] / 1 === chainId / 1
  );
  if (!data) return;

  return (
    <PageWrapper>
      <StakingDetail
        detailDatas={{
          data,
        }}
      />
    </PageWrapper>
  );
};

export default Staking;
