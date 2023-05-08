import { useERC721 } from "hooks/useContract";
import { useCallback } from "react";
import { calculateGasMargin } from "utils";

const useNftApprove = (nftAddr) => {
  const nftContract = useERC721(nftAddr);

  const handleApprove = useCallback(
    async (spender) => {
      let gasLimit = await nftContract.estimateGas.setApprovalForAll(spender, true);
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await nftContract.setApprovalForAll(spender, true, { gasLimit });
      const receipt = await tx.wait();
      return receipt;
    },
    [nftContract]
  );

  return { onApprove: handleApprove };
};

export default useNftApprove;
