import styled from "styled-components";
import StyledButton from "../StyledButton";
import { warningFarmerSVG } from "components/dashboard/assets/svgs";

const AutoFarmer = ({}: {}) => {
  const createPoolPanel = (type: string) => {
    return (
      <PoolInfoPanel
        className={type === "pc" ? "mx-5 hidden max-w-[500px] md:block" : "mx-0 block max-w-full md:hidden"}
      >
        <div className="flex flex-wrap items-center justify-between text-xl ">
          <div className="flex items-center text-primary">
            {warningFarmerSVG("15px")}
            <div className="ml-1 whitespace-nowrap">BREWLABS Auto Farmer</div>
          </div>
          <div className="text-[#FFFFFFBF]">
            APR: <span className="text-primary">25.24%</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="text-[#FFFFFF80]">
            Zap <span className="#608CFF">ETH</span> earn <span className="text-[#FFFFFFBF]">USDC</span>
          </div>
          <div className="text-primary">Flexible</div>
        </div>
        <div className="flex flex-wrap justify-between text-[#FFFFFF80]">
          <div className="text-xs leading-none">
            <div>Deposit Fee 0.10%</div>
            <div>Withdrawal Fee 0.10%</div>
            <div>Performance Fee 0.020 ETH</div>
          </div>
          <div className="leading-none">$12424.00 Farm Position</div>
        </div>
      </PoolInfoPanel>
    );
  };
  return (
    <div className="flex h-full flex-col justify-center rounded border border-[#FFFFFF40] bg-[#B9B8B80D] py-[10px] px-3 sm:px-5">
      <div className="mb-4 flex w-full max-w-[1080px] items-center justify-between md:mb-0">
        <img src={"/images/directory/autofarmer.png"} alt={""} />
        {createPoolPanel("pc")}
        <div className="w-full max-w-[340px] flex-1 xsm:min-w-[220px] xsm:min-w-[160px]">
          <div className="flex w-full justify-between">
            <div className="mr-[4%] h-[50px] flex-1">
              <StyledButton type={"quinary"}>
                <div>
                  Zap in <span className="text-[#1A82FF]">ETH</span>
                </div>
              </StyledButton>
            </div>
            <div className="h-[50px] flex-1">
              <StyledButton type={"quinary"}>
                <div>
                  Zap out <span className="text-[#1A82FF]">ETH</span>
                </div>
              </StyledButton>
            </div>
          </div>
          <div className="mt-2.5 h-[50px] w-full">
            <StyledButton type={"senary"} boxShadow={true}>
              $124.00 USDC Harvest
            </StyledButton>
          </div>
        </div>
      </div>
      {createPoolPanel("mobile")}
    </div>
  );
};

const PoolInfoPanel = styled.div`
  width: 100%;
  border-radius: 4px;
  border: 1px solid white;
  padding: 14px 26px 8px 26px;
`;
export default AutoFarmer;
