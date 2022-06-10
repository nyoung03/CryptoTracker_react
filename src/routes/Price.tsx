import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinHistory } from "./api";

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

interface PriceProps {
  coinId: string;
}

const Detail = styled.div`
  border: 2px solid ${(props) => props.theme.textColor};
  border-radius: 15px;
  font-weight: bold;
  text-align: center;
  margin: 20px;
  padding: 20px;
`;

function Price({ coinId }: PriceProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <Detail>Open : {data?.map((price) => price.open)}</Detail>
          <Detail>High : {data?.map((price) => price.high)}</Detail>
          <Detail>Low : {data?.map((price) => price.low)}</Detail>
          <Detail>Close : {data?.map((price) => price.close)}</Detail>
        </>
      )}
    </div>
  );
}

export default Price;
