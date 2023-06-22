/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import TokenLogo from "@components/logo/TokenLogo";
import { formatAmount } from "utils/formatApy";
import { getBlockExplorerLink, getBlockExplorerLogo, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

const StakingHistory = ({ data, history, setOpen }: { data: any; history: any; setOpen: any }) => {
  const { tokens, priceHistories } = data;
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    let _histories = [...history]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((v) => ({ ...v, realAmounts: new Array(data.numTokens).fill(0), realUsdAmount: 0 }));

    for (let i = 0; i < _histories.length; i++) {
      let _history = _histories[i];
      switch (_history.method) {
        case "Exit Index":
        case "Mint NFT":
          for (let k = 0; k <= i; k++) {
            _histories[k].realAmounts = new Array(data.numTokens).fill(0);
            _histories[k].realUsdAmount = 0;
          }
          break;
        case "Enter Index":
        case "Stake NFT":
          _histories[i].realAmounts = _histories[i].amounts.map((amount) => +amount);
          _histories[i].realUsdAmount = +_histories[i].usdAmount;
          break;
        case "Claim":
          _histories[i].realAmounts = new Array(data.numTokens).fill(0);
          _histories[i].realUsdAmount = 0;

          // adjust previous histories
          let _amounts = _histories[i].amounts.map((amount) => +amount);
          let _usdAmount = +_histories[i].usdAmount;
          for (let k = 0; k < i; k++) {
            for (let j = 0; j < data.numTokens; j++) {
              if (_amounts[j] === 0) continue;

              if (_histories[k].realAmounts[j] > _amounts[i]) {
                _histories[k].realAmounts[j] -= _amounts[j];
                _amounts[j] = 0;
              } else {
                _histories[k].realAmounts[j] = 0;
                _amounts[j] -= _histories[k].realAmounts[j];
              }
            }

            if (_usdAmount > 0) {
              if (_histories[k].realUsdAmount > _usdAmount) {
                _histories[k].realUsdAmount -= _usdAmount;
                _usdAmount = 0;
              } else {
                _histories[k].realUsdAmount = 0;
                _usdAmount -= _histories[k].realUsdAmount;
              }
            }
          }
          break;
      }
    }

    setHistories(_histories.sort((a, b) => b.timestamp - a.timestamp));
  }, [data.pid, history.length]);

  const renderProfit = (item) => {
    let profit = 0;

    if (!item || !priceHistories?.length) return <span className="mr-1 text-green">$0.00</span>;

    for (let k = 0; k < data.numTokens; k++) {
      profit += +item.realAmounts[k] * priceHistories[k][priceHistories[k].length - 1];
    }
    profit -= +item.realUsdAmount;

    return (
      <span className={`${profit >= 0 ? "text-green" : "text-danger"}`}>
        ${numberWithCommas(Math.abs(profit).toFixed(3))}
      </span>
    );
  };

  return (
    <div className="h-[450px] overflow-x-scroll text-[#FFFFFFBF]">
      <div className="flex justify-between text-xl">
        <div className="min-w-[100px]">Entries</div>
        <div className="min-w-[60px]">Type</div>
        <div className="min-w-[70px]">Block</div>
        <div className="min-w-[140px] text-right">Position</div>
      </div>
      <div className="mt-2 h-[1px] w-full bg-[#FFFFFF80]" />
      <div>
        {!history && <div className=" mt-2 text-center">loading...</div>}
        {history &&
          histories.map((item) => {
            return (
              <div className="flex items-center justify-between border-b border-b-[#FFFFFF40] py-4" key={item.txHash}>
                <div className="min-w-[100px]">
                  {tokens.map((token, index) => (
                    <div key={index} className="flex items-center leading-none">
                      <TokenLogo
                        src={getTokenLogoURL(token.address, token.chainId, token.logo)}
                        classNames="mr-1 w-3"
                      />
                      <div className="text-[#FFFFFFBF]">{formatAmount(item.amounts[index], 6)}</div>
                    </div>
                  ))}
                </div>
                <a
                  className="flex min-w-[60px] items-center"
                  href={getBlockExplorerLink(item.txHash, "transaction", data.chainId)}
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <img src={getBlockExplorerLogo(data.chainId)} alt={""} className="mr-1 w-3" />
                  <div>{item.method}</div>
                </a>
                <div className="min-w-[70px]">{item.blockNumber}</div>
                {item.realUsdAmount > 0 ? (
                  <div className="min-w-[140px] cursor-pointer text-right" onClick={setOpen}>
                    Exit {renderProfit(item)} Profit
                  </div>
                ) : (
                  <div className="min-w-[140px] text-right"></div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StakingHistory;
