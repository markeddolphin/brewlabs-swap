import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import StyledButton from "../StyledButton";

const TrueNFT = ({}: {}) => {
  return (
    <StyledContainer>
      <div className="text-[30px] font-bold">NFT Staking & Marketplace</div>
      <div className="mt-1 text-xs font-bold">
        Upcoming, all inclusive marketplace, NFT launchpad, NFT staking and NFT utility dAPP. <br />
        Unique royalty model and passive income opportunity HUB.
      </div>
      <a className="mt-4 flex h-[28px] w-[140px]" href={"https://truenft.io/"} target={"_blank"} rel="noreferrer">
        <StyledButton type="truenft">
          <div className="flex w-full items-center justify-between pr-2 pl-4 text-sm">
            <div>Visit TrueNFT</div>
            <div className="-scale-100">{chevronLeftSVG}</div>
          </div>
        </StyledButton>
      </a>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  background: url("/images/directory/truenft.png");
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display : flex;
  flex-direction: column;
  justify-content: center;
  padding: 27px 20px 8px 40px;
  color: black;
  font-family: "Roboto";
  @media screen and (max-width : 640px){
    padding-left : 20px;
    padding-right : 20px;
  }
`;

export default TrueNFT;
