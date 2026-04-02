"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  RefreshCw,
  Clock,
} from "lucide-react";
import { CryptoData, CoinGroup } from "@/types/crypto";
import {
  processRawData,
  groupDataByCoin,
  calculateMarketMetrics,
  formatCurrency,
  formatPercent,
  formatFullTimestamp,
} from "@/lib/utils";
import { MetricCard } from "./MetricCard";
import { PriceChart } from "./PriceChart";
import { CryptoTable } from "./CryptoTable";
import { LoadingState, ErrorState } from "./LoadingState";
import { SectionErrorBoundary } from "./ErrorBoundary";

const API_URL = "https://sheetdb.io/api/v1/04jb1uhz2jl2u";

export function Dashboard() {
  const [rawData, setRawData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(API_URL, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CryptoData[] = await response.json();
      setRawData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch market data"
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const coinGroups: Map<string, CoinGroup> = useMemo(() => {
    if (rawData.length === 0) return new Map();
    const processed = processRawData(rawData);
    return groupDataByCoin(processed);
  }, [rawData]);

  const metrics = useMemo(() => {
    return calculateMarketMetrics(coinGroups);
  }, [coinGroups]);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchData()} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Activity className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-50">
                  Crypto Market Pulse
                </h1>
                <p className="text-sm text-slate-400">
                  Real-time cryptocurrency market data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span className="font-mono">
                    {formatFullTimestamp(lastUpdated)}
                  </span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-slate-700 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Refresh market data"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Metric Cards */}
        <section aria-label="Market Summary" className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Market Cap"
              value={formatCurrency(metrics.totalMarketCap)}
              subtitle={`${coinGroups.size} coins tracked`}
              icon={<DollarSign className="h-5 w-5" aria-hidden="true" />}
            />
            <MetricCard
              title="24h Trading Volume"
              value={formatCurrency(metrics.total24hVolume)}
              subtitle="Across all markets"
              icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
              highlight
            />
            {metrics.topGainer && (
              <MetricCard
                title="Top Gainer (24h)"
                value={metrics.topGainer.symbol}
                subtitle={metrics.topGainer.coin_name}
                icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
                trend={{
                  value: `+${formatPercent(
                    metrics.topGainer.latestData.change_24h_percent
                  )}`,
                  isPositive: true,
                }}
              />
            )}
            {metrics.topLoser && (
              <MetricCard
                title="Top Loser (24h)"
                value={metrics.topLoser.symbol}
                subtitle={metrics.topLoser.coin_name}
                icon={<TrendingDown className="h-5 w-5" aria-hidden="true" />}
                trend={{
                  value: `-${formatPercent(
                    metrics.topLoser.latestData.change_24h_percent
                  )}`,
                  isPositive: false,
                }}
              />
            )}
          </div>
        </section>

        {/* Price Chart */}
        <section aria-label="Price Chart" className="mb-8">
          <SectionErrorBoundary>
            <PriceChart coinGroups={coinGroups} />
          </SectionErrorBoundary>
        </section>

        {/* Data Table */}
        <section aria-label="Cryptocurrency Comparison Table">
          <SectionErrorBoundary>
            <CryptoTable coinGroups={coinGroups} />
          </SectionErrorBoundary>
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
            <p>
              Data provided by SheetDB API. Auto-refreshes every 60 seconds.
            </p>
            <p className="font-mono text-xs">
              {coinGroups.size} coins •{" "}
              {rawData.length} data points
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
