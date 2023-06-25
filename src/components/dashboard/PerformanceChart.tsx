/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { DashboardContext } from "contexts/DashboardContext";
import { upSVG, downSVG } from "./assets/svgs";
import { TailSpin } from "react-loader-spinner";
import { BigNumberFormat } from "utils/functions";
import { useAccount } from "wagmi";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Loading = () => {
  const { address } = useAccount();
  const innerHeight = window && window.innerHeight ? window.innerHeight : 0;
  return (
    <div className={`flex ${innerHeight < 725 ? "h-[200px]" : "h-[220px]"} w-full items-center justify-center pt-10`}>
      <div style={{ marginTop: "-92px" }}>
        {address ? (
          <TailSpin width={50} height={50} color={"rgba(255,255,255,0.5"} />
        ) : (
          <div className={"text-2xl text-brand"}>No Wallet Connected</div>
        )}
      </div>
    </div>
  );
};
const PerformanceChart = ({ showType }: { showType: number }) => {
  let pricehistory: any = [];
  const { marketHistory, walletHistories, chartPeriod }: any = useContext(DashboardContext);
  if (showType === 1) {
    if (!marketHistory.length) return <Loading />;
    pricehistory = marketHistory;
  } else {
    if (!walletHistories.length) return <Loading />;
    pricehistory = walletHistories;
  }

  const priceChange = pricehistory.length ? pricehistory[pricehistory.length - 1] - pricehistory[0] : 0;
  let priceChangePercent = pricehistory.length ? (priceChange / pricehistory[0]) * 100 : 0;
  priceChangePercent = isNaN(priceChangePercent) ? 0 : priceChangePercent;
  priceChangePercent = priceChangePercent < 0 ? -priceChangePercent : priceChangePercent;

  let totalPrice = pricehistory.length ? pricehistory[pricehistory.length - 1] : 0;
  const chartData: any = {
    series: [
      {
        name: "Price",
        data: pricehistory,
      },
    ],
    options: {
      colors: [priceChange >= 0 ? "#2FD35D" : "#ea3943"],
      fill: {
        gradient: {
          type: "vertical",
          shadeIntensity: 0.5,
          inverseColors: true,

          stops: [0, 100],
          colorStops:
            priceChange >= 0
              ? [
                  {
                    offset: 0,
                    color: "rgb(110, 220, 181)",
                    opacity: 0.2,
                  },
                  {
                    offset: 100,
                    color: "rgb(110, 220, 181)",
                    opacity: 0,
                  },
                ]
              : [
                  {
                    offset: 0,
                    color: "#ea3943",
                    opacity: 0.2,
                  },
                  {
                    offset: 100,
                    color: "#ea3943",
                    opacity: 0,
                  },
                ],
        },
      },
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      tooltip: {
        y: {
          format: "",
          formatter: (value: any) => {
            return "$" + BigNumberFormat(value);
          },
        },
      },
      grid: {
        show: false,
      },
      legend: {
        show: false,
      },
    },
  };

  const innerHeight = window && window.innerHeight ? window.innerHeight : 0;
  const periodTexts = { 0: "24hrs", 1: "1W", 2: "1M", 3: "1Y", 4: "ALL" };

  return (
    <StyledContainer down={(priceChange < 0).toString()}>
      <div className={"flex items-center justify-between font-semibold text-white"}>
        <div className={"flex items-center"}>
          <div className={"ml-4 w-[140px] text-sm sm:ml-16 sm:w-[180px]"}>
            <div>Performance</div>
            <div className={"text-2xl font-bold"}>${BigNumberFormat(totalPrice)}</div>
            <div className={"flex items-center"}>
              <StyledColor down={(priceChange < 0).toString()} className={"mr-1"}>
                ${priceChange < 0 ? BigNumberFormat(-priceChange) : BigNumberFormat(priceChange)}
              </StyledColor>
              <StyledColor down={(priceChange < 0).toString()}>{priceChange >= 0 ? upSVG : downSVG}</StyledColor>
            </div>
          </div>
          <div className={"text-grey opacity-70"}>{periodTexts[chartPeriod]}</div>
        </div>
        <StyledColor down={(priceChange < 0).toString()}>
          {priceChange > 0 ? "+" : "-"}
          {priceChangePercent.toFixed(2)}%
        </StyledColor>
      </div>
      <div>
        {pricehistory.length && typeof window !== "undefined" ? (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={innerHeight < 725 ? 170 : 190}
          />
        ) : (
          <Loading />
        )}
      </div>
    </StyledContainer>
  );
};

export default PerformanceChart;

const StyledColor = styled.div<{ down: String }>`
  color: ${({ down }) => (down === "true" ? "#ea3943" : "#2FD35D")};
`;
const StyledContainer = styled.div<{ down: String }>`
  .apexcharts-tooltip {
    color: white;
  }
  .apexcharts-tooltip.apexcharts-theme-light {
    background: ${({ down }) => (down === "true" ? "rgba(234, 57, 67, 0.5)" : "rgba(110, 220, 181, 0.5)")};
  }
  .apexcharts-tooltip-title {
    display: none;
  }
  .apexcharts-xaxistooltip {
    display: none;
  }
  .apexcharts-tooltip.apexcharts-theme-light {
    border: none;
  }
  .apexcharts-tooltip-text-y-label {
    display: none;
  }
  .apexcharts-tooltip-marker {
    margin-right: 0;
  }
  .apexcharts-tooltip-text-y-value {
    font-size: 16px;
  }
  > div:nth-child(2) > div {
    min-height: unset !important;
    margin-top: -35px;
  }
  height: 220px;
  @media screen and (max-height: 725px) {
    height: 200px;
  }
`;
