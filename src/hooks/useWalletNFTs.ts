import { useState } from "react";
import axios from "axios";
import { formatIPFSString } from "utils/functions";
import multicall from "utils/multicall";
import NFTABI from "config/abi/NFTABI.json";
import { AnkrProvider } from "@ankr.com/ankr.js";
import { useSlowRefreshEffect } from "./useRefreshEffect";
import { UNMARSHAL_API_KEYS } from "config";

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
      let nfts = [],
        result,
        offset = 0,
        apiKeyIndex = 0;
      do {
        const query = new URLSearchParams({
          offset: offset.toString(),
          pageSize: "100",
          auth_key: UNMARSHAL_API_KEYS[apiKeyIndex],
        }).toString();

        const address = account;
        const chain = "bsc";
        let resp;
        resp = await fetch(`https://api.unmarshal.com/v3/${chain}/address/${address}/nft-assets?${query}`, {
          method: "GET",
        });
        if (resp.status === 429) {
          apiKeyIndex++;
          if (apiKeyIndex === UNMARSHAL_API_KEYS.length) break;
          continue;
        }
        result = await resp.json();
        if (!result.nft_assets) break;
        nfts = [...nfts, ...result.nft_assets];
        offset = result.next_offset;
      } while (1);

      let ownedNFTs = await Promise.all(
        nfts.map(async (data) => {
          const isAnimation = data.animation_url && data.animation_url.length;
          let animation = isAnimation ? data.animation_url : null;
          let image = data.issuer_specific_data.image_url;
          animation = animation ?? "";
          image = image ?? "";
          animation = formatIPFSString(animation);
          image = formatIPFSString(image);

          let collectionName = data.asset_contract_name;
          collectionName = collectionName === "" ? "Unknown" : collectionName;

          let name = data.issuer_specific_data.name === "" ? collectionName : data.issuer_specific_data.name;
          name = name === "" ? "Unknown" : name;

          return {
            type: data.type === "721" ? "ERC721" : "ERC1155",
            collectionName,
            address: data.asset_contract,
            description: "",
            logo: image,
            chainId: 56,
            name,
            tokenId: data.token_id,
            balance: data.balance,
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
      let _ownedNFTs = [];
      let pageKey;
      do {
        const baseURL = `https://eth-mainnet.g.alchemy.com/v2/bXqwnLZHuGoI2wcSnabNiQJL0K83OTnQ`;
        const url = `${baseURL}/getNFTs/?owner=${account}&pageKey=${pageKey}`;
        const response = await axios.get(url);
        _ownedNFTs.push(...response.data.ownedNfts);
        pageKey = response.data.pageKey;
      } while (pageKey);
      let ownedNFTs = [];
      for (let i = 0; i < _ownedNFTs.length; i++) {
        const data = _ownedNFTs[i];

        const isAnimation = data.metadata.animation_url && data.metadata.animation_url.length;
        let animation = isAnimation ? data.metadata.animation_url : null;
        let image = data.metadata.image;
        animation = animation ?? "";
        image = image ?? "";
        animation = formatIPFSString(animation);
        image = formatIPFSString(image);

        let collectionName = data.contractMetadata.openSea.collectionName ?? data.contractMetadata.name;
        collectionName = collectionName ?? "Unknown";

        let name = data.title === "" ? collectionName : data.title;
        name = name === "" ? "Unknown" : name;

        ownedNFTs.push({
          type: data.contractMetadata.tokenType,
          collectionName,
          address: data.contract.address,
          description: data.description,
          logo: image,
          chainId: 1,
          balance: data.balance,
          name,
          tokenId: BigInt(_ownedNFTs[i].id.tokenId).toString(),
        });
      }
      setETHNFTs(ownedNFTs);
    } catch (e) {
      console.log(e);
    }
  }
  useSlowRefreshEffect(() => {
    if (!account) return;
    fetchBSCNFTs();
    fetchETHNFTs();
  }, [account]);
  return [...ethNFTs, ...bscNFTs];
};

export default useWalletNFTs;
