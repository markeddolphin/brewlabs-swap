const SECONDS_PER_YEAR = 365.2425 * 86400 /** SECONDS_PER_YEAR = 31,556,952 */
const BLOCKS_IN_A_YEAR = SECONDS_PER_YEAR / 13.25

export const aprToApy = (apr, frequency = BLOCKS_IN_A_YEAR) => ((1 + apr / 100 / frequency) ** frequency - 1) * 100
