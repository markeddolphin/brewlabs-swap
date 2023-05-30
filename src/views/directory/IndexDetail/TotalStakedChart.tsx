/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import dynamic from "next/dynamic";
import { getAverageHistory } from "state/indexes/fetchIndexes";
import { formatAmount } from "utils/formatApy";
import Skeleton from "react-loading-skeleton";
import { SkeletonComponent } from "components/SkeletonComponent";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalStakedChart = ({
  data,
  symbols,
  prices,
  curGraph,
}: {
  data: any;
  symbols: string[];
  prices: number[];
  curGraph: number;
}) => {
  if (!data) return <div className="h-[250px]" />;
  let pricechange = 0;
  if (curGraph === 2) pricechange = getAverageHistory(data)[data[0].length - 1];

  const chartData: any = {
    series: [
      {
        name: "Price",
        data:
          curGraph === 2
            ? getAverageHistory(data)
            : data.map((value) => {
                if (curGraph !== 0) return value;

                let tvl = 0;
                value.forEach((v, index) => {
                  tvl += +v * prices[index];
                });
                return tvl;
              }),
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
            if (curGraph === 1 || curGraph === 3) return "$" + +(+value * prices[0]).toFixed(2);
            if (curGraph === 2) return value.toFixed(2) + "%";
            return "$" + value.toFixed(2);
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

  const getTitle = (type: number) => {
    if (type === 0) {
      return "Total Index Value";
    } else if (type === 1) {
      return (
        <div>
          Performance fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
        </div>
      );
    } else if (type === 2) {
      return (
        <div>
          Index Performance<span className="text-[#FFFFFF80]"> (Price - 24hrs)</span>
        </div>
      );
    } else if (type === 3) {
      return (
        <div>
          Owner comissions<span className="text-[#FFFFFF80]"> (24hrs)</span>
        </div>
      );
    }
  };

  const getChartHeader = () => {
    switch (curGraph) {
      case 0:
        return (
          <>
            <span className="mb-1 flex">${chartData.series[0].data[data.length - 1].toFixed(2)}</span>
            {data[data.length - 1].map((d, index) => (
              <span key={index} className="flex">
                {formatAmount(d, 6)} {symbols[index]}
              </span>
            ))}
          </>
        );
      case 1:
        return (
          <>
            <span className="mb-1 flex">${formatAmount(+data[data.length - 1] * prices[0], 4)}</span>
            <span className="flex">
              {formatAmount(data[data.length - 1], 4)} {symbols[0]}
            </span>
          </>
        );
      case 2:
        return (
          <>
            <span
              className={`mb-1 flex ${+getAverageHistory(data)[data[0].length - 1] < 0 ? "text-danger" : "text-green"}`}
            >
              {data[0].length > 0 ? (
                <>{(+getAverageHistory(data)[data[0].length - 1]).toFixed(2)}%</>
              ) : (
                <SkeletonComponent />
              )}
            </span>
            {data.map((d, index) => {
              let priceChange = ((d[d.length - 1] - d[0]) / d[d.length - 1]) * 100;
              return d.length > 0 ? (
                <span key={index} className={`flex ${priceChange < 0 ? "text-danger" : "text-green"}`}>
                  {priceChange.toFixed(2)}% {symbols[index]}
                </span>
              ) : (
                <SkeletonComponent key={index} />
              );
            })}
          </>
        );
      case 3:
        return <span className="mb-1 flex">${formatAmount(+data[data.length - 1] * prices[0])}</span>;
    }
  };

  return (
    <StyledContainer down={(pricechange < 0).toString()}>
      <div className="text-xl text-[#FFFFFFBF]">{getTitle(curGraph)}</div>
      <div className="leading-none text-[#FFFFFF80]">
        {getChartHeader()}
        <span className="text-[#B9B8B8]">{new Date().toDateString()}</span>
      </div>
      <div className="-mt-2">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={curGraph === 0 ? 250 - 10 * data[0].length : curGraph === 2 ? 250 - 12 * data.length : 250}
        />
      </div>
    </StyledContainer>
  );
};

export default TotalStakedChart;

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
  height: 250px;
  @media screen and (max-height: 725px) {
    height: 200px;
  }
`;
