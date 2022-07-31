import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts";
import { isDarkAtom } from "../atoms";
import { useRecoilValue } from "recoil";

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );

  const state = {
    series: [
      {
        data: [
          {
            x: new Date().getHours(),
            y: [
              data?.map((price) => price.open),
              data?.map((price) => price.high),
              data?.map((price) => price.low),
              data?.map((price) => price.close),
            ],
          },
        ],
      },
    ],
  };

  const isDark = useRecoilValue(isDarkAtom);

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              type: "candlestick",

              height: 300,

              toolbar: {
                show: false,
              },
            },

            xaxis: {
              type: "datetime",

              axisTicks: {
                show: false,
              },

              axisBorder: {
                show: false,
              },

              labels: {
                show: false,
              },
            },

            yaxis: {
              show: false,
            },

            grid: {
              show: false,
            },
          }}
          series={state.series}
          type="candlestick"
          height={350}
        />
      )}
    </div>
  );
}

export default Chart;
