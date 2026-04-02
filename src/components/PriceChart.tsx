"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { CoinGroup } from "@/types/crypto";
import { formatPrice, cn } from "@/lib/utils";

interface PriceChartProps {
  coinGroups: Map<string, CoinGroup>;
}

const COIN_COLORS: Record<string, string> = {
  bitcoin: "#F7931A",
  ethereum: "#627EEA",
  ripple: "#23292F",
  litecoin: "#BFBBBB",
  cardano: "#0033AD",
  solana: "#9945FF",
  dogecoin: "#C2A633",
  polkadot: "#E6007A",
};

const DEFAULT_COLOR = "#3B82F6";

export function PriceChart({ coinGroups }: PriceChartProps) {
  const availableCoins = useMemo(() => {
    return Array.from(coinGroups.values()).filter(
      (group) => group.history.length > 1
    );
  }, [coinGroups]);

  const [selectedCoin, setSelectedCoin] = useState<string>(
    availableCoins.find((c) => c.coin_id === "bitcoin")?.coin_id ||
      availableCoins[0]?.coin_id ||
      ""
  );

  const chartData = useMemo(() => {
    const group = coinGroups.get(selectedCoin);
    if (!group) return [];

    return group.history.map((item, idx) => ({
      idx,
      time: item.timestamp_formatted,
      price: item.price_usd,
      fullTime: item.timestamp_checked.toLocaleString(),
    }));
  }, [coinGroups, selectedCoin]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (chartData.length === 0) return { minPrice: 0, maxPrice: 100 };
    const prices = chartData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    const padding = Math.max(range * 0.15, 100);
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
    };
  }, [chartData]);

  const selectedGroup = coinGroups.get(selectedCoin);
  const coinColor = COIN_COLORS[selectedCoin] || DEFAULT_COLOR;

  if (availableCoins.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:border-slate-700">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">Price History</h3>
          <p className="mt-1 text-sm text-slate-400">
            Historical price data over time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableCoins.slice(0, 5).map((group) => (
            <button
              key={group.coin_id}
              onClick={() => setSelectedCoin(group.coin_id)}
              className={cn(
                "cursor-pointer rounded-lg px-4 py-2 font-mono text-sm font-medium transition-colors duration-200",
                selectedCoin === group.coin_id
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
              )}
            >
              {group.symbol}
            </button>
          ))}
        </div>
      </div>

      {selectedGroup && (
        <div className="mb-4 flex items-baseline gap-3">
          <span
            className="font-mono text-3xl font-bold"
            style={{ color: coinColor }}
          >
            {formatPrice(selectedGroup.latestData.price_usd)}
          </span>
          <span
            className={cn(
              "font-mono text-sm font-medium",
              selectedGroup.latestData.change_24h_percent >= 0
                ? "text-emerald-500"
                : "text-red-500"
            )}
          >
            {selectedGroup.latestData.change_24h_percent >= 0 ? "+" : "-"}
            {Math.abs(selectedGroup.latestData.change_24h_percent).toFixed(2)}%
          </span>
        </div>
      )}

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`lineGradient-${selectedCoin}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={coinColor} stopOpacity={0.5} />
                <stop offset="100%" stopColor={coinColor} stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              tick={{ fill: "#64748b" }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              domain={[minPrice, maxPrice]}
              tick={{ fill: "#64748b" }}
              tickFormatter={(value) => {
                const absVal = Math.abs(value);
                const sign = value < 0 ? "-" : "";
                if (absVal >= 1000) return `${sign}$${(absVal / 1000).toFixed(1)}K`;
                return `${sign}$${absVal.toFixed(0)}`;
              }}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc",
              }}
              labelStyle={{ color: "#94A3B8" }}
              formatter={(value) => [formatPrice(Number(value)), "Price"]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
            <Line
              type="linear"
              dataKey="price"
              name={selectedGroup?.coin_name || "Price"}
              stroke={coinColor}
              strokeWidth={2}
              dot={{ r: 4, fill: coinColor, stroke: "#0B0F19", strokeWidth: 1 }}
              activeDot={{
                r: 6,
                fill: coinColor,
                stroke: "#0B0F19",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
