import { CryptoData, ProcessedCryptoData, CoinGroup, MarketMetrics } from "@/types/crypto";

export function formatCurrency(value: number, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "$0.00";
  }
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1e12) {
    return `$${(absValue / 1e12).toFixed(decimals)}T`;
  }
  if (absValue >= 1e9) {
    return `$${(absValue / 1e9).toFixed(decimals)}B`;
  }
  if (absValue >= 1e6) {
    return `$${(absValue / 1e6).toFixed(decimals)}M`;
  }
  if (absValue >= 1e3) {
    return `$${(absValue / 1e3).toFixed(decimals)}K`;
  }
  return `$${absValue.toFixed(decimals)}`;
}

export function formatPrice(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "$0.00";
  }
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1000) {
    return `$${absValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (absValue >= 1) {
    return `$${absValue.toFixed(4)}`;
  }
  return `$${absValue.toFixed(6)}`;
}

export function formatPercent(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0.00%";
  }
  const absValue = Math.abs(value);
  return `${absValue.toFixed(2)}%`;
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatFullTimestamp(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function processRawData(rawData: CryptoData[]): ProcessedCryptoData[] {
  return rawData
    .map((item) => ({
      coin_id: item.coin_id,
      coin_name: item.coin_name,
      symbol: item.symbol.toUpperCase(),
      price_usd: parseFloat(item.price_usd) || 0,
      market_cap_usd: parseFloat(item.market_cap) || 0,
      volume_24h_usd: parseFloat(item.volume_24h) || 0,
      change_24h_percent: parseFloat(item.change_24h_pct) || 0,
      timestamp_checked: new Date(item.timestamp_checked),
      timestamp_formatted: formatTimestamp(new Date(item.timestamp_checked)),
    }))
    .filter((item) => {
      // Filter out entries with invalid/negative prices or market caps
      return item.price_usd > 0 && item.market_cap_usd > 0;
    });
}

export function groupDataByCoin(data: ProcessedCryptoData[]): Map<string, CoinGroup> {
  const grouped = new Map<string, CoinGroup>();

  data.forEach((item) => {
    const existing = grouped.get(item.coin_id);
    
    if (!existing) {
      grouped.set(item.coin_id, {
        coin_id: item.coin_id,
        coin_name: item.coin_name,
        symbol: item.symbol,
        latestData: item,
        history: [item],
      });
    } else {
      existing.history.push(item);
      if (item.timestamp_checked > existing.latestData.timestamp_checked) {
        existing.latestData = item;
      }
    }
  });

  // Sort history by timestamp and remove duplicates for each coin
  grouped.forEach((group) => {
    group.history.sort((a, b) => a.timestamp_checked.getTime() - b.timestamp_checked.getTime());
    
    // Remove duplicates based on timestamp
    const seen = new Set<number>();
    group.history = group.history.filter((item) => {
      const timestamp = item.timestamp_checked.getTime();
      if (seen.has(timestamp)) {
        return false;
      }
      seen.add(timestamp);
      return true;
    });
  });

  return grouped;
}

export function calculateMarketMetrics(coinGroups: Map<string, CoinGroup>): MarketMetrics {
  let totalMarketCap = 0;
  let total24hVolume = 0;
  let topGainer: CoinGroup | null = null;
  let topLoser: CoinGroup | null = null;

  coinGroups.forEach((group) => {
    const latest = group.latestData;
    totalMarketCap += latest.market_cap_usd;
    total24hVolume += latest.volume_24h_usd;

    if (!topGainer || latest.change_24h_percent > topGainer.latestData.change_24h_percent) {
      topGainer = group;
    }
    if (!topLoser || latest.change_24h_percent < topLoser.latestData.change_24h_percent) {
      topLoser = group;
    }
  });

  return {
    totalMarketCap,
    total24hVolume,
    topGainer,
    topLoser,
  };
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
