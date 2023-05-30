/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import dynamic from "next/dynamic";
import { getAverageHistory } from "state/indexes/fetchIndexes";
import { formatAmount } from "utils/formatApy";
import Skeleton from "react-loading-skeleton";
import { SkeletonComponent } from "components/SkeletonComponent";
import { useState } from "react";
import DropDown from "../Dropdowns/Dropdown";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DrawChart = ({ data, type }: { data: any; type: string }) => {
  if (!data || data[data.length - 1] === undefined) return <div className="h-[130px]" />;
  let pricechange = data[data.length - 1] - data[0];
  const chartData: any = {
    series: [
      {
        name: "Price",
        data,
      },
    ],
    options: {
      colors: [pricechange >= 0 ? "#2FD35D" : "#ea3943"],
      fill: {
        gradient: {
          type: "vertical",
          shadeIntensity: 0.5,
          inverseColors: true,

          stops: [0, 100],
          colorStops:
            pricechange >= 0
              ? [
                  {
                    offset: 0,
                    color: "#2FD35D",
                    opacity: 0.75,
                  },
                  {
                    offset: 100,
                    color: "#6EDCB5",
                    opacity: 0,
                  },
                ]
              : [
                  {
                    offset: 0,
                    color: "#ea3943",
                    opacity: 0.4,
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
            if (type === "fee") return "$" + value.toFixed(2);
            return value.toFixed(2) + "%";
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
  return (
    <StyledContainer down={(pricechange < 0).toString()}>
      <div className="-mt-4">
        <Chart options={chartData.options} series={chartData.series} type="area" height={150} />
      </div>
    </StyledContainer>
  );
};
const ChartHistory = ({ data, type }: { data: any; type: string }) => {
  const [period, setPeriod] = useState(0);

  let curData = data[period];
  let pricechange = curData[curData.length - 1] - curData[0];
  return (
    <div
      className={`ml-2 h-full w-[270px] rounded-lg border border-dashed ${
        pricechange >= 0 ? "border-green" : "border-danger"
      } px-2 py-1.5`}
    >
      <div className="flex items-center justify-between text-sm">
        <div>
          {type === "fee" ? "Fee performance" : "Historic performance"}:{" "}
          <span className={pricechange >= 0 ? "text-green" : "text-danger"}>
            {type === "fee"
              ? `$${curData[curData.length - 1] ? curData[curData.length - 1].toFixed(2) : "0.00"}`
              : `${curData[curData.length - 1] ? curData[curData.length - 1].toFixed(2) : "0.00"}%`}
          </span>
        </div>
        <div className="w-[60px]">
          <DropDown value={period} setValue={setPeriod} data={["24hrs", "7D", "30D"]} />
        </div>
      </div>
      <DrawChart data={curData} type={type} />
    </div>
  );
};

export default ChartHistory;

const StyledContainer = styled.div<{ down: string }>`
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
    margin-top: -23px;
  }
  height: 130px;
`;
