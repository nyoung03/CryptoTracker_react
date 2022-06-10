import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useParams,
  Link,
  useMatch,
} from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "./api";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  padding: 20px;
`;

const Loading = styled.div`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  background-color: ${(props) => props.theme.boxColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  margin: 20px 0;
  font-size: 18px;
`;

const OverviewItem = styled.div`
  text-align: center;
  padding: 10px 20px;
  color: #1b3039;

  div:first-child {
    font-size: 13px;
    padding-bottom: 7px;
    font-weight: bold;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
  font-size: 18px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 15px 0;
`;
const Tab = styled.div<{ isActive: boolean }>`
  background-color: ${(props) => props.theme.boxColor};
  text-align: center;
  padding: 7px;
  border-radius: 15px;
  font-weight: bold;
  color: ${(props) => (props.isActive ? props.theme.accentColor : `#1b3039`)};

  a {
    display: block;
  }
`;

const HomeBtn = styled.button`
  border: 2px solid ${(props) => props.theme.textColor};
  background-color: transparent;
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  padding: 4px;
`;

interface RouteState {
  state: { name: string };
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  last_data_at: string;
  first_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams();
  const { state } = useLocation() as RouteState;
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId!),
    {
      refetchInterval: 10000,
    }
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId!),
    {
      refetchInterval: 5000,
    }
  );
  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Link to={`/`}>
          <HomeBtn>&larr;</HomeBtn>
        </Link>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <div>Rank</div>
              <div>{infoData?.rank}</div>
            </OverviewItem>
            <OverviewItem>
              <div>Symbol</div>
              <div>${infoData?.symbol}</div>
            </OverviewItem>
            <OverviewItem>
              <div>Price</div>
              <div>${tickersData?.quotes.USD.price?.toFixed(3)}</div>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <div>Total_Supply</div>
              <div>{tickersData?.total_supply}</div>
            </OverviewItem>
            <OverviewItem>
              <div>Max Supply</div>
              <div>{tickersData?.max_supply}</div>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to="Price">Price</Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to="Chart">Chart</Link>
            </Tab>
          </Tabs>

          <Routes>
            <Route path="price" element={<Price coinId={coinId!} />} />
            <Route path="chart" element={<Chart coinId={coinId!} />} />
          </Routes>
        </>
      )}
    </Container>
  );
}

export default Coin;
