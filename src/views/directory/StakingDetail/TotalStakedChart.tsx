/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import dynamic from "next/dynamic";
import { BigNumberFormat, numberWithCommas } from "utils/functions";
import { SkeletonComponent } from "components/SkeletonComponent";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalStakedChart = ({
  data,
  symbol,
  price,
  curGraph,
}: {
  data: any;
  symbol: string;
  price: number;
  curGraph: number;
}) => {
  const getTitle = (type: number) => {
    switch (type) {
      case 2:
        return (
          <div>
            Token fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
          </div>
        );
      case 3:
        return (
          <div>
            Performance fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
          </div>
        );
      case 4:
        return (
          <div>
            Staked Addresses<span className="text-[#FFFFFF80]"> (24hrs)</span>
          </div>
        );
      default:
        return "Total Staked Value";
    }
  };

  const chartData: any = {
    series: [
      {
        name: "Price",
        data: data ? data : [],
      },
    ],
    options: {
      colors: ["#FFDE0D"],
      fill: {
        gradient: {
          type: "vertical",
          shadeIntensity: 0.5,
          inverseColors: true,

          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: "#EEBB19",
              opacity: 1,
            },
            {
              offset: 100,
              color: "rgb(110, 220, 181)",
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
        width :1
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
            return (curGraph !== 3 ? "$" : "") + BigNumberFormat(value * price, curGraph !== 3 ? 2 : 0);
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
    <StyledContainer>
      <div className="text-xl text-[#FFFFFFBF]">{getTitle(curGraph)}</div>
      <div className="leading-none text-[#FFFFFF80]">
        {curGraph !== 4 ? (
          <span>
            {data !== undefined && data.length ? (
              `$${BigNumberFormat(data[data.length - 1] * price)}`
            ) : (
              <SkeletonComponent />
            )}
            <br />
          </span>
        ) : (
          ""
        )}
        <span className="flex text-primary">
          {data !== undefined && data.length ? (
            numberWithCommas(data[data.length - 1].toFixed(curGraph !== 4 ? 2 : 0))
          ) : (
            <SkeletonComponent />
          )}
          &nbsp;
          {symbol}
        </span>
        <span className="text-[#B9B8B8]">{new Date().toDateString()}</span>
      </div>
      <div className="-mt-2">
        <Chart options={chartData.options} series={chartData.series} type="area" height={250} />
      </div>
    </StyledContainer>
  );
};

export default TotalStakedChart;

const StyledContainer = styled.div`
  .apexcharts-tooltip {
    color: white;
  }
  .apexcharts-tooltip.apexcharts-theme-light {
    background: rgba(110, 220, 181, 0.5);
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
