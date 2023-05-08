import { useState } from "react";
import axios from "axios";
import { formatIPFSString } from "utils/functions";
import multicall from "utils/multicall";
import NFTABI from "config/abi/NFTABI.json";
import { AnkrProvider } from "@ankr.com/ankr.js";
import { useSlowRefreshEffect } from "./useRefreshEffect";

const useWalletNFTs = (account: string) => {
  const [bscNFTs, setBSCNFTs] = useState([]);
  const [ethNFTs, setETHNFTs] = useState([]);

  async function fetchBaseData(address, chainId) {
    try {
      let calls = [
        {
          name: "name",
          address,
        },
      ];

      const name = await multicall(NFTABI, calls, chainId);
      return name[0][0];
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  async function fetchBSCNFTs() {
    try {
      const provider = new AnkrProvider();

      // Get token balances of address with USD prices among multiple chains
      let nfts = [],
        pageSize = 0,
        nextPageToken = "";
      do {
        const result = await provider.getNFTsByOwner({
          walletAddress: account,
          blockchain: "bsc",
          pageSize: 50,
          pageToken: nextPageToken,
        });
        nextPageToken = result.nextPageToken;
        pageSize = result.assets.length;
        nfts.push(...result.assets);
      } while (pageSize === 50);
      let ownedNFTs = await Promise.all(
        nfts.map(async (data) => {
          const filterNFTs = nfts.filter((nft) => nft.contractAddress === data.contractAddress);

          let logo = data.imageUrl;
          logo = formatIPFSString(logo);

          let collectionName = data.collectionName;
          if (collectionName === "") collectionName = await fetchBaseData(data.contractAddress, 56);
          collectionName = collectionName === "" ? "Unknown" : collectionName;

          let name = data.name === "" ? collectionName : data.name;
          name = name === "" ? "Unknown" : name;

          return {
            collectionName,
            address: data.contractAddress,
            description: "",
            logo,
            chainId: 56,
            balance: filterNFTs.length,
            name,
            tokenId: data.tokenId,
          };
        })
      );
      setBSCNFTs(ownedNFTs);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchETHNFTs() {
    try {
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/bXqwnLZHuGoI2wcSnabNiQJL0K83OTnQ`;
      const url = `${baseURL}/getNFTs/?owner=${account}`;

      const config = {
        method: "get",
        url: url,
      };

      // Make the request and print the formatted response:
      const response = await axios(config);
      let _ownedNFTs = response.data.ownedNfts,
        ownedNFTs = [];
      for (let i = 0; i < _ownedNFTs.length; i++) {
        const data = _ownedNFTs[i];

        let logo = data.media[0].raw;
        logo = formatIPFSString(logo);

        let collectionName = data.contractMetadata.name;
        if (collectionName === "") collectionName = await fetchBaseData(data.contractAddress, 56);
        collectionName = collectionName === "" ? "Unknown" : collectionName;

        let name = data.title === "" ? collectionName : data.title;
        name = name === "" ? "Unknown" : name;

        const filterNFTs = _ownedNFTs.filter((nft) => nft.contract.address === data.contract.address);
        ownedNFTs.push({
          collectionName,
          address: data.contract.address,
          description: data.description,
          logo,
          chainId: 1,
          balance: filterNFTs.length,
          name,
          tokenId: parseInt(_ownedNFTs[i].id.tokenId),
        });
      }
      setETHNFTs(ownedNFTs);
    } catch (e) {
      console.log(e);
    }
  }
  useSlowRefreshEffect(() => {
    if(!account) return;
    fetchBSCNFTs();
    fetchETHNFTs();
  }, [account]);
  return [...bscNFTs, ...ethNFTs];
};

export default useWalletNFTs;
