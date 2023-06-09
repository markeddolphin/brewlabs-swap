import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { ETHEREUM } = ChainId;
const tokens = {
  eth: NATIVE_CURRENCIES[ChainId.ETHEREUM],
  weth: WNATIVE[ChainId.ETHEREUM],
  usdt: new Token(
    ETHEREUM,
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    6,
    "USDT",
    "Tether USD",
    "https://tether.to/"
  ),
  usdc: new Token(
    ETHEREUM,
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    6,
    "USDC",
    "USD Coin",
    "https://www.centre.io/"
  ),
  brews: new Token(
    ETHEREUM,
    "0xdAd33e12e61dC2f2692F2c12e6303B5Ade7277Ba",
    9,
    "BREWLABS",
    "Brewlabs",
    "https://brewlabs.info/"
  ),
  uni: new Token(ETHEREUM, "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", 18, "UNI", "Uniswap", "https://uniswap.org/"),
  shari: new Token(
    ETHEREUM,
    "0x2df488b8A4270bAc5C2cE5FF467A0C5fd2AA49d6",
    9,
    "Shari",
    "Sharity",
    "https://www.sharitytoken.com/"
  ),
  saitama: new Token(
    ETHEREUM,
    "0x8B3192f5eEBD8579568A2Ed41E6FEB402f93f73F",
    9,
    "SAITAMA",
    "Saitama Inu",
    "https://saitamatoken.com/"
  ),
  koaCombat: new Token(
    ETHEREUM,
    "0x6769D86f9C430f5AC6d9c861a0173613F1C5544C",
    9,
    "KoaCombat",
    "KoaCombat",
    "http://www.koacombat.com"
  ),
  rkt: new Token(
    ETHEREUM,
    "0x1104080b3ca1F766a33C16aA890465D1A63e5078",
    18,
    "RKT",
    "Red Knight Token",
    "https://www.redknighttoken.com/"
  ),
  shaman: new Token(
    ETHEREUM,
    "0x5fCe9Fc9B5d62aF082A59D0823A062F7529eFA5a",
    18,
    "SHAMAN",
    "Shaman",
    "https://www.shamankinginu.io/"
  ),
  ethdox: new Token(
    ETHEREUM,
    "0x5892F5d533E81f9dF91CD4A61886D555BAE6b166",
    18,
    "ETHDOX",
    "ETHDox",
    "https://www.doxedtoken.com/ethdox"
  ),
  honr: new Token(
    ETHEREUM,
    "0x39Ea10E507720783C27eDd5F96Bf2D6e199579B8",
    18,
    "HONR",
    "DeltaFlare",
    "https://deltaflare.gg/"
  ),
  shift: new Token(
    ETHEREUM,
    "0xB250382D6a8b5E366236af688a22e0036c4d63a9",
    9,
    "SHIFT",
    "SHIFT TOKEN",
    "http://www.shift-token.com"
  ),
  titn: new Token(
    ETHEREUM,
    "0xEA18370F4568C1b7cb59246Bb94C5bf0d5015Cf5",
    18,
    "TITN",
    "Crypto Titan Token",
    "http://www.titancrypto.org"
  ),
  scard: new Token(
    ETHEREUM,
    "0x2F6Ad7743924B1901a0771746152dde44C5F11DE",
    18,
    "SCARD",
    "SCARDust",
    "https://warmus.land/scardust/"
  ),
  viral: new Token(
    ETHEREUM,
    "0x9D37F31A4e8c6af7f64F1cE6241D24F5cACd391C",
    18,
    "VIRAL",
    "VIRAL",
    "https://theviralcrypto.co/"
  ),
  viralLP: new Token(ETHEREUM, "0x2EFA525B14539EeA83ADCeE4E6578a35905fE8bc", 18, "VIRAL-ETH LP", "Uniswap V2"),
  voltz: new Token(
    ETHEREUM,
    "0x67096837E7b5d0116C166b674dc5A0c4C7c8e9a0",
    9,
    "VOLTZ",
    "Voltnobi",
    "https://voltnobi.com/"
  ),
  dryp: new Token(
    ETHEREUM,
    "0xBE1fa1303e2979Ab4d4e5dF3D1c6e3656ACAb027",
    18,
    "DRYP",
    "Dripto",
    "https://www.dripto.com"
  ),
  kpets: new Token(
    ETHEREUM,
    "0x72295E7904e5dc591f83ef11559dB7A89D1e3CeD",
    18,
    "KPETS",
    "Krypto Pets",
    "https://kryptopetsmetaverse.com/"
  ),
  shift2: new Token(
    ETHEREUM,
    "0x5d554E71744AaDA1738261f64e3A2C6dD8A7DeF1",
    9,
    "SHIFT",
    "SHIFT",
    "http://www.shift-token.com"
  ),
  flip: new Token(ETHEREUM, "0x98342918bc3B72fe2E63495da9A63Cc6Bac30e9A", 18, "FLIP", "FlipToken"),
  reit: new Token(ETHEREUM, "0x3E9D9124596af6D8FaaeFc9B3e07b3cE397d34F7", 18, "REIT", "REI Token"),
  gvr: new Token(
    ETHEREUM,
    "0x84FA8f52E437Ac04107EC1768764B2b39287CB3e",
    18,
    "GVR",
    "Grove Token",
    "https://www.grovetoken.com/"
  ),
  wpt: new Token(
    ETHEREUM,
    "0x4FD51Cb87ffEFDF1711112b5Bd8aB682E54988eA",
    18,
    "WPT",
    "WPT Investing Corp",
    "https://www.warpigs.io/"
  ),
  trt: new Token(
    ETHEREUM,
    "0x69C275C3Cbd7Edf5e6942149266CE8505C65baF8",
    18,
    "TRT",
    "The Revolution Token",
    "https://therevolutiontoken.com/"
  ),
  jigsaw: new Token(
    ETHEREUM,
    "0xb0d47dD82fb8FACb1Bc4bA534a836B545aD97d2B",
    18,
    "JIGSAW",
    "JigsawToken",
    "https://jigsawtoken.net/"
  ),
  ly: new Token(
    ETHEREUM,
    "0x8686525d6627A25C68De82c228448f43c97999F2",
    9,
    "Ly",
    "Lilly Finance",
    "https://www.lillyfinance.com/"
  ),
  ixp: new Token(
    ETHEREUM,
    "0x54Cb643ab007f47882E8120A8c57B639005c2688",
    18,
    "IXP",
    "IMPACTXPRIME",
    "https://impactxp.io/"
  ),
  met: new Token(
    ETHEREUM,
    "0x66571B3F5C925fD27aAff741c7b3Bbb3F5e923a6",
    18,
    "MET",
    "Mivie Token",
    "https://mivietoken.com/"
  ),
  heros: new Token(
    ETHEREUM,
    "0xb622400807765e73107B7196F444866D7EdF6f62",
    9,
    "HEROS",
    "Heros Token",
    "https://hero-universe.com/"
  ),
  roo: new Token(
    ETHEREUM,
    "0x9d7107c8E30617CAdc11f9692A19C82ae8bbA938",
    18,
    "ROO",
    "LUCKY ROO",
    "https://luckyroo.io/"
  ),
  mmtkn: new Token(
    ETHEREUM,
    "0x48a58Fdf91Ab56B5700D853733b860b4cDE08b26",
    18,
    "MMTKN",
    "MetaMerce Token",
    "https://metamercetoken.com/"
  ),
  alcazar: new Token(
    ETHEREUM,
    "0x10f44a834097469AC340592d28c479c442E99bFe",
    18,
    "ALCAZAR",
    "Alcazar",
    "https://alcazartoken.io/"
  ),
  gcc: new Token(ETHEREUM, "0x2090119735011cEFde9a8c9794A08c0d99B1F897", 18, "GCC", "Grow Crop Corp"),
  okm: new Token(ETHEREUM, "0xe8616218e54fc97941369622CcB968dae2BcC94D", 18, "OKM", "Okami"),
  balto: new Token(
    ETHEREUM,
    "0x5955f7d312c5d84B004d259D55072C4F0A478dBC",
    18,
    "BALTO",
    "Balto Token",
    "https://baltotoken.com/"
  ),
  pom: new Token(
    ETHEREUM,
    "0x24ffe459F51ea20C5d8ad49843529fc33654e7E4",
    9,
    "POM",
    "Pomeranian",
    "https://www.pomeranian.dev"
  ),
  funicular: new Token(ETHEREUM, "0x90A1Dd7f8dAD69FD1000A2d185D29BfddCe970F6", 18, "FUNICULAR", "Funicular Token"),
  shido: new Token(
    ETHEREUM,
    "0x173E552Bf97BBD50b455514ac52991Ef639ba703",
    9,
    "SHIDO",
    "Shido Inu",
    "https://www.shido.finance/"
  ),
  slake: new Token(ETHEREUM, "0x9C2500CfD2f1De40255Cee5EC8AdA6466E1eddf1", 18, "SLAKE", "Slake", "https://slake.it/"),
  volt: new Token(ETHEREUM, "0x7db5af2B9624e1b3B4Bb69D6DeBd9aD1016A58Ac", 9, "VOLT", "Volt Inu", "https://voltinu.in/"),
  kndm: new Token(
    ETHEREUM,
    "0x1ae378cC5d38350Ec90cE9bcf827a544cB2BBA75",
    18,
    "KNDM",
    "Kingdom",
    "https://www.kingdometh.com/"
  ),
  bacon: new Token(ETHEREUM, "0x186785D4cba7263532F1da9bBeC3Da612dd6D085", 18, "BACON", "Bacon Token"),
  air: new Token(
    ETHEREUM,
    "0x3B7eEb31278fFC9f1fc2C0C8543825b646C3E66b",
    18,
    "AIR",
    "Balloon Protocol",
    "https://balloon-protocol.info/"
  ),
  xua2: new Token(ETHEREUM, "0xB3C28F8b7929497285D07a8f48ff466A7d4C782F", 18, "XUA2", "London Gold"),
  r33lz: new Token(ETHEREUM, "0x5D3957DF518adE9AdfD7c4341a0cf7D6D73EC682", 18, "R33LZ", "R33LZ"),
  rvr: new Token(ETHEREUM, "0xb8b4b66852275355d591B90E5B75f84cAeffF392", 9, "RVR", "ReVeR"),
  jacy: new Token(
    ETHEREUM,
    "0x3B7eEb31278fFC9f1fc2C0C8543825b646C3E66b",
    9,
    "JACY",
    "JACY",
    "https://jacytoken.io/"
  ),
  bbpp: new Token(
    ETHEREUM,
    "0x5dD0F5dA07E9C63F2d216179311EF8cB68ABb629",
    18,
    "BBPP",
    "Baby Pepe",
    "https://www.babypepetoken.com/"
  ),
  xbbpp: new Token(
    ETHEREUM,
    "0xe9fdB522F1b6623BB29cf1d70C4728A7e55c5634",
    18,
    "xBBPP",
    "xBBPP",
    "https://www.babypepetoken.com/"
  ),
  pepe: new Token(
    ETHEREUM,
    "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    18,
    "PEPE",
    "Pepe",
    "https://www.pepe.vip/"
  ),
  dai: new Token(ETHEREUM, "0x6B175474E89094C44Da98b954EedeAC495271d0F", 18, "DAI", "Dai Stablecoin"),
  wbtc: new Token(ETHEREUM, "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", 8, "WBTC", "Wrapped BTC"),
  rune: new Token(ETHEREUM, "0x3155BA85D5F96b2d030a4966AF206230e46849cb", 18, "RUNE", "RUNE.ETH"),
  nftx: new Token(ETHEREUM, "0x87d73E916D7057945c9BcD8cdd94e42A6F47f776", 18, "NFTX", "NFTX"),
  steth: new Token(ETHEREUM, "0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D", 18, "stETH", "stakedETH"),
  ohm_v1: new Token(ETHEREUM, "0x383518188C0C6d7730D91b2c03a03C837814a899", 9, "Olympus V1", "OHM"),
  ohm_v2: new Token(ETHEREUM, "0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5", 9, "Olympus V2", "OHM"),
  mim: new Token(ETHEREUM, "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3", 18, "MIM", "Magic Internet Money"),
  frax: new Token(ETHEREUM, "0x853d955aCEf822Db058eb8505911ED77F175b99e", 18, "FRAX", "FRAX"),
  sushi: new Token(ETHEREUM, "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", 18, "SUSHI", "SushiToken"),
  stg: new Token(ETHEREUM, "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6", 18, "STG", "StargateToken"),
};

export default tokens;
