const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'
const PANCAKE_TOP100 = 'https://tokens.pancakeswap.finance/pancakeswap-top-100.json'
const UNISWAP_DEFAULT = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'
// const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  PANCAKE_TOP100,
  PANCAKE_EXTENDED,
  UNISWAP_DEFAULT,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]
// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []

export const BAD_SRCS: string[] = [
  'SHIB',
  'IOTA',
  'CAKE',
  'TWT',
  'XVS',
  'NEWB',
  'AXS',
  'CEEK',
  'DEP',
  'NFTY',
  'IHC',
  'FIL',
  'FXS',
  'FRAX',
  'ZIG',
  'ANML',
  'BOUNTIE',
  'GQ',
  'RADAR',
  'FROYO',
  'PRIMATE',
  'KEYFI',
  'PCWS',
  'GFCE',
  'FEG',
  'ATA',
  'GRAND',
  'FOXY',
  'WYVERN',
  'LORY',
  'SCAM',
  'WATCH',
  'EPS',
  'PERA',
  'GUARD',
  'BHC',
  'POLAR',
  'DCB',
  'THG',
  'WSG',
  'OTAKU',
  'TNNS',
  'TUSD',
  'WRX',
  'LMN',
  'HERA',
  'ORE',
  'GODZ',
  'MNFT',
  'BCMC',
  'ASPO',
]

export const BAD_SRCS_SUSHI = {
  '0x544c42fBB96B39B21DF61cf322b5EDC285EE7429': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x544c42fBB96B39B21DF61cf322b5EDC285EE7429/logo.png',
  '0xf1Dc500FdE233A4055e25e5BbF516372BC4F6871': 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/ethereum/0xf1Dc500FdE233A4055e25e5BbF516372BC4F6871.jpg',
  '0x471Ea49dd8E60E697f4cac262b5fafCc307506e4': 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/ethereum/0x471Ea49dd8E60E697f4cac262b5fafCc307506e4.jpg',
  '0xa5f2211B9b8170F694421f2046281775E8468044': 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/ethereum/0xa5f2211B9b8170F694421f2046281775E8468044.jpg',
  '0x46e98FFE40E408bA6412bEb670507e083C8B95ff': 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/ethereum/0x46e98FFE40E408bA6412bEb670507e083C8B95ff.jpg',
  '0x807a0774236A0fBE9e7f8E7Df49EDFED0e6777Ea': 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/ethereum/0x807a0774236A0fBE9e7f8E7Df49EDFED0e6777Ea.jpg',
  '0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC': 'https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/ethereum/0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC.jpg',
}
