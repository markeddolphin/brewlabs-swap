import { fetchPrice } from "./fetchFeaturedPrices";

export async function fetchWalletHistories(tokens: any, period: number, resolution: number) {
  const _histories = await Promise.all(
    tokens
      .filter((data) => data.price)
      .map(async (data) => {
        const result = await fetchPrice(data.address, data.chainId, resolution, period);
        return { history: [...result.data.c, data.price], ...data };
      })
  );
  if (!_histories.length) return [];
  let histories = [];
  for (let i = 0; i < _histories[0].history.length; i++) {
    histories[i] = 0;
    for (let j = 0; j < _histories.length; j++) {
      histories[i] += _histories[j].history[i] * _histories[j].balance;
    }
  }
  return histories;
}
