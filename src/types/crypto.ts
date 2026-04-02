export interface CryptoData {
  coin_id: string;
  coin_name: string;
  symbol: string;
  price_usd: string;
  market_cap: string;
  volume_24h: string;
  change_24h_pct: string;
  timestamp_checked: string;
  last_updated?: string;
}

export interface ProcessedCryptoData {
  coin_id: string;
  coin_name: string;
  symbol: string;
  price_usd: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  change_24h_percent: number;
  timestamp_checked: Date;
  timestamp_formatted: string;
}

export interface CoinGroup {
  coin_id: string;
  coin_name: string;
  symbol: string;
  latestData: ProcessedCryptoData;
  history: ProcessedCryptoData[];
}

export interface MarketMetrics {
  totalMarketCap: number;
  total24hVolume: number;
  topGainer: CoinGroup | null;
  topLoser: CoinGroup | null;
}
