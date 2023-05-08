/* eslint-disable react-hooks/exhaustive-deps */

import CountDown from "./CountDown";

const StakingHistory = ({ history }: { history: any }) => {
  return (
    <div className="h-[300px] overflow-x-scroll text-[#FFFFFFBF]">
      <div className="flex justify-between text-xl">
        <div className="min-w-[150px]">Stake</div>
        <div className="min-w-[60px]">Block</div>
        <div className="min-w-[80px] text-right">Lock</div>
      </div>
      <div className="mt-2 h-[1px] w-full bg-[#FFFFFF80]" />
      <div>
        {history.map((data, i) => {
          return (
            <div className="flex items-center justify-between border-b border-b-[#FFFFFF40] py-2.5" key={i}>
              <div className="min-w-[150px]">
                {data.value.toFixed(0)} <span className="text-primary">{data.symbol}</span>
              </div>
              <div className="min-w-[60px]">{data.blockNumber}</div>
              <div className="min-w-[80px] text-right">
                <CountDown time={data.timeRemaining} />
                {data.timeRemaining ? "Remaining" : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StakingHistory;
