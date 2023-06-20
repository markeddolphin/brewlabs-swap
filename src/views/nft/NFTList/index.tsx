import { useState } from "react";
import SelectionPanel from "./SelectionPanel";
import NFTPanel from "./NFTPanel";
import { tokens } from "config/constants/tokens";

const NFTList = () => {
  const [criteria, setCriteria] = useState("");
  const [curFilter, setCurFilter] = useState(0);
  const nfts = [
    {
      name: "BREWLABS NFT",
      tokenId: "321",
      rarity: "common",
      isStaked: true,
      apr: 12.52,
      earning: {
        amount: 0.01,
        currency: tokens[1].eth,
      },
      chainId: 1,
      logo: "/images/nfts/brewlabs-nft.png",
    },
    {
      name: "BREWLABS NFT",
      tokenId: "321",
      rarity: "rare",
      isStaked: false,
      chainId: 1,
      logo: "/images/nfts/brewlabs-nft.png",
    },
  ];
  const rarities = ["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"];
  const fileredNFTs = nfts.filter((data) => data.rarity === rarities[curFilter].toLowerCase() || curFilter === 0);
  return (
    <div className="flex flex-col">
      <SelectionPanel
        curFilter={curFilter}
        setCurFilter={setCurFilter}
        criteria={criteria}
        setCriteria={setCriteria}
        nfts={nfts}
      />
      <div className="mt-0.5" />
      <NFTPanel nfts={fileredNFTs} />
      <div className="mt-[84px]" />
    </div>
  );
};

export default NFTList;
