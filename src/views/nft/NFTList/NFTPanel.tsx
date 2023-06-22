import NFTCard from "./NFTCard";

const NFTPanel = ({ nfts }: { nfts: any }) => {
  return nfts.length ? (
    <div className="max-h-[600px] overflow-y-scroll xl:max-h-[305px]">
      {nfts.map((data: any, i: number) => {
        return <NFTCard nft={data} key={i} />;
      })}
    </div>
  ) : (
    <div className="justify-center flex h-[100px] items-center text-lg">No NFTs Show</div>
  );
};

export default NFTPanel;
