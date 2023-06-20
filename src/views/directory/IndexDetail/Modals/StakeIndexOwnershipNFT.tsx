/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAccount, useSigner } from "wagmi";

import { chevronLeftSVG, downloadSVG, LinkSVG } from "components/dashboard/assets/svgs";
import LogoIcon from "components/LogoIcon";
import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { setIndexesPublicData, updateUserBalance, updateUserDeployerNftInfo } from "state/indexes";
import { useIndexes } from "state/indexes/hooks";
import { DeserializedIndex } from "state/indexes/types";
import { getErc721Contract, getIndexContract } from "utils/contractHelpers";
import { calculateGasMargin } from "utils";
import { getChainLogo, getIndexName } from "utils/functions";
import { getNetworkGasPrice } from "utils/getGasPrice";

import useNftApprove from "../hooks/useNftApprove";
import useIndexImpl from "../hooks/useIndexImpl";

import StyledButton from "../../StyledButton";
import IndexLogo from "../IndexLogo";

const StakeIndexOwnershipNFT = ({ open, setOpen, data }: { open: boolean; setOpen: any; data: DeserializedIndex }) => {
  const dispatch = useAppDispatch();

  const { chainId } = useActiveChainId();
  const { address: account } = useAccount();
  const { data: signer } = useSigner();
  const { indexes } = useIndexes();
  const { pending, setPending }: any = useContext(DashboardContext);

  const [selIndexId, setSelectedIndexId] = useState(0);

  const { onApprove } = useNftApprove(data.category >= 0 ? data.deployerNft : data.nft);
  const { onStakeDeployerNft } = useIndexImpl(data.pid, data.address, data.performanceFee);

  let allPools = indexes.filter(
    (_index) => _index.chainId === chainId && _index.deployerNftId && _index.userData?.deployerNftItem
  );

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleStakeDeployerNft = async () => {
    if (pending) return;

    setPending(true);
    try {
      // check allowance & approve
      const deployerNft = getErc721Contract(data.chainId, data.deployerNft);
      let allowance = await deployerNft.isApprovedForAll(account, data.address);
      if (!allowance) {
        await onApprove(data.address);
      }

      await onStakeDeployerNft();
      dispatch(setIndexesPublicData([{ pid: data.pid, feeWallet: account }]));

      toast.success("Deployer NFT was unstaked");
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const handleStakeDeployerNftForIndex = async (indexId) => {
    if (pending) return;

    const selectedIndex = allPools.find((_index) => _index.pid === indexId);
    if (!selectedIndex) return;

    setSelectedIndexId(indexId);
    setPending(true);
    try {
      // check allowance & approve
      const deployerNft = getErc721Contract(selectedIndex.chainId, selectedIndex.deployerNft);
      let allowance = await deployerNft.isApprovedForAll(account, selectedIndex.address);
      if (!allowance) {
        await onApprove(selectedIndex.address);
      }

      const indexContract = getIndexContract(selectedIndex.chainId, selectedIndex.address, signer);
      const gasPrice = await getNetworkGasPrice(signer, chainId);

      let gasLimit = await indexContract.estimateGas.stakeDeployerNft({ value: selectedIndex.performanceFee ?? "0" });
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await indexContract.stakeDeployerNft({
        gasPrice,
        gasLimit,
        value: selectedIndex.performanceFee ?? "0",
      });
      await tx.wait();

      dispatch(setIndexesPublicData([{ pid: data.pid, feeWallet: account }]));
      dispatch(updateUserBalance(account, chainId));
      dispatch(updateUserDeployerNftInfo(account, chainId));

      toast.success("Deployer NFT was staked");

      setSelectedIndexId(0);
      setOpen(false);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog
        open={open}
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
        onClose={() => {}}
      >
        <div className="flex min-h-full items-center justify-center p-4 ">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: "easeOut",
                duration: 0.15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
            transition={{ duration: 0.25 }}
          >
            <StyledPanel>
              <div className="flex flex-col-reverse justify-between border-b border-b-[#FFFFFF80] pb-3 xmd:flex-row xmd:items-center">
                <div className="mt-5 flex items-center pl-3 text-xl xmd:mt-0">
                  <LogoIcon classNames="w-9 text-brand mr-3" />
                  <div>Stake index Ownership NFT</div>
                </div>
                <div className="h-10 min-w-[130px]">
                  <StyledButton type="secondary" onClick={() => setOpen(false)}>
                    <div className="flex items-center text-[#FFFFFFBF]">
                      {chevronLeftSVG}
                      <div className="ml-2">Back a page</div>
                    </div>
                  </StyledButton>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[480px]">
                <div className="mt-4 text-xl text-[#FFFFFFBF]">How does this work?</div>
                <div className="mt-2 text-sm leading-[1.2] text-[#FFFFFF80]">
                  If you have an Index Ownership NFT in your wallet it will appear below. You can stake your chosen
                  Index Ownership NFT to claim ownership of the Index, pending fees/commissions and future
                  fees/commissions.
                </div>

                {allPools.length ? (
                  <>
                    <div className="mt-5 text-[#FFFFFFBF]">Available Index Ownership NFT’s found!</div>
                    <div className="yellowScroll mb-[50px] mt-2.5 max-h-[400px] overflow-y-scroll text-[#FFFFFFBF]">
                      {allPools.map((pool, i) => {
                        return (
                          <div className="mb-2.5" key={i}>
                            <div className="text-sm">Index name</div>
                            <div className="flex flex-col sm:flex-row">
                              <div className="primary-shadow min-h-12 mb-1 mr-0 flex flex-1 items-center justify-between rounded-md bg-[#B9B8B81A] px-4 sm:mb-0 sm:mr-1">
                                <div className="flex flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap">
                                  <img src={getChainLogo(pool.chainId)} alt="" className="h-6 w-6 rounded-full" />
                                  <div className="mx-4 w-fit sm:w-[80px]">
                                    <IndexLogo type={"line"} tokens={pool.tokens ?? []} />
                                  </div>
                                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {pool.name !== "" ? pool.name : getIndexName(pool.tokens)}
                                  </div>
                                </div>
                                <Link
                                  className="scale-125 !text-[#ffffff6e] hover:!text-white"
                                  href={`/indexes/${pool.chainId}/${pool.pid}`}
                                  onClick={() => setOpen(false)}
                                >
                                  {LinkSVG}
                                </Link>
                              </div>
                              <div
                                onClick={() => handleStakeDeployerNftForIndex(pool.pid)}
                                className="primary-shadow flex h-12 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-[#B9B8B81A] transition hover:bg-[#b9b8b850] sm:w-24"
                              >
                                {selIndexId === pool.pid && pending ? (
                                  <div className="flex items-center">
                                    <Oval
                                      width={18}
                                      height={18}
                                      color={"white"}
                                      secondaryColor="black"
                                      strokeWidth={3}
                                      strokeWidthSecondary={3}
                                    />
                                  </div>
                                ) : (
                                  <div className="my-1 scale-125 text-[#D9D9D9]">{downloadSVG}</div>
                                )}
                                <div className="text-sm">Stake</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="mt-5 text-center text-lg text-[#FFFFFFBF]">No Index Ownership NFT Found!</div>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute -right-2 -top-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
              </button>
            </StyledPanel>
          </motion.div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
};

const StyledPanel = styled.div`
  position: relative;
  width: calc(100vw - 24px);
  max-width: 640px;
  border-radius: 8px;
  background: #1b212d;
  padding: 40px 50px;
  @media screen and (max-width: 450px) {
    padding-left: 12px;
    padding-right: 12px;
  }
  display: flex;
  flex-direction: column;
`;

export default StakeIndexOwnershipNFT;
