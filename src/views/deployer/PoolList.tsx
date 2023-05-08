import styled from "styled-components";
import PoolCard from "./PoolCard";
import { PlusSVG } from "@components/dashboard/assets/svgs";
import DeployerModal from "views/directory/DeployerModal";
import { useState } from "react";

const PoolList = ({
  pools,
  setSelectPoolDetail,
  setCurPool,
  setSortOrder,
  loading,
}: {
  pools: any;
  setSelectPoolDetail: any;
  setCurPool: any;
  setSortOrder: any;
  loading: boolean;
}) => {
  const [deployerOpen, setDeployerOpen] = useState(false);
  return (
    <StyledContainer>
      <DeployerModal open={deployerOpen} setOpen={setDeployerOpen} />
      <PoolHeader>
        <div className="min-w-[80px] cursor-pointer" onClick={() => setSortOrder("chainId")}>
          Network
        </div>
        <div className="min-w-[210px] cursor-pointer" onClick={() => setSortOrder("default")}>
          Pool
        </div>
        <div className="min-w-[70px] cursor-pointer" onClick={() => setSortOrder("tvl")}>
          TVL
        </div>
        <div className="min-w-[250px] cursor-pointer" onClick={() => setSortOrder("totalStaked")}>
          Total supply staked
        </div>
        <div className="min-w-[80px] cursor-pointer" onClick={() => setSortOrder("apr")}>
          APR
        </div>
      </PoolHeader>
      <div className="h-[1px] w-full bg-[#FFFFFF80]" />
      <PoolPanel>
        {!loading && <div className="mt-3 text-center">loading...</div>}
        {loading &&
          pools.map((data: any, i: number) => {
            return (
              <PoolCard
                data={data}
                key={100000 + i}
                index={i}
                length={pools.length}
                setSelectPoolDetail={setSelectPoolDetail}
                setCurPool={setCurPool}
              />
            );
          })}
      </PoolPanel>
      <div
        className="mx-auto my-8 mt-5 flex w-full max-w-[320px] cursor-pointer items-center justify-center rounded-lg border border-[#FFFFFF80] bg-[#B9B8B80D] py-2.5 text-lg text-[#FFFFFF80] transition hover:text-white hover:shadow-[0px_1px_3px_white]"
        onClick={() => setDeployerOpen(true)}
      >
        <div className="-mt-0.5 mr-2.5 scale-150 text-primary">{PlusSVG}</div>
        <div>Deploy a Brewlabs Product</div>
      </div>
    </StyledContainer>
  );
};

const PoolHeader = styled.div`
  margin-right: 16px;
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 18px;
  color: #ffffff80;

  @media screen and (max-width: 1080px) {
    display: none;
  }
`;

const PoolPanel = styled.div`
  overflow-y: scroll;
  display: flex;
  height: 400px;
  flex-direction: column;
  padding: 8px 0;
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    display: block !important;
  }

  ::-webkit-scrollbar-track {
  }
  ::-webkit-scrollbar-thumb:vertical {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #eebb19;
  }
  @media screen and (max-width: 1080px) {
    height: fit-content;
    ::-webkit-scrollbar {
      display: none !important;
    }
  }
`;

const StyledContainer = styled.div`
  background: rgba(185, 184, 184, 0.05);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  padding: 0 20px;
  @media screen and (max-width: 1080px) {
    > div:nth-child(2) {
      display: none;
    }
    border: none;
    background: none;
    padding: 0;
  }
`;

export default PoolList;
