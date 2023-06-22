import { request } from "graphql-request";

import { PAIR_DAY_DATA_BULK } from "config/queries/router";

export const getPairDayDatas = async (graphEndpoint: string, pairs: string[]) => {
    const startTimestamp = new Date().getTime() - 3600 * 24 * 1000 * 4;
    const {pairDayDatas} = await request(graphEndpoint, PAIR_DAY_DATA_BULK(pairs, Number(startTimestamp / 1000).toFixed(0)))
    return pairDayDatas;
}