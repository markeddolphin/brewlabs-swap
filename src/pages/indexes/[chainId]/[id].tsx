import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";

import { TokenPriceContext } from "contexts/TokenPriceContext";
import { useIndexes } from "state/indexes/hooks";
import getCurrencyId from "utils/getCurrencyId";

import PageWrapper from "components/layout/PageWrapper";
import IndexDetail from "views/directory/IndexDetail";

const Stables: NextPage = () => {
  const router = useRouter();

  const { id }: any = router.query;
  const { indexes } = useIndexes();
  const { tokenPrices } = useContext(TokenPriceContext);

  const allPools = [
    ...indexes.map((_index) => {
      let tvl = 0;
      for (let i = 0; i < _index.tokens.length; i++) {
        let price = _index.tokenPrices?.[i] ?? tokenPrices[getCurrencyId(_index.chainId, _index.tokens[i].address)];
        tvl += _index.totalStaked?.[i] && price ? +_index.totalStaked[i] * price : 0;
      }
      return { ..._index, tvl };
    }),
  ];

  const data = allPools.find((pool: any) => pool.type === 3 && pool["pid"] === id / 1);
  if (!data) return;

  return (
    <PageWrapper>
      <IndexDetail
        detailDatas={{
          data,
        }}
      />
    </PageWrapper>
  );
};

export default Stables;
