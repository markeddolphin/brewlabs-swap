import BigNumber from "bignumber.js";

const units = ['', 'k', 'M', 'B', 'T', 'Q', 'Q', 'S', 'S'];

export const formatApy = value => {
  if (!value) return `???`;

  const apy = value * 100;

  const order = apy < 1 ? 0 : Math.floor(Math.log10(apy) / 3);
  if (order >= units.length - 1) return `🔥`;

  const num = apy / 1000 ** order;
  return `${num.toFixed(2)}${units[order]}%`;
};

export const formatTvl = (value, oraclePrice, useOrder = true) => {
  let tvl;
  if (oraclePrice) {
    tvl = new BigNumber(value).times(oraclePrice).toFixed(2);
  }

  let order = Math.floor(Math.log10(tvl) / 3);
  if (order < 0 || useOrder === false) {
    order = 0;
  }
  if(order > 8) order = 8

  const num = tvl / 1000 ** order;

  return `$${num.toFixed(2)}${units[order]}`;
};

export const formatAmount = (value, decimals = 2, useOrder = true) => {
  let tvl = new BigNumber(value).toFixed(decimals)

  let order = Math.floor(Math.log10(+tvl) / 3);
  if (order < 0 || useOrder === false) {
    order = 0;
  }
  if(order > 8) order = 8

  const num = +tvl / 1000 ** order;

  return `${num.toFixed(decimals)}${units[order]}`;
};

export const formatBalanceWithUnit = (value, baseOrder = 0) => {
  let order = Math.floor(Math.log10(value) / 3);
  if (order < baseOrder) {
    order = 0;
  } else {
    order -= baseOrder
  }
  if(order >= units.length - 1) {
    order = units.length - 1
  }
  
  const num = value / 1000 ** order;

  return {
    num,
    suffix: units[order]
  }
};

export const formatGlobalTvl = tvl => formatTvl(tvl, 1);

export const calcDaily = apy => {
  if (!apy) return `???`;

  const g = 10**(Math.log10(apy + 1) / 365) - 1;
  if (Number.isNaN(g)) {
    return '- %';
  }

  return `${(g * 100).toFixed(2)}%`;
};

export const yearlyToDaily = apy => {
  const g = 10**(Math.log10(apy + 1) / 365) - 1;

  if (Number.isNaN(g)) {
    return 0;
  }

  return g;
};

export const formatCountdown = deadline => {
  const time = deadline - new Date().getTime();

  const day = Math.floor(time / (1000 * 60 * 60 * 24))
    .toString()
    .padStart(2, '0');
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((time / (1000 * 60)) % 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((time / 1000) % 60)
    .toString()
    .padStart(2, '0');

  return `${day}day ${hours}:${minutes}:${seconds}`;
};

export const formatDecimals = number => {
  if(number.isEqualTo(0)) return 0

  return number >= 10 ? number.toFixed(4) : number.toFixed(8);
};
