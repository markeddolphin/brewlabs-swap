import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useWalletTokens = (walletAddress: string, chain: string) => {
  const [tokens, setTokens] = useState([]);

  const fetchTokens = useCallback(async () => {
    const res = await axios.get(`https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=${chain}`, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "Dtn7MAUqnS4GXJBGinl4TiW4d5IzYzuZRCkN4nhHkLMo9ysx2MJuPUVcGpMn1x6S",
        Accept: "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
    setTokens(res.data);
  }, [walletAddress, chain]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return tokens;
};

export default useWalletTokens;
