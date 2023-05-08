import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { BSC_MAINNET } = ChainId;
const tokens = {
  bnb: NATIVE_CURRENCIES[ChainId.BSC_MAINNET],
  wbnb: WNATIVE[ChainId.BSC_MAINNET],
  brews: new Token(
    BSC_MAINNET,
    "0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7",
    9,
    "BREWLABS",
    "Brewlabs",
    "https://brewlabs.info/"
  ),
  kodi: new Token(
    BSC_MAINNET,
    "0xbA5eAB68a7203C9FF72E07b708991F07f55eF40E",
    18,
    "KODI",
    "Kodi",
    "https://kodicoin.com/"
  ),
  setc: new Token(BSC_MAINNET, "0xf30e2CfF732A93ceB45F9f9172fD970Da88632c6", 18, "SeTC", "SNAFU"),
  svt: new Token(
    BSC_MAINNET,
    "0x7BA3cD00229C1beCC95a4B056fF15C123DcB456D",
    9,
    "SVT",
    "Space Vikings",
    "https://www.spacevikingsllc.com/"
  ),
  dexi: new Token(
    BSC_MAINNET,
    "0x29b1E39A529d3B3cacEA55989594F71813e998Bb",
    18,
    "DEXI",
    "Dexioprotocol",
    "https://www.dexioprotocol.com/"
  ),
  dxg: new Token(
    BSC_MAINNET,
    "0x8236f1239530971868925e6017d4005763E9087f",
    18,
    "DXG",
    "DEXI GAS",
    "https://www.dexioprotocol.com/"
  ),
  mbc: new Token(
    BSC_MAINNET,
    "0xF14D3692B0055Db9Ca4c04065165d59B87E763f1",
    18,
    "MBC",
    "MetaBUSDCoin",
    "https://metabusdcoin.com/"
  ),
  rari: new Token(BSC_MAINNET, "0x856333816B8E934bCF4C08FAf00Dd46e5Ac0aaeC", 18, "RARI", "Rari Token"),
  bbft: new Token(
    BSC_MAINNET,
    "0x07335A076184C0453aE1987169D9c7ab7047a974",
    18,
    "BBFT",
    "BUSD Buffet",
    "https://busdbuffet.com/"
  ),
  bti: new Token(
    BSC_MAINNET,
    "0xD6f69d350ef024d364bF234b7Df4b6771f3BF861",
    4,
    "BTI",
    "Bitoshi",
    "https://www.bitoshi.org/"
  ),
  btiV2: new Token(
    BSC_MAINNET,
    "0x423e5F30a968aa903F8A32cbAdF9dc1e8e1dc141",
    18,
    "BTI V2",
    "Bitoshi V2",
    "https://www.bitoshi.org/"
  ),
  pch: new Token(BSC_MAINNET, "0xE779b4301c046bFE09C0D3d3bf0D6C13b40F4D56", 18, "PCH", "PLUTUS CAPITAL HOLDINGS"),
  evrf: new Token(
    BSC_MAINNET,
    "0x3C2e501B08CF5C16061468c96b19b32bae451dA3",
    18,
    "EVRF",
    "EverReflect",
    "https://www.everreflect.io/"
  ),
  sfinu: new Token(
    BSC_MAINNET,
    "0x190984cB2E74332c2c9017f4998E382fc31DC2D5",
    18,
    "SFINU",
    "Shitface Inu",
    "https://shitfaceinu.com/"
  ),
  riv2: new Token(
    BSC_MAINNET,
    "0x10C723D4a9180C468055a548BF58d7AB279Fe4Ac",
    9,
    "RIV2",
    "RiseUpV2",
    "https://riseupofficial.finance/"
  ),
  bacca: new Token(
    BSC_MAINNET,
    "0xfD2d4925a9f9a21c500085F4A55f7F7237A2fcb3",
    18,
    "BACCA",
    "SHIBACCA",
    "https://shibacca.net/"
  ),
  gvr: new Token(
    BSC_MAINNET,
    "0xaFb64E73dEf6fAa8B6Ef9a6fb7312d5C4C15ebDB",
    18,
    "GVR",
    "Grove Token",
    "https://www.grovetoken.com/"
  ),
  mair: new Token(
    BSC_MAINNET,
    "0x1828e38E7271c44e4BeC6810dC5279223cCd14ff",
    9,
    "MAIR",
    "MetaAir",
    "https://metaaircoin.com/"
  ),
  ukrriseup: new Token(
    BSC_MAINNET,
    "0x62ad0a8c824BcC7f6dfa195bf8839e32EE15150a",
    18,
    "UKRRiseUp",
    "UKRRiseUp",
    "https://ukraineriseup.io/"
  ),
  dox: new Token(
    BSC_MAINNET,
    "0xEDA3eB7A5494443beb800cD4cc70388228CEe84e",
    10,
    "DOX",
    "DOXED",
    "http://www.doxedtoken.com/"
  ),
  busdm: new Token(
    BSC_MAINNET,
    "0xFE206598B9c586E9a932BA3EC71bd24F31603690",
    9,
    "BUSDM",
    "BUSDMeta",
    "https://busdmeta.com/"
  ),
  dwt: new Token(
    BSC_MAINNET,
    "0x4b7d697635e6b9965d13e0655F538149dE425F4E",
    9,
    "DWT",
    "DiveWallet Token",
    "https://www.divewallet.net/"
  ),
  branch: new Token(
    BSC_MAINNET,
    "0xD70b6DEf98Cd1eD076b1D10c72090177027F948E",
    9,
    "BRANCH",
    "BRANCH",
    "https://branchenvironment.com/"
  ),
  plnt: new Token(
    BSC_MAINNET,
    "0x9d359D5215D13580A08bd4E5436C5E8Cd3201Fd0",
    18,
    "PLNT",
    "Platanaso",
    "https://platanaso.com"
  ),
  dvfb: new Token(
    BSC_MAINNET,
    "0xc50F00779559b2E13Dee314530cC387CC5dD85ae",
    18,
    "DVFB",
    "DiversiFi Blue",
    "http://www.diversifi.app/"
  ),
  bully: new Token(
    BSC_MAINNET,
    "0x99459fE946B072E5211A6b01EA26BafABbf77aaa",
    4,
    "BULLY",
    "Bully Inu",
    "https://bullyinu.net/"
  ),
  gdt: new Token(
    BSC_MAINNET,
    "0xb7F2bca9b034f8cc143339Dd12bb31D3D50Cf27a",
    9,
    "GDT",
    "GorillaDiamond",
    "https://www.gorilladiamond.com/"
  ),
  eft: new Token(
    BSC_MAINNET,
    "0x21004b11939359E7E962Db6675d56f50353dF29C",
    18,
    "EFT",
    "EternalFlow",
    "http://Eternalflow.io"
  ),
  freedom: new Token(
    BSC_MAINNET,
    "0xEe3495aDB71b91Fb82F926C201aE1B8aEAE7EC68",
    18,
    "FREEDOM",
    "FREEDOM",
    "https://weshallbfree.com/"
  ),
  lyst: new Token(
    BSC_MAINNET,
    "0x47B6530073143Fa592468eb00b442445538d196e",
    18,
    "LYST",
    "Crypto Lyst",
    "http://cryptolyst.com/"
  ),
  mtx: new Token(
    BSC_MAINNET,
    "0xe28832f94Aa99d3eD4c61EF805330168556b4179",
    9,
    "MTX",
    "Matrix Protocol",
    "http://www.matrixprotocol.io/"
  ),
  cvt: new Token(
    BSC_MAINNET,
    "0xF72B0F79dC66f270FE52C67e56e12872F86cae2d",
    9,
    "CVT",
    "Crypto Vault",
    "https://cryptovault.net/"
  ),
  lol: new Token(
    BSC_MAINNET,
    "0xF21B44E4951a73E22B8AF0FA18188910f5D94D81",
    18,
    "LOL",
    "Crypto Comedy Club",
    "http://www.cryptocomedyclub.io"
  ),
  renteez: new Token(
    BSC_MAINNET,
    "0x6d7911bF8556996c90cF9429fB24280f22337267",
    18,
    "EZ",
    "Renteez Coin",
    "https://www.renteez.com"
  ),
  reflex: new Token(
    BSC_MAINNET,
    "0x2f499c6DA2C84063BB7e0CB1C478687210cDB615",
    18,
    "REFLEX V2",
    "Reflex Finance V2",
    "https://reflexfinance.net"
  ),
  tarp: new Token(
    BSC_MAINNET,
    "0x6C0A568a3fFb61957812fb3e300e4C10B708d336",
    9,
    "TARP",
    "Totally A Rug Pull",
    "https://www.totallyarugpull.com"
  ),
  vantage: new Token(
    BSC_MAINNET,
    "0x41d569B08314087e220b0fD8e3A7E3CcF8c4cC0b",
    9,
    "VANTAGE",
    "BTC Vantage",
    "http://btcvantage.finance/"
  ),
  vlk: new Token(
    BSC_MAINNET,
    "0x797Bb0BeeA437D2762A755ea911C0046C1284568",
    18,
    "VLK",
    "Vulkania",
    "https://vulkania.io/"
  ),
  ego: new Token(
    BSC_MAINNET,
    "0x1DF2C6DF4d4E7F3188487F4515587c5E8b75dbfa",
    18,
    "EGO",
    "Equitable Growth Opportunity",
    "https://growyourego.finance/"
  ),
  ethfan: new Token(
    BSC_MAINNET,
    "0xB72962568345253f71A18318D67E13A282b187E6",
    18,
    "EFT",
    "ETH Fan Token Ecosystem",
    "https://ethfan.club"
  ),
  efb: new Token(
    BSC_MAINNET,
    "0x002d3C280f719c4B0444680A8C4B1785b6cC2A59",
    9,
    "EFB",
    "ETHFan Burn",
    "https://efb.ethfan.club"
  ),
  balto: new Token(
    BSC_MAINNET,
    "0xe5977835A013e3A5a52f44f8422734bd2dc545F0",
    18,
    "BALTO",
    "Balto Token",
    "https://baltotoken.com/"
  ),
  ogem: new Token(BSC_MAINNET, "0x9b3C36B38B4A9d3fF4Dc90FbC4f6b8fe9B018B52", 9, "OGEM", "OnlyGems Finance"),
  bcat: new Token(
    BSC_MAINNET,
    "0x17534dA60Daff58ee1d77EF4aEc6556E03Ff39B9",
    18,
    "BCAT",
    "BillionaireCat",
    "https://www.billionairecat.io/"
  ),
  cty: new Token(
    BSC_MAINNET,
    "0x188173379AC8963048Afe01C5d3D5998FEe67254",
    18,
    "CTY",
    "CUSTODIY $CTY",
    "http://www.custodiy.com/"
  ),
  drmclub: new Token(
    BSC_MAINNET,
    "0x5bA6162Bfb440ffe9b1679b8D851572197FC7FA3",
    9,
    "DRMCLUB",
    "DREAMCATION CLUB",
    "https://dreamcationclub.com/"
  ),
  h2on: new Token(
    BSC_MAINNET,
    "0xE0E81c29A68bFDd7c48072fD94e7c58F1f0146C1",
    18,
    "H2ON",
    "H2O Network Token",
    "https://www.h2o-securities.com/"
  ),
  vfx: new Token(
    BSC_MAINNET,
    "0xe06f46AFD251B06152B478d8eE3aCea534063994",
    18,
    "VFX",
    "Vault Finance",
    "https://thevaultfinance.com/"
  ),
  dr: new Token(
    BSC_MAINNET,
    "0x1be04C690fe0Fd83cc939Bc4860728b89ebceb78",
    9,
    "DR",
    "Doge Resort",
    "https://dogeresort.com/"
  ),
  mfx: new Token(
    BSC_MAINNET,
    "0x6266a18F1605DA94e8317232ffa634C74646ac40",
    18,
    "MFX",
    "METFX Watch-To-Earn",
    "https://www.metfx.io/"
  ),
  lung: new Token(
    BSC_MAINNET,
    "0x28B9aed756De31B6b362aA0f23211D13093EBb79",
    18,
    "LUNG",
    "LunaGens",
    "https://www.lunagens.com/"
  ),
  burn: new Token(BSC_MAINNET, "0x5A5844CAb96A7b8B257Fc606Aa6119c5cBc6D4c4", 9, "BURN", "Bitburn"),
  heros: new Token(BSC_MAINNET, "0xD1673C00Ac7010bF2c376ebeA43633dd61A81016", 9, "HEROS", "Heros Token"),
  prox: new Token(
    BSC_MAINNET,
    "0x9d9fA9DbAe391C3FB6866F43De62FF3B393133b2",
    18,
    "ProX",
    "Project X",
    "https://proxtoken.com/"
  ),
  roo: new Token(
    BSC_MAINNET,
    "0x9d7107c8E30617CAdc11f9692A19C82ae8bbA938",
    18,
    "ROO",
    "LUCKY ROO",
    "https://luckyroo.io/"
  ),
  glow: new Token(
    BSC_MAINNET,
    "0x606379220AB266bBE4b0FeF8469e6E602f295a84",
    18,
    "GLOW",
    "Glow Token",
    "https://www.glowtoken.net/"
  ),
  lndlrd: new Token(
    BSC_MAINNET,
    "0xd6dA6491A6663B1d413715f4fD8eDD74a4b47694",
    18,
    "LNDLRD",
    "The Landlord",
    "http://thelandlord.biz/"
  ),
  shido: new Token(
    BSC_MAINNET,
    "0x733Af324146DCfe743515D8D77DC25140a07F9e0",
    9,
    "SHIDO",
    "Shido Inu",
    "https://www.shido.finance/"
  ),
  dapp: new Token(
    BSC_MAINNET,
    "0x1eF68f4507374960cF186c8999aadADB86736Ca4",
    18,
    "DAPP",
    "DAPPCASH",
    "https://altnotify.com/"
  ),
  rvlt: new Token(
    BSC_MAINNET,
    "0x3E05385F64B8Ff3D47A63e1FaeF0585372717B41",
    18,
    "RVLT",
    "Revoltance",
    "https://revoltance.com/"
  ),
  y5: new Token(
    BSC_MAINNET,
    "0x158f40D656DE7A57B095CC01FB6bBFD17dC4faf9",
    9,
    "Y5",
    "Y5 Crypto",
    "https://y5crypto.com/"
  ),
  lcr: new Token(
    BSC_MAINNET,
    "0x988F7c894e4001EEB7B570CDE80dffE21CF7B6B9",
    9,
    "LCR",
    "LUCRO",
    "https://evergrowegc.com/lucrolaunch/"
  ),
  alcazar: new Token(
    BSC_MAINNET,
    "0x353D0d1b4Feb416FAaAbD5B314D99ef148D56dFF",
    18,
    "ALCAZAR",
    "Alcazar",
    "https://alcazartoken.io/"
  ),
  dtt: new Token(
    BSC_MAINNET,
    '0x4aeB2D0B318e5e8ac62D5A39EB3495974951f477',
    18,
    'DTT',
    'Dark Tavern Token',
    'https://darktavern.online/',
  ),
  bvst: new Token(
    BSC_MAINNET,
    '0x592032513b329a0956b3f14d661119880F2361a6',
    18,
    'BVST',
    'BlocVest Token',
    'https://blocvest.io/',
  ),
  sweep: new Token(
    BSC_MAINNET,
    '0x09c704c1EB9245Af48f058878e72129557a10F04',
    9,
    'SWEEP',
    'Sweeptoken',
    'https://sweepproject.com/',
  ),
  cake: new Token(
    BSC_MAINNET,
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    18,
    "CAKE",
    "PancakeSwap Token",
    "https://pancakeswap.finance/"
  ),
  gmi: new Token(BSC_MAINNET, "0x93D8d25E3C9A847a5Da79F79ecaC89461FEcA846", 18, "GMI", "Gamifi", "https://gamifi.gg/"),
  tlos: new Token(
    BSC_MAINNET,
    "0xb6C53431608E626AC81a9776ac3e999c5556717c",
    18,
    "TLOS",
    "Telos",
    "https://www.telos.net/"
  ),
  beta: new Token(
    BSC_MAINNET,
    "0xBe1a001FE942f96Eea22bA08783140B9Dcc09D28",
    18,
    "BETA",
    "Beta Finance",
    "https://betafinance.org"
  ),
  nft: new Token(BSC_MAINNET, "0x1fC9004eC7E5722891f5f38baE7678efCB11d34D", 6, "NFT", "APENFT", "https://apenft.org"),
  stephero: new Token(
    BSC_MAINNET,
    "0xE8176d414560cFE1Bf82Fd73B986823B89E4F545",
    18,
    "HERO",
    "StepHero",
    "https://stephero.io/"
  ),
  pros: new Token(
    BSC_MAINNET,
    "0xEd8c8Aa8299C10f067496BB66f8cC7Fb338A3405",
    18,
    "PROS",
    "Prosper",
    "https://prosper.so/"
  ),
  qbt: new Token(
    BSC_MAINNET,
    "0x17B7163cf1Dbd286E262ddc68b553D899B93f526",
    18,
    "QBT",
    "Qubit Token",
    "https://qbt.fi/"
  ),
  cvp: new Token(
    BSC_MAINNET,
    "0x5Ec3AdBDae549Dce842e24480Eb2434769e22B2E",
    18,
    "CVP",
    "Concentrated Voting Power Token",
    "https://powerpool.finance/"
  ),
  bscdefi: new Token(
    BSC_MAINNET,
    "0x40E46dE174dfB776BB89E04dF1C47d8a66855EB3",
    18,
    "BSCDEFI",
    "BSC Defi blue chips token",
    "https://powerpool.finance/"
  ),
  busd: new Token(
    BSC_MAINNET,
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    18,
    "BUSD",
    "Binance USD",
    "https://www.paxos.com/busd/"
  ),
  dai: new Token(
    BSC_MAINNET,
    "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    18,
    "DAI",
    "Dai Stablecoin",
    "https://www.makerdao.com/"
  ),
  usdt: new Token(
    BSC_MAINNET,
    "0x55d398326f99059fF775485246999027B3197955",
    18,
    "USDT",
    "Tether USD",
    "https://tether.to/"
  ),
  btcb: new Token(
    BSC_MAINNET,
    "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    18,
    "BTCB",
    "Binance BTC",
    "https://bitcoin.org/"
  ),
  ust: new Token(
    BSC_MAINNET,
    "0x23396cF899Ca06c4472205fC903bDB4de249D6fC",
    18,
    "UST",
    "Wrapped UST Token",
    "https://mirror.finance/"
  ),
  eth: new Token(
    BSC_MAINNET,
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    18,
    "ETH",
    "Binance-Peg Ethereum Token",
    "https://ethereum.org/en/"
  ),
  usdc: new Token(
    BSC_MAINNET,
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    18,
    "USDC",
    "Binance-Peg USD Coin",
    "https://www.centre.io/usdc"
  ),
  matic: new Token(
    BSC_MAINNET,
    "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
    18,
    "MATIC",
    "Matic Token",
    "https://polygon.technology/"
  ),
  avax: new Token(
    BSC_MAINNET,
    "0x1CE0c2827e2eF14D5C4f29a091d735A204794041",
    18,
    "AVAX",
    "Binance-Peg Avalanche Token",
    "https://www.avalabs.org/"
  ),
  kalm: new Token(
    BSC_MAINNET,
    "0x4BA0057f784858a48fe351445C672FF2a3d43515",
    18,
    "KALM",
    "Kalmar Token",
    "https://kalmar.io/"
  ),
  dkt: new Token(
    BSC_MAINNET,
    "0x7Ceb519718A80Dd78a8545AD8e7f401dE4f2faA7",
    18,
    "DKT",
    "Duelist King",
    "https://duelistking.com/"
  ),
  hotcross: new Token(
    BSC_MAINNET,
    "0x4FA7163E153419E0E1064e418dd7A99314Ed27b6",
    18,
    "HOTCROSS",
    "Hotcross Token",
    "https://www.hotcross.com/"
  ),
  belt: new Token(
    BSC_MAINNET,
    "0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f",
    18,
    "BELT",
    "Belt Token",
    "https://beta.belt.fi/"
  ),
  watch: new Token(
    BSC_MAINNET,
    "0x7A9f28EB62C791422Aa23CeAE1dA9C847cBeC9b0",
    18,
    "WATCH",
    "Yieldwatch Token",
    "https://yieldwatch.net/"
  ),
  bry: new Token(
    BSC_MAINNET,
    "0xf859Bf77cBe8699013d6Dbc7C2b926Aaf307F830",
    18,
    "BRY",
    "Berry Token",
    "https://berrydata.co/"
  ),
  wsote: new Token(
    BSC_MAINNET,
    "0x541E619858737031A1244A5d0Cd47E5ef480342c",
    18,
    "wSOTE",
    "Soteria Token",
    "https://soteria.finance/"
  ),
  helmet: new Token(
    BSC_MAINNET,
    "0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8",
    18,
    "Helmet",
    "Helmet Token",
    "https://www.helmet.insure/"
  ),
  ten: new Token(
    BSC_MAINNET,
    "0xdFF8cb622790b7F92686c722b02CaB55592f152C",
    18,
    "TEN",
    "Tenet Token",
    "https://www.tenet.farm/"
  ),
  ditto: new Token(
    BSC_MAINNET,
    "0x233d91A0713155003fc4DcE0AFa871b508B3B715",
    9,
    "DITTO",
    "Ditto Token",
    "https://ditto.money/"
  ),
  blink: new Token(
    BSC_MAINNET,
    "0x63870A18B6e42b01Ef1Ad8A2302ef50B7132054F",
    6,
    "BLINK",
    "Blink Token",
    "https://blink.wink.org"
  ),
  syrup: new Token(
    BSC_MAINNET,
    "0x009cF7bC57584b7998236eff51b98A168DceA9B0",
    18,
    "SYRUP",
    "SyrupBar Token",
    "https://pancakeswap.finance/"
  ),
  pha: new Token(
    BSC_MAINNET,
    "0x0112e557d400474717056C4e6D40eDD846F38351",
    18,
    "PHA",
    "Phala Token",
    "https://phala.network"
  ),
  babycake: new Token(
    BSC_MAINNET,
    "0xdB8D30b74bf098aF214e862C90E647bbB1fcC58c",
    18,
    "BABYCAKE",
    "Baby Cake Token",
    "https://babycake.app/"
  ),
  bmon: new Token(
    BSC_MAINNET,
    "0x08ba0619b1e7A582E0BCe5BBE9843322C954C340",
    18,
    "BMON",
    "Binamon Token",
    "https://binamon.org/"
  ),
  hero: new Token(
    BSC_MAINNET,
    "0xD40bEDb44C081D2935eebA6eF5a3c8A31A1bBE13",
    18,
    "HERO",
    "Metahero Token",
    "https://metahero.io/"
  ),
  wsg: new Token(
    BSC_MAINNET,
    "0xA58950F05FeA2277d2608748412bf9F802eA4901",
    18,
    "WSG",
    "Wall Street Games Token",
    "https://wsg.gg/"
  ),
  mcrn: new Token(
    BSC_MAINNET,
    "0xacb2d47827C9813AE26De80965845D80935afd0B",
    18,
    "MCRN",
    "Macaronswap Token",
    "https://www.macaronswap.finance/"
  ),
  revv: new Token(
    BSC_MAINNET,
    "0x833F307aC507D47309fD8CDD1F835BeF8D702a93",
    18,
    "REVV",
    "REVV Token",
    "https://revvmotorsport.com/"
  ),
  skill: new Token(
    BSC_MAINNET,
    "0x154A9F9cbd3449AD22FDaE23044319D6eF2a1Fab",
    18,
    "SKILL",
    "Cryptoblades Token",
    "https://www.cryptoblades.io/"
  ),
  if: new Token(
    BSC_MAINNET,
    "0xB0e1fc65C1a741b4662B813eB787d369b8614Af1",
    18,
    "IF",
    "Impossible Finance Token",
    "https://impossible.finance/"
  ),
  sps: new Token(
    BSC_MAINNET,
    "0x1633b7157e7638C4d6593436111Bf125Ee74703F",
    18,
    "SPS",
    "Splinterlands Token",
    "https://splinterlands.com"
  ),
  chess: new Token(
    BSC_MAINNET,
    "0x20de22029ab63cf9A7Cf5fEB2b737Ca1eE4c82A6",
    18,
    "CHESS",
    "Chess Token",
    "https://tranchess.com/"
  ),
  titan: new Token(
    BSC_MAINNET,
    "0xe898EDc43920F357A93083F1d4460437dE6dAeC2",
    18,
    "TITAN",
    "Titanswap Token",
    "https://titanswap.org"
  ),
  harmony: new Token(
    BSC_MAINNET,
    "0x03fF0ff224f904be3118461335064bB48Df47938",
    18,
    "ONE",
    "Harmony ONE Token",
    "https://www.harmony.one/"
  ),
  mask: new Token(
    BSC_MAINNET,
    "0x2eD9a5C8C13b93955103B9a7C167B67Ef4d568a3",
    18,
    "MASK",
    "Mask Token",
    "https://mask.io/"
  ),
  dvi: new Token(
    BSC_MAINNET,
    "0x758FB037A375F17c7e195CC634D77dA4F554255B",
    18,
    "DVI",
    "Dvision Network Token",
    "https://dvision.network/"
  ),
  adx: new Token(
    BSC_MAINNET,
    "0x6bfF4Fb161347ad7de4A625AE5aa3A1CA7077819",
    18,
    "ADX",
    "Adex Network Token",
    "https://www.adex.network"
  ),
  bscpad: new Token(
    BSC_MAINNET,
    "0x5A3010d4d8D3B5fB49f8B6E57FB9E48063f16700",
    18,
    "BSCPAD",
    "Bscpad Token",
    "https://bscpad.com/"
  ),
  rabbit: new Token(
    BSC_MAINNET,
    "0x95a1199EBA84ac5f19546519e287d43D2F0E1b41",
    18,
    "RABBIT",
    "Rabbit Finance Token",
    "https://rabbitfinance.io/earn"
  ),
  form: new Token(
    BSC_MAINNET,
    "0x25A528af62e56512A19ce8c3cAB427807c28CC19",
    18,
    "FORM",
    "Formation Token",
    "https://formation.fi/"
  ),
  txl: new Token(
    BSC_MAINNET,
    "0x1FFD0b47127fdd4097E54521C9E2c7f0D66AafC5",
    18,
    "TXL",
    "Tixl Token",
    "https://tixl.org/"
  ),
  orbs: new Token(
    BSC_MAINNET,
    "0xeBd49b26169e1b52c04cFd19FCf289405dF55F80",
    18,
    "ORBS",
    "Orbs Token",
    "https://www.orbs.com/"
  ),
  cos: new Token(
    BSC_MAINNET,
    "0x96Dd399F9c3AFda1F194182F71600F1B65946501",
    18,
    "COS",
    "Contentos Token",
    "https://www.contentos.io/"
  ),
  bunny: new Token(
    BSC_MAINNET,
    "0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51",
    18,
    "BUNNY",
    "Pancakebunny Token",
    "https://pancakebunny.finance/"
  ),
  alice: new Token(
    BSC_MAINNET,
    "0xAC51066d7bEC65Dc4589368da368b212745d63E8",
    6,
    "ALICE",
    "My Neighbor Alice Token",
    "https://www.myneighboralice.com/"
  ),
  for: new Token(
    BSC_MAINNET,
    "0x658A109C5900BC6d2357c87549B651670E5b0539",
    18,
    "FOR",
    "Fortube Token",
    "https://www.for.tube/home"
  ),
  bux: new Token(
    BSC_MAINNET,
    "0x211FfbE424b90e25a15531ca322adF1559779E45",
    18,
    "BUX",
    "Bux Crypto Token",
    "https://getbux.com/bux-crypto/"
  ),
  nuls: new Token(
    BSC_MAINNET,
    "0x8CD6e29d3686d24d3C2018CEe54621eA0f89313B",
    8,
    "NULS",
    "Nuls Token",
    "https://www.nuls.io/"
  ),
  ramp: new Token(
    BSC_MAINNET,
    "0x8519EA49c997f50cefFa444d240fB655e89248Aa",
    18,
    "RAMP",
    "RAMP DEFI Token",
    "https://rampdefi.com/"
  ),
  bfi: new Token(
    BSC_MAINNET,
    "0x81859801b01764D4f0Fa5E64729f5a6C3b91435b",
    18,
    "BFI",
    "bearn.fi Token",
    "https://bearn.fi/"
  ),
  dexe: new Token(
    BSC_MAINNET,
    "0x039cB485212f996A9DBb85A9a75d898F94d38dA6",
    18,
    "DEXE",
    "DeXe Token",
    "https://dexe.network/"
  ),
  bel: new Token(
    BSC_MAINNET,
    "0x8443f091997f06a61670B735ED92734F5628692F",
    18,
    "BEL",
    "Bella Protocol Token",
    "https://bella.fi/"
  ),
  tpt: new Token(
    BSC_MAINNET,
    "0xECa41281c24451168a37211F0bc2b8645AF45092",
    4,
    "TPT",
    "Tokenpocket Token",
    "https://www.tokenpocket.pro/"
  ),
  xmark: new Token(
    BSC_MAINNET,
    "0x26A5dFab467d4f58fB266648CAe769503CEC9580",
    9,
    "xMARK",
    "Benchmark Protocol Token",
    "https://benchmarkprotocol.finance/"
  ),
  bmxx: new Token(
    BSC_MAINNET,
    "0x4131b87F74415190425ccD873048C708F8005823",
    18,
    "bMXX",
    "Multiplier Token",
    "https://multiplier.finance/"
  ),
  iotx: new Token(
    BSC_MAINNET,
    "0x9678E42ceBEb63F23197D726B29b1CB20d0064E5",
    18,
    "IOTX",
    "Binance-Peg IoTeX Network Token",
    "https://iotex.io/"
  ),
  bor: new Token(
    BSC_MAINNET,
    "0x92D7756c60dcfD4c689290E8A9F4d263b3b32241",
    18,
    "BOR",
    "BoringDAO Token",
    "https://www.boringdao.com/"
  ),
  bopen: new Token(
    BSC_MAINNET,
    "0xF35262a9d427F96d2437379eF090db986eaE5d42",
    18,
    "bOPEN",
    "OPEN Governance Token",
    "https://opendao.io/"
  ),
  dodo: new Token(
    BSC_MAINNET,
    "0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2",
    18,
    "DODO",
    "Dodo Token",
    "https://dodoex.io/"
  ),
  swingby: new Token(
    BSC_MAINNET,
    "0x71DE20e0C4616E7fcBfDD3f875d568492cBE4739",
    18,
    "SWINGBY",
    "Swingby Network Token",
    "https://swingby.network/"
  ),
  zee: new Token(
    BSC_MAINNET,
    "0x44754455564474A89358B2C2265883DF993b12F0",
    18,
    "ZEE",
    "Zeroswap Token",
    "https://zeroswap.io/"
  ),
  swgb: new Token(
    BSC_MAINNET,
    "0xE40255C5d7fa7ceEc5120408C78C787CECB4cfdb",
    18,
    "SWGb",
    "SWGb Token",
    "https://swirgepay.com/"
  ),
  swg: new Token(
    BSC_MAINNET,
    "0xe792f64C582698b8572AAF765bDC426AC3aEfb6B",
    18,
    "SWG",
    "SWG Token",
    "https://swirgepay.com/"
  ),
  sfp: new Token(
    BSC_MAINNET,
    "0xD41FDb03Ba84762dD66a0af1a6C8540FF1ba5dfb",
    18,
    "SFP",
    "Safepal Token",
    "https://www.safepal.io/"
  ),
  lina: new Token(
    BSC_MAINNET,
    "0x762539b45A1dCcE3D36d080F74d1AED37844b878",
    18,
    "LINA",
    "Linear Finance Token",
    "https://linear.finance/"
  ),
  lit: new Token(
    BSC_MAINNET,
    "0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723",
    18,
    "LIT",
    "Litentry Token",
    "https://www.litentry.com/"
  ),
  hget: new Token(
    BSC_MAINNET,
    "0xC7d8D35EBA58a0935ff2D5a33Df105DD9f071731",
    6,
    "HGET",
    "Hedget Token",
    "https://www.hedget.com/"
  ),
  bdo: new Token(
    BSC_MAINNET,
    "0x190b589cf9Fb8DDEabBFeae36a813FFb2A702454",
    18,
    "BDO",
    "Bdollar Token",
    "https://bdollar.fi/"
  ),
  egld: new Token(
    BSC_MAINNET,
    "0xbF7c81FFF98BbE61B40Ed186e4AfD6DDd01337fe",
    18,
    "EGLD",
    "Elrond Token",
    "https://elrond.com/"
  ),
  front: new Token(
    BSC_MAINNET,
    "0x928e55daB735aa8260AF3cEDadA18B5f70C72f1b",
    18,
    "FRONT",
    "Frontier Token",
    "https://frontier.xyz/"
  ),
  btcst: new Token(
    BSC_MAINNET,
    "0x78650B139471520656b9E7aA7A5e9276814a38e9",
    17,
    "BTCST",
    "StandardBTCHashrate Token",
    "https://www.1-b.tc/"
  ),
  bscx: new Token(
    BSC_MAINNET,
    "0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587",
    18,
    "BSCX",
    "BSCX Token",
    "https://bscex.org/"
  ),
  balbt: new Token(
    BSC_MAINNET,
    "0x72fAa679E1008Ad8382959FF48E392042A8b06f7",
    18,
    "bALBT",
    "AllianceBlock Token",
    "https://allianceblock.io/"
  ),
  asr: new Token(
    BSC_MAINNET,
    "0x80D5f92C2c8C682070C95495313dDB680B267320",
    2,
    "ASR",
    "AS Roma Token",
    "https://www.chiliz.com"
  ),
  atm: new Token(
    BSC_MAINNET,
    "0x25E9d05365c867E59C1904E7463Af9F312296f9E",
    2,
    "ATM",
    "Athletico Madrid Token",
    "https://www.chiliz.com"
  ),
  og: new Token(
    BSC_MAINNET,
    "0xf05E45aD22150677a017Fbd94b84fBB63dc9b44c",
    2,
    "OG",
    "OG Nice Token",
    "https://www.chiliz.com"
  ),
  reef: new Token(
    BSC_MAINNET,
    "0xF21768cCBC73Ea5B6fd3C687208a7c2def2d966e",
    18,
    "REEF",
    "Reef.finance Token",
    "https://reef.finance/"
  ),
  juv: new Token(
    BSC_MAINNET,
    "0xC40C9A843E1c6D01b7578284a9028854f6683b1B",
    2,
    "JUV",
    "Juventus Token",
    "https://www.chiliz.com"
  ),
  psg: new Token(
    BSC_MAINNET,
    "0xBc5609612b7C44BEf426De600B5fd1379DB2EcF1",
    2,
    "PSG",
    "Paris Saint-Germain Token",
    "https://www.chiliz.com"
  ),
  vai: new Token(
    BSC_MAINNET,
    "0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7",
    18,
    "VAI",
    "VAI Stablecoin",
    "0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7"
  ),
  unfi: new Token(
    BSC_MAINNET,
    "0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B",
    18,
    "UNFI",
    "UNFI Token",
    "https://unifiprotocol.com"
  ),
  twt: new Token(
    BSC_MAINNET,
    "0x4B0F1812e5Df2A09796481Ff14017e6005508003",
    18,
    "TWT",
    "Trust Wallet Token",
    "https://trustwallet.com/"
  ),
  hard: new Token(
    BSC_MAINNET,
    "0xf79037F6f6bE66832DE4E7516be52826BC3cBcc4",
    6,
    "HARD",
    "HARD Token",
    "https://hard.kava.io"
  ),
  broobee: new Token(
    BSC_MAINNET,
    "0xE64F5Cb844946C1F102Bd25bBD87a5aB4aE89Fbe",
    18,
    "bROOBEE",
    "ROOBEE Token",
    "https://roobee.io/"
  ),
  stax: new Token(
    BSC_MAINNET,
    "0x0Da6Ed8B13214Ff28e9Ca979Dd37439e8a88F6c4",
    18,
    "STAX",
    "StableX Token",
    "https://stablexswap.com/"
  ),
  nar: new Token(
    BSC_MAINNET,
    "0xA1303E6199b319a891b79685F0537D289af1FC83",
    18,
    "NAR",
    "Narwhalswap Token",
    "https://narwhalswap.org/"
  ),
  nya: new Token(
    BSC_MAINNET,
    "0xbFa0841F7a90c4CE6643f651756EE340991F99D5",
    18,
    "NYA",
    "Nyanswop Token",
    "https://nyanswop.org/"
  ),
  ctk: new Token(
    BSC_MAINNET,
    "0xA8c2B8eec3d368C0253ad3dae65a5F2BBB89c929",
    6,
    "CTK",
    "Certik Token",
    "https://www.certik.foundation/"
  ),
  inj: new Token(
    BSC_MAINNET,
    "0xa2B726B1145A4773F68593CF171187d8EBe4d495",
    18,
    "INJ",
    "Injective Protocol Token",
    "https://injectiveprotocol.com/"
  ),
  sxp: new Token(
    BSC_MAINNET,
    "0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A",
    18,
    "SXP",
    "Swipe Token",
    "https://swipe.io/"
  ),
  alpha: new Token(
    BSC_MAINNET,
    "0xa1faa113cbE53436Df28FF0aEe54275c13B40975",
    18,
    "ALPHA",
    "Alpha Finance Token",
    "https://alphafinance.io/"
  ),
  xvs: new Token(
    BSC_MAINNET,
    "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
    18,
    "XVS",
    "Venus Token",
    "https://venus.io/"
  ),
  sushi: new Token(
    BSC_MAINNET,
    "0x947950BcC74888a40Ffa2593C5798F11Fc9124C4",
    18,
    "SUSHI",
    "Binance-Peg SushiToken",
    "https://sushi.com/"
  ),
  comp: new Token(
    BSC_MAINNET,
    "0x52CE071Bd9b1C4B00A0b92D298c512478CaD67e8",
    18,
    "COMP",
    "Compound Finance Token",
    "https://compound.finance/"
  ),
  bifi: new Token(
    BSC_MAINNET,
    "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
    18,
    "BIFI",
    "Beefy Finance Token",
    "https://beefy.finance/"
  ),
  dusk: new Token(
    BSC_MAINNET,
    "0xB2BD0749DBE21f623d9BABa856D3B0f0e1BFEc9C",
    18,
    "DUSK",
    "Dusk Network Token",
    "https://dusk.network/"
  ),
  beth: new Token(
    BSC_MAINNET,
    "0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B",
    18,
    "BETH",
    "Binance Beacon ETH",
    "https://ethereum.org/en/eth2/beacon-chain/"
  ),
  mamzn: new Token(
    BSC_MAINNET,
    "0x3947B992DC0147D2D89dF0392213781b04B25075",
    18,
    "mAMZN",
    "Wrapped Mirror AMZN Token",
    "https://mirror.finance/"
  ),
  mgoogl: new Token(
    BSC_MAINNET,
    "0x62D71B23bF15218C7d2D7E48DBbD9e9c650B173f",
    18,
    "mGOOGL",
    "Wrapped Mirror GOOGL Token",
    "https://mirror.finance/"
  ),
  mnflx: new Token(
    BSC_MAINNET,
    "0xa04F060077D90Fe2647B61e4dA4aD1F97d6649dc",
    18,
    "mNFLX",
    "Wrapped Mirror NFLX Token",
    "https://mirror.finance/"
  ),
  mtsla: new Token(
    BSC_MAINNET,
    "0xF215A127A196e3988C09d052e16BcFD365Cd7AA3",
    18,
    "mTSLA",
    "Wrapped Mirror TSLA Token",
    "https://mirror.finance/"
  ),
  ltc: new Token(
    BSC_MAINNET,
    "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",
    18,
    "LTC",
    "Binance-Peg Litecoin Token",
    "https://litecoin.org/"
  ),
  ada: new Token(
    BSC_MAINNET,
    "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
    18,
    "ADA",
    " Binance-Peg Cardano Token",
    "https://www.cardano.org/"
  ),
  band: new Token(
    BSC_MAINNET,
    "0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18",
    18,
    "BAND",
    "Binance-Peg Band Protocol Token",
    "https://bandprotocol.com/"
  ),
  dot: new Token(
    BSC_MAINNET,
    "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
    18,
    "DOT",
    "Binance-Peg Polkadot Token",
    "https://polkadot.network/"
  ),
  eos: new Token(
    BSC_MAINNET,
    "0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6",
    18,
    "EOS",
    "Binance-Peg EOS Token",
    "https://eos.io/"
  ),
  link: new Token(
    BSC_MAINNET,
    "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
    18,
    "LINK",
    "Binance-Peg Chainlink Token",
    "https://chain.link/"
  ),
  xrp: new Token(
    BSC_MAINNET,
    "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
    18,
    "XRP",
    "Binance-Peg XRP Token",
    "https://ripple.com/xrp/"
  ),
  atom: new Token(
    BSC_MAINNET,
    "0x0Eb3a705fc54725037CC9e008bDede697f62F335",
    18,
    "ATOM",
    "Binance-Peg Cosmos Token",
    "https://cosmos.network/"
  ),
  yfii: new Token(
    BSC_MAINNET,
    "0x7F70642d88cf1C4a3a7abb072B53B929b653edA5",
    18,
    "YFII",
    "Binance-Peg YFII.finance Token",
    "https://dfi.money/#/"
  ),
  xtz: new Token(
    BSC_MAINNET,
    "0x16939ef78684453bfDFb47825F8a5F714f12623a",
    18,
    "XTZ",
    "Binance-Peg Tezos Token",
    "https://www.tezos.com/"
  ),
  bch: new Token(
    BSC_MAINNET,
    "0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf",
    18,
    "BCH",
    "Binance-Peg Bitcoin Cash Token",
    "https://bch.info/"
  ),
  yfi: new Token(
    BSC_MAINNET,
    "0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e",
    18,
    "YFI",
    "Binance-Peg yearn.finance Token",
    "https://yearn.finance/"
  ),
  uni: new Token(
    BSC_MAINNET,
    "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
    18,
    "UNI",
    "Binance-Peg Uniswap Token",
    "https://uniswap.org/"
  ),
  fil: new Token(
    BSC_MAINNET,
    "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153",
    18,
    "FIL",
    "Binance-Peg Filecoin Token",
    "https://filecoin.io/"
  ),
  bake: new Token(
    BSC_MAINNET,
    "0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5",
    18,
    "BAKE",
    "Bakeryswap Token",
    "https://www.bakeryswap.org/"
  ),
  burger: new Token(
    BSC_MAINNET,
    "0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f",
    18,
    "BURGER",
    "Burgerswap Token",
    "https://burgerswap.org/"
  ),
  bdigg: new Token(
    BSC_MAINNET,
    "0x5986D5c77c65e5801a5cAa4fAE80089f870A71dA",
    18,
    "bDIGG",
    "Badger Sett Digg Token",
    "https://badger.finance/"
  ),
  bbadger: new Token(
    BSC_MAINNET,
    "0x1F7216fdB338247512Ec99715587bb97BBf96eae",
    18,
    "bBadger",
    "Badger Sett Badger Token",
    "https://badger.finance/"
  ),
  trade: new Token(
    BSC_MAINNET,
    "0x7af173F350D916358AF3e218Bdf2178494Beb748",
    18,
    "TRADE",
    "Unitrade Token",
    "https://unitrade.app/"
  ),
  pnt: new Token(
    BSC_MAINNET,
    "0xdaacB0Ab6Fb34d24E8a67BfA14BF4D95D4C7aF92",
    18,
    "PNT",
    "pNetwork Token",
    "https://ptokens.io/"
  ),
  mir: new Token(
    BSC_MAINNET,
    "0x5B6DcF557E2aBE2323c48445E8CC948910d8c2c9",
    18,
    "MIR",
    "Mirror Protocol Token",
    "https://mirror.finance/"
  ),
  pbtc: new Token(
    BSC_MAINNET,
    "0xeD28A457A5A76596ac48d87C0f577020F6Ea1c4C",
    18,
    "pBTC",
    "pTokens BTC Token",
    "https://ptokens.io/"
  ),
  lto: new Token(
    BSC_MAINNET,
    "0x857B222Fc79e1cBBf8Ca5f78CB133d1b7CF34BBd",
    18,
    "LTO",
    "LTO Network Token",
    "https://ltonetwork.com/"
  ),
  pcws: new Token(
    BSC_MAINNET,
    "0xbcf39F0EDDa668C58371E519AF37CA705f2bFcbd",
    18,
    "pCWS",
    "PolyCrowns Token",
    "https://game.seascape.network/"
  ),
  zil: new Token(
    BSC_MAINNET,
    "0xb86AbCb37C3A4B64f74f59301AFF131a1BEcC787",
    12,
    "ZIL",
    "Zilliqa Token",
    "https://www.zilliqa.com/"
  ),
  lien: new Token(
    BSC_MAINNET,
    "0x5d684ADaf3FcFe9CFb5ceDe3abf02F0Cdd1012E3",
    8,
    "LIEN",
    "Lien Finance Token",
    "https://lien.finance/"
  ),
  swth: new Token(
    BSC_MAINNET,
    "0x250b211EE44459dAd5Cd3bCa803dD6a7EcB5d46C",
    8,
    "SWTH",
    "Switcheo Network Token",
    "https://switcheo.network/"
  ),
  dft: new Token(
    BSC_MAINNET,
    "0x42712dF5009c20fee340B245b510c0395896cF6e",
    18,
    "DFT",
    "Dfuture Token",
    "https://www.dfuture.com/home"
  ),
  gum: new Token(
    BSC_MAINNET,
    "0xc53708664b99DF348dd27C3Ac0759d2DA9c40462",
    18,
    "GUM",
    "GourmetGalaxy Token",
    "https://gourmetgalaxy.io/"
  ),
  dego: new Token(
    BSC_MAINNET,
    "0x3FdA9383A84C05eC8f7630Fe10AdF1fAC13241CC",
    18,
    "DEGO",
    "Dego Finance Token",
    "https://bsc.dego.finance/home"
  ),
  nrv: new Token(
    BSC_MAINNET,
    "0x42F6f551ae042cBe50C739158b4f0CAC0Edb9096",
    18,
    "NRV",
    "Nerve Finance Token",
    "https://nerve.fi/"
  ),
  easy: new Token(
    BSC_MAINNET,
    "0x7C17c8bED8d14bAccE824D020f994F4880D6Ab3B",
    18,
    "EASY",
    "EASY Token",
    "https://easyfi.network/"
  ),
  oddz: new Token(
    BSC_MAINNET,
    "0xCD40F2670CF58720b694968698A5514e924F742d",
    18,
    "ODDZ",
    "Oddz Token",
    "https://oddz.fi/"
  ),
  hoo: new Token(BSC_MAINNET, "0xE1d1F66215998786110Ba0102ef558b22224C016", 8, "HOO", "Hoo Token", "https://hoo.com/"),
  apys: new Token(
    BSC_MAINNET,
    "0x37dfACfaeDA801437Ff648A1559d73f4C40aAcb7",
    18,
    "APYS",
    "APY Swap Token",
    "https://apyswap.com/"
  ),
  bondly: new Token(
    BSC_MAINNET,
    "0x96058f8C3e16576D9BD68766f3836d9A33158f89",
    18,
    "BONDLY",
    "Bondly Token",
    "https://www.bondly.finance/"
  ),
  tko: new Token(
    BSC_MAINNET,
    "0x9f589e3eabe42ebC94A44727b3f3531C0c877809",
    18,
    "TKO",
    "Tokocrypto Token",
    "https://www.tokocrypto.com/"
  ),
  itam: new Token(
    BSC_MAINNET,
    "0x04C747b40Be4D535fC83D09939fb0f626F32800B",
    18,
    "ITAM",
    "Itam Network Token",
    "https://itam.network/"
  ),
  arpa: new Token(
    BSC_MAINNET,
    "0x6F769E65c14Ebd1f68817F5f1DcDb61Cfa2D6f7e",
    18,
    "ARPA",
    "Arpachain Token",
    "https://arpachain.io/"
  ),
  eps: new Token(
    BSC_MAINNET,
    "0xA7f552078dcC247C2684336020c03648500C6d9F",
    18,
    "EPS",
    "Ellipsis Finance Token",
    "https://ellipsis.finance/"
  ),
  jgn: new Token(
    BSC_MAINNET,
    "0xC13B7a43223BB9Bf4B69BD68Ab20ca1B79d81C75",
    18,
    "JGN",
    "Juggernaut DeFi Token",
    "https://jgndefi.com/"
  ),
  tlm: new Token(
    BSC_MAINNET,
    "0x2222227E22102Fe3322098e4CBfE18cFebD57c95",
    4,
    "TLM",
    "Alien Worlds Trilium Token",
    "https://alienworlds.io/"
  ),
  perl: new Token(
    BSC_MAINNET,
    "0x0F9E4D49f25de22c2202aF916B681FBB3790497B",
    18,
    "PERL",
    "Perlin",
    "https://perlinx.finance/"
  ),
  alpa: new Token(
    BSC_MAINNET,
    "0xc5E6689C9c8B02be7C49912Ef19e79cF24977f03",
    18,
    "ALPA",
    "AlpaToken",
    "https://bsc.alpaca.city/"
  ),
  hzn: new Token(
    BSC_MAINNET,
    "0xC0eFf7749b125444953ef89682201Fb8c6A917CD",
    18,
    "HZN",
    "Horizon Protocol Token",
    "https://horizonprotocol.com/"
  ),
  suter: new Token(
    BSC_MAINNET,
    "0x4CfbBdfBd5BF0814472fF35C72717Bd095ADa055",
    18,
    "SUTER",
    "Suterusu Token",
    "https://shield.suterusu.io/"
  ),
  cgg: new Token(
    BSC_MAINNET,
    "0x1613957159E9B0ac6c80e824F7Eea748a32a0AE2",
    18,
    "CGG",
    "pTokens CGG Token",
    "https://chainguardians.io/"
  ),
  fina: new Token(
    BSC_MAINNET,
    "0x426c72701833fdDBdFc06c944737C6031645c708",
    18,
    "FINA",
    "Defina Finance",
    "https://defina.finance/"
  ),
  dar: new Token(
    BSC_MAINNET,
    "0x23CE9e926048273eF83be0A3A8Ba9Cb6D45cd978",
    6,
    "DAR",
    "Mines of Dalarnia",
    "https://www.minesofdalarnia.com/"
  ),
  xwg: new Token(
    BSC_MAINNET,
    "0x6b23C89196DeB721e6Fd9726E6C76E4810a464bc",
    18,
    "XWG",
    "X World Games",
    "https://xwg.games/"
  ),
  porto: new Token(
    BSC_MAINNET,
    "0x49f2145d6366099e13B10FbF80646C0F377eE7f6",
    8,
    "PORTO",
    "FC Porto Fan Token",
    "https://launchpad.binance.com/en/subscription/PORTO_BNB"
  ),
  qi: new Token(BSC_MAINNET, "0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5", 18, "QI", "BENQI", "https://benqi.fi/"),
  bcoin: new Token(
    BSC_MAINNET,
    "0x00e1656e45f18ec6747F5a8496Fd39B50b38396D",
    18,
    "BCOIN",
    "Bomb Crypto",
    "https://bombcrypto.io/"
  ),
  santos: new Token(
    BSC_MAINNET,
    "0xA64455a4553C9034236734FadDAddbb64aCE4Cc7",
    8,
    "SANTOS",
    "FC Santos Fan Token",
    "https://launchpad.binance.com/en/launchpool/SANTOS_BNB"
  ),
  idia: new Token(
    BSC_MAINNET,
    "0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89",
    18,
    "IDIA",
    "Impossible Decentralized Incubator Access Token",
    "https://impossible.finance/"
  ),
  dpt: new Token(
    BSC_MAINNET,
    "0xE69cAef10A488D7AF31Da46c89154d025546e990",
    18,
    "DPT",
    "Diviner Protocol",
    "https://diviner.finance/"
  ),
  thg: new Token(
    BSC_MAINNET,
    "0x9fD87aEfe02441B123c3c32466cD9dB4c578618f",
    18,
    "THG",
    "Thetan Gem",
    "https://thetanarena.com/"
  ),
  high: new Token(
    BSC_MAINNET,
    "0x5f4Bde007Dc06b867f86EBFE4802e34A1fFEEd63",
    18,
    "HIGH",
    "Highstreet Token",
    "https://highstreet.market/"
  ),
  woop: new Token(
    BSC_MAINNET,
    "0x8b303d5BbfBbf46F1a4d9741E491e06986894e18",
    18,
    "WOOP",
    "Woonkly Power",
    "https://www.woonkly.com/"
  ),
  aog: new Token(
    BSC_MAINNET,
    "0x40C8225329Bd3e28A043B029E0D07a5344d2C27C",
    18,
    "AOG",
    "AgeOfGods",
    "https://ageofgods.net/"
  ),
  "8pay": new Token(
    BSC_MAINNET,
    "0xFeea0bDd3D07eb6FE305938878C0caDBFa169042",
    18,
    "8PAY",
    "8PAY Network",
    "https://8pay.network/"
  ),
  froyo: new Token(
    BSC_MAINNET,
    "0xe369fec23380f9F14ffD07a1DC4b7c1a9fdD81c9",
    18,
    "FROYO",
    "Froyo Games",
    "https://froyo.games/"
  ),
  apx: new Token(
    BSC_MAINNET,
    "0x78F5d389F5CDCcFc41594aBaB4B0Ed02F31398b3",
    18,
    "APX",
    "ApolloX Token",
    "https://www.apollox.finance/"
  ),
  fuse: new Token(
    BSC_MAINNET,
    "0x5857c96DaE9cF8511B08Cb07f85753C472D36Ea3",
    18,
    "FUSE",
    "Fuse Token",
    "https://fuse.io/"
  ),
  ertha: new Token(
    BSC_MAINNET,
    "0x62823659d09F9F9D2222058878f89437425eB261",
    18,
    "ERTHA",
    "Ertha Token",
    "https://ertha.io/"
  ),
  raca: new Token(
    BSC_MAINNET,
    "0x12BB890508c125661E03b09EC06E404bc9289040",
    18,
    "RACA",
    "Radio Caca V2",
    "https://www.radiocaca.com/#/home"
  ),
  ach: new Token(
    BSC_MAINNET,
    "0xBc7d6B50616989655AfD682fb42743507003056D",
    8,
    "ACH",
    "Alchemy Token",
    "https://alchemytech.io/"
  ),
  era: new Token(
    BSC_MAINNET,
    "0x6f9F0c4ad9Af7EbD61Ac5A1D4e0F2227F7B0E5f9",
    18,
    "ERA",
    "Era Token",
    "https://www.era7.io/"
  ),
  duet: new Token(
    BSC_MAINNET,
    "0x95EE03e1e2C5c4877f9A298F1C0D6c98698FAB7B",
    18,
    "DUET",
    "Duet Governance Token",
    "https://duet.finance"
  ),
  gmt: new Token(
    BSC_MAINNET,
    "0x3019BF2a2eF8040C242C9a4c5c4BD4C81678b2A1",
    8,
    "GMT",
    "Green Metaverse Token",
    "https://www.stepn.com/"
  ),
  bsw: new Token(BSC_MAINNET, "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1", 18, "BSW", "Biswap", "https://biswap.org/"),
  pex: new Token(
    BSC_MAINNET,
    "0x6a0b66710567b6beb81A71F7e9466450a91a384b",
    18,
    "PEX",
    "PearDAO",
    "https://peardao.io/"
  ),
  tinc: new Token(
    BSC_MAINNET,
    "0x05aD6E30A855BE07AfA57e08a4f30d00810a402e",
    18,
    "TINC",
    "Tiny Coin",
    "https://tinyworlds.io/"
  ),
  happy: new Token(
    BSC_MAINNET,
    "0xF5d8A096CcCb31b9D7bcE5afE812BE23e3D4690d",
    18,
    "Happy",
    "HappyFans",
    "https://happyfans.club/"
  ),
  wzrd: new Token(
    BSC_MAINNET,
    "0xFa40d8FC324bcdD6Bbae0e086De886c571C225d4",
    18,
    "WZRD",
    "Wizardia Token",
    "https://wizardia.io/"
  ),
  ceek: new Token(
    BSC_MAINNET,
    "0xe0F94Ac5462997D2BC57287Ac3a3aE4C31345D66",
    18,
    "CEEK",
    "CEEK",
    "https://www.ceek.com/"
  ),
  abnbc: new Token(
    BSC_MAINNET,
    "0xE85aFCcDaFBE7F2B096f268e31ccE3da8dA2990A",
    18,
    "aBNBc",
    "Ankr BNB Reward Bearing Certificate",
    "https://www.ankr.com/"
  ),
  gal: new Token(
    BSC_MAINNET,
    "0xe4Cc45Bb5DBDA06dB6183E8bf016569f40497Aa5",
    18,
    "GAL",
    "Project Galaxy",
    "https://galaxy.eco/"
  ),
  xcn: new Token(BSC_MAINNET, "0x7324c7C0d95CEBC73eEa7E85CbAac0dBdf88a05b", 18, "XCN", "Chain", "https://chain.com/"),
  metis: new Token(
    BSC_MAINNET,
    "0xe552Fb52a4F19e44ef5A967632DBc320B0820639",
    18,
    "Metis",
    "Metis Token",
    "https://www.metis.io/"
  ),
  MIX: new Token(
    BSC_MAINNET,
    "0xB67754f5b4C704A24d2db68e661b2875a4dDD197",
    18,
    "MIX",
    "Mix Token",
    "https://mixie.chainguardians.io/"
  ),
  hakka: new Token(
    BSC_MAINNET,
    "0x1D1eb8E8293222e1a29d2C0E4cE6C0Acfd89AaaC",
    18,
    "HAKKA",
    "Hakka Token",
    "https://hakka.finance/"
  ),
  xed: new Token(
    BSC_MAINNET,
    "0x5621b5A3f4a8008c4CCDd1b942B121c8B1944F1f",
    18,
    "XED",
    "Exeedme Token",
    "https://www.exeedme.com/"
  ),
  τbtc: new Token(
    BSC_MAINNET,
    "0x2cD1075682b0FCCaADd0Ca629e138E64015Ba11c",
    9,
    "τBTC",
    "τBitcoin Token",
    "https://www.btcst.finance/"
  ),
  alpaca: new Token(
    BSC_MAINNET,
    "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
    18,
    "ALPACA",
    "AlpacaToken",
    "https://www.alpacafinance.org/"
  ),
  dfd: new Token(
    BSC_MAINNET,
    "0x9899a98b222fCb2f3dbee7dF45d943093a4ff9ff",
    18,
    "DFD",
    "DefiDollar DAO",
    "https://dusd.finance/"
  ),
  lmt: new Token(
    BSC_MAINNET,
    "0x9617857E191354dbEA0b714d78Bc59e57C411087",
    18,
    "LMT",
    "Lympo Market Token",
    "https://lympo.io/lmt/"
  ),
  btt: new Token(
    BSC_MAINNET,
    "0x8595F9dA7b868b1822194fAEd312235E43007b49",
    18,
    "BTT",
    "Binance-Peg BitTorrent Token",
    "https://www.bittorrent.com/"
  ),
  trx: new Token(
    BSC_MAINNET,
    "0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B",
    18,
    "TRX",
    "TRON Token",
    "https://tron.network/"
  ),
  win: new Token(
    BSC_MAINNET,
    "0xaeF0d72a118ce24feE3cD1d43d383897D05B4e99",
    18,
    "WIN",
    "WIN Token",
    "https://winklink.org/"
  ),
  mcoin: new Token(
    BSC_MAINNET,
    "0x49022089e78a8D46Ec87A3AF86a1Db6c189aFA6f",
    18,
    "MCOIN",
    "Wrapped Mirror COIN Token",
    "https://mirror.finance/"
  ),
  math: new Token(
    BSC_MAINNET,
    "0xF218184Af829Cf2b0019F8E6F0b2423498a36983",
    18,
    "MATH",
    "MATH Token",
    "https://mathwallet.org/"
  ),
  kun: new Token(
    BSC_MAINNET,
    "0x1A2fb0Af670D0234c2857FaD35b789F8Cb725584",
    18,
    "KUN",
    "QIAN governance token",
    "https://chemix.io/home"
  ),
  qsd: new Token(
    BSC_MAINNET,
    "0x07AaA29E63FFEB2EBf59B33eE61437E1a91A3bb2",
    18,
    "QSD",
    "QIAN second generation dollar",
    "https://chemix.io/home"
  ),
  hyfi: new Token(
    BSC_MAINNET,
    "0x9a319b959e33369C5eaA494a770117eE3e585318",
    18,
    "HYFI",
    "HYFI Token",
    "https://hyfi.pro/#/"
  ),
  oin: new Token(
    BSC_MAINNET,
    "0x658E64FFcF40D240A43D52CA9342140316Ae44fA",
    8,
    "OIN",
    "oinfinance Token",
    "https://oin.finance/"
  ),
  doge: new Token(
    BSC_MAINNET,
    "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    8,
    "DOGE",
    "Binance-Peg Dogecoin",
    "https://dogecoin.com/"
  ),
  fine: new Token(
    BSC_MAINNET,
    "0x4e6415a5727ea08aAE4580057187923aeC331227",
    18,
    "FINE",
    "Refinable Token",
    "https://refinable.com/"
  ),
  one: new Token(
    BSC_MAINNET,
    "0x04BAf95Fd4C52fd09a56D840bAEe0AB8D7357bf0",
    18,
    "ONE",
    "BigONE Token",
    "https://www.bigone.com/"
  ),
  pmon: new Token(
    BSC_MAINNET,
    "0x1796ae0b0fa4862485106a0de9b654eFE301D0b2",
    18,
    "PMON",
    "Polkamon Token",
    "https://polkamon.com/"
  ),
  τdoge: new Token(
    BSC_MAINNET,
    "0xe550a593d09FBC8DCD557b5C88Cea6946A8b404A",
    8,
    "τDOGE",
    "τDogecoin",
    "https://www.btcst.finance/"
  ),
  btr: new Token(
    BSC_MAINNET,
    "0x5a16E8cE8cA316407c6E6307095dc9540a8D62B3",
    18,
    "BTR",
    "Bitrue Token",
    "https://www.bitrue.com/"
  ),
  ubxt: new Token(
    BSC_MAINNET,
    "0xBbEB90cFb6FAFa1F69AA130B7341089AbeEF5811",
    18,
    "UBXT",
    "UpBots Token",
    "https://upbots.com/"
  ),
  wmass: new Token(
    BSC_MAINNET,
    "0x7e396BfC8a2f84748701167c2d622F041A1D7a17",
    8,
    "WMASS",
    "Wrapped MASS Token",
    "https://massnet.org/en/"
  ),
  rfox: new Token(
    BSC_MAINNET,
    "0x0a3A21356793B49154Fd3BbE91CBc2A16c0457f5",
    18,
    "RFOX",
    "RFOX Token",
    "https://www.redfoxlabs.io/"
  ),
  xend: new Token(
    BSC_MAINNET,
    "0x4a080377f83D669D7bB83B3184a8A5E61B500608",
    18,
    "XEND",
    "XEND Token",
    "https://xend.finance/"
  ),
  cyc: new Token(
    BSC_MAINNET,
    "0x810EE35443639348aDbbC467b33310d2AB43c168",
    18,
    "CYC",
    "CYC Token",
    "https://cyclone.xyz/"
  ),
  chr: new Token(
    BSC_MAINNET,
    "0xf9CeC8d50f6c8ad3Fb6dcCEC577e05aA32B224FE",
    6,
    "CHR",
    "Chroma Token",
    "https://chromia.com/"
  ),
  deri: new Token(
    BSC_MAINNET,
    "0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5",
    18,
    "DERI",
    "Deri Token",
    "https://deri.finance/#/index"
  ),
  well: new Token(
    BSC_MAINNET,
    "0xf07a32Eb035b786898c00bB1C64d8c6F8E7a46D5",
    18,
    "WELL",
    "BitWell Token",
    "https://www.bitwellex.com/"
  ),
  wex: new Token(
    BSC_MAINNET,
    "0xa9c41A46a6B3531d28d5c32F6633dd2fF05dFB90",
    18,
    "WEX",
    "WaultSwap Token",
    "https://wault.finance/"
  ),
  waultx: new Token(
    BSC_MAINNET,
    "0xB64E638E60D154B43f660a6BF8fD8a3b249a6a21",
    18,
    "WAULTx",
    "Wault Token",
    "https://wault.finance/"
  ),
  popen: new Token(
    BSC_MAINNET,
    "0xaBaE871B7E3b67aEeC6B46AE9FE1A91660AadAC5",
    18,
    "pOPEN",
    "OPEN Governance Token",
    "https://opendao.io/"
  ),
  ez: new Token(
    BSC_MAINNET,
    "0x5512014efa6Cd57764Fa743756F7a6Ce3358cC83",
    18,
    "EZ",
    "Easy V2 Token",
    "https://easyfi.network/"
  ),
  vrt: new Token(
    BSC_MAINNET,
    "0x5F84ce30DC3cF7909101C69086c50De191895883",
    18,
    "VRT",
    "Venus Reward Token",
    "https://venus.io/"
  ),
  tusd: new Token(
    BSC_MAINNET,
    "0x14016E85a25aeb13065688cAFB43044C2ef86784",
    18,
    "TUSD",
    "Binance-Peg TrueUSD Token",
    "https://www.trueusd.com/"
  ),
  mtrg: new Token(
    BSC_MAINNET,
    "0xBd2949F67DcdC549c6Ebe98696449Fa79D988A9F",
    18,
    "MTRG",
    "Wrapped MTRG Token",
    "https://www.meter.io/"
  ),
  ktn: new Token(
    BSC_MAINNET,
    "0xDAe6c2A48BFAA66b43815c5548b10800919c993E",
    18,
    "KTN",
    "Kattana Token",
    "https://kattana.io/"
  ),
  qkc: new Token(
    BSC_MAINNET,
    "0xA1434F1FC3F437fa33F7a781E041961C0205B5Da",
    18,
    "QKC",
    "QuarkChain Token",
    "https://quarkchain.io/"
  ),
  bcfx: new Token(
    BSC_MAINNET,
    "0x045c4324039dA91c52C55DF5D785385Aab073DcF",
    18,
    "bCFX",
    "BSC Conflux Token",
    "https://www.confluxnetwork.org/"
  ),
  mx: new Token(
    BSC_MAINNET,
    "0x9F882567A62a5560d147d64871776EeA72Df41D3",
    18,
    "MX",
    "MX Token",
    "https://www.mxc.com/"
  ),
  ata: new Token(
    BSC_MAINNET,
    "0xA2120b9e674d3fC3875f415A7DF52e382F141225",
    18,
    "ATA",
    "Automata Token",
    "https://www.ata.network/"
  ),
  mbox: new Token(
    BSC_MAINNET,
    "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377",
    18,
    "MBOX",
    "Mobox Token",
    "https://www.mobox.io/#/"
  ),
  boring: new Token(
    BSC_MAINNET,
    "0xffEecbf8D7267757c2dc3d13D730E97E15BfdF7F",
    18,
    "BORING",
    "BoringDAO Token",
    "https://www.boringdao.com/"
  ),
  marsh: new Token(
    BSC_MAINNET,
    "0x2FA5dAF6Fe0708fBD63b1A7D1592577284f52256",
    18,
    "MARSH",
    "Unmarshal Token",
    "https://unmarshal.io/"
  ),
  ampl: new Token(
    BSC_MAINNET,
    "0xDB021b1B247fe2F1fa57e0A87C748Cc1E321F07F",
    9,
    "AMPL",
    "AMPL Token",
    "https://www.ampleforth.org/"
  ),
  o3: new Token(
    BSC_MAINNET,
    "0xEe9801669C6138E84bD50dEB500827b776777d28",
    18,
    "O3",
    "O3 Swap Token",
    "https://o3swap.com/"
  ),
  hai: new Token(
    BSC_MAINNET,
    "0xaA9E582e5751d703F85912903bacADdFed26484C",
    8,
    "HAI",
    "Hacken Token",
    "https://hacken.io/"
  ),
  htb: new Token(
    BSC_MAINNET,
    "0x4e840AADD28DA189B9906674B4Afcb77C128d9ea",
    18,
    "HTB",
    "Hotbit Token",
    "https://www.hotbit.io/"
  ),
  woo: new Token(
    BSC_MAINNET,
    "0x4691937a7508860F876c9c0a2a617E7d9E945D4B",
    18,
    "WOO",
    "Wootrade Network Token",
    "https://woo.network/"
  ),
  safemoon: new Token(
    BSC_MAINNET,
    "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3",
    9,
    "SAFEMOON",
    "Safemoon Token",
    "https://safemoon.net/"
  ),
  axs: new Token(
    BSC_MAINNET,
    "0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0",
    18,
    "AXS",
    "Binance-Pegged Axie Infinity Shard",
    "https://axieinfinity.com/"
  ),
  c98: new Token(
    BSC_MAINNET,
    "0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6",
    18,
    "c98",
    "Coin98 Token",
    "https://coin98.com/"
  ),
  pots: new Token(
    BSC_MAINNET,
    "0x3Fcca8648651E5b974DD6d3e50F61567779772A8",
    18,
    "POTS",
    "Moonpot Token",
    "https://moonpot.com/"
  ),
  gnt: new Token(
    BSC_MAINNET,
    "0xF750A26EB0aCf95556e8529E72eD530f3b60f348",
    18,
    "GNT",
    "GreenTrust Token",
    "https://www.greentrusttoken.com/"
  ),
  rusd: new Token(
    BSC_MAINNET,
    "0x07663837218A003e66310a01596af4bf4e44623D",
    18,
    "rUSD",
    "rUSD Token",
    "https://appv2.rampdefi.com/#/"
  ),
  bp: new Token(
    BSC_MAINNET,
    "0xACB8f52DC63BB752a51186D1c55868ADbFfEe9C1",
    18,
    "BP",
    "BunnyPark Token",
    "https://www.bunnypark.com/"
  ),
  sfund: new Token(
    BSC_MAINNET,
    "0x477bC8d23c634C154061869478bce96BE6045D12",
    18,
    "SFUND",
    "Seedify Fund Token",
    "https://seedify.fund/"
  ),
  naos: new Token(
    BSC_MAINNET,
    "0x758d08864fB6cCE3062667225ca10b8F00496cc2",
    18,
    "NAOS",
    "NAOSToken",
    "https://naos.finance/"
  ),
  cart: new Token(
    BSC_MAINNET,
    "0x5C8C8D560048F34E5f7f8ad71f2f81a89DBd273e",
    18,
    "CART",
    "CryptoArt.ai",
    "https://cryptoart.ai/"
  ),
  light: new Token(
    BSC_MAINNET,
    "0x037838b556d9c9d654148a284682C55bB5f56eF4",
    18,
    "LIGHT",
    "Lightning",
    "https://lightningprotocol.finance/"
  ),
  rpg: new Token(
    BSC_MAINNET,
    "0xc2098a8938119A52B1F7661893c0153A6CB116d5",
    18,
    "RPG",
    "Rangers Protocol",
    "https://www.rangersprotocol.com/"
  ),
  mcb: new Token(
    BSC_MAINNET,
    "0x5fE80d2CD054645b9419657d3d10d26391780A7B",
    18,
    "MCB",
    "MCDEX",
    "https://mcdex.io/homepage/"
  ),
  lazio: new Token(
    BSC_MAINNET,
    "0x77d547256A2cD95F32F67aE0313E450Ac200648d",
    8,
    "LAZIO",
    "FC Lazio Fan Token",
    "https://launchpad.binance.com/en/subscription/LAZIO_BNB"
  ),
  arv: new Token(BSC_MAINNET, "0x6679eB24F59dFe111864AEc72B443d1Da666B360", 8, "ARV", "ARIVA", "https://ariva.digital"),
  banana: new Token(
    BSC_MAINNET,
    "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
    18,
    "BANANA",
    "ApeSwap",
    "https://apeswap.finance"
  ),
};
export default tokens;
