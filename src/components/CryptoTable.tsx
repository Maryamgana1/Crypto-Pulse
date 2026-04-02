"use client";

import { useState, useMemo } from "react";
import { CoinGroup } from "@/types/crypto";
import { formatPrice, formatCurrency, formatPercent, cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

interface CryptoTableProps {
  coinGroups: Map<string, CoinGroup>;
}

type SortKey = "market_cap" | "price" | "change_24h" | "volume_24h";
type SortDirection = "asc" | "desc";

export function CryptoTable({ coinGroups }: CryptoTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSortedCoins = useMemo(() => {
    let coins = Array.from(coinGroups.values());

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      coins = coins.filter(
        (coin) =>
          coin.coin_name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      );
    }

    // Sort
    coins.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortKey) {
        case "market_cap":
          aVal = a.latestData.market_cap_usd;
          bVal = b.latestData.market_cap_usd;
          break;
        case "price":
          aVal = a.latestData.price_usd;
          bVal = b.latestData.price_usd;
          break;
        case "change_24h":
          aVal = a.latestData.change_24h_percent;
          bVal = b.latestData.change_24h_percent;
          break;
        case "volume_24h":
          aVal = a.latestData.volume_24h_usd;
          bVal = b.latestData.volume_24h_usd;
          break;
        default:
          return 0;
      }
      return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
    });

    return coins;
  }, [coinGroups, searchQuery, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-600" />;
    }
    return sortDirection === "desc" ? (
      <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
    ) : (
      <ChevronUp className="h-3.5 w-3.5 text-blue-500" />
    );
  };

  if (Array.from(coinGroups.values()).length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-50">Market Overview</h3>
            <p className="mt-1 text-sm text-slate-400">
              Latest cryptocurrency data comparison
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search coins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6">
                Coin
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-200 sm:px-6"
                onClick={() => handleSort("price")}
              >
                <span className="inline-flex items-center gap-1">
                  Price
                  <SortIcon columnKey="price" />
                </span>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-200 sm:px-6"
                onClick={() => handleSort("change_24h")}
              >
                <span className="inline-flex items-center gap-1">
                  24h Change
                  <SortIcon columnKey="change_24h" />
                </span>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-200 sm:px-6"
                onClick={() => handleSort("market_cap")}
              >
                <span className="inline-flex items-center gap-1">
                  Market Cap
                  <SortIcon columnKey="market_cap" />
                </span>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-200 sm:px-6"
                onClick={() => handleSort("volume_24h")}
              >
                <span className="inline-flex items-center gap-1">
                  24h Volume
                  <SortIcon columnKey="volume_24h" />
                </span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredAndSortedCoins.map((coin, index) => {
              const data = coin.latestData;
              const isPositive = data.change_24h_percent >= 0;

              return (
                <tr
                  key={coin.coin_id}
                  className="cursor-pointer transition-colors duration-200 hover:bg-slate-800/50"
                >
                  <td className="px-4 py-4 sm:px-6">
                    <span className="font-mono text-sm text-slate-500">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white",
                          getCoinBgColor(coin.coin_id)
                        )}
                      >
                        {coin.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-50">
                          {coin.coin_name}
                        </p>
                        <p className="font-mono text-xs text-slate-500">
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right sm:px-6">
                    <span className="font-mono text-sm font-medium text-slate-50">
                      {formatPrice(data.price_usd)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right sm:px-6">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-sm font-medium",
                        isPositive
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      {isPositive ? "+" : "-"}{formatPercent(data.change_24h_percent)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right sm:px-6">
                    <span className="font-mono text-sm text-slate-300">
                      {formatCurrency(data.market_cap_usd)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right sm:px-6">
                    <span className="font-mono text-sm text-slate-300">
                      {formatCurrency(data.volume_24h_usd)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center sm:px-6">
                    {isPositive ? (
                      <TrendingUp className="mx-auto h-5 w-5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="mx-auto h-5 w-5 text-red-500" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="divide-y divide-slate-800 md:hidden">
        {filteredAndSortedCoins.map((coin, index) => {
          const data = coin.latestData;
          const isPositive = data.change_24h_percent >= 0;

          return (
            <div
              key={coin.coin_id}
              className="p-4 transition-colors duration-200 hover:bg-slate-800/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-500 w-6">
                    {index + 1}
                  </span>
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white",
                      getCoinBgColor(coin.coin_id)
                    )}
                  >
                    {coin.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-50">{coin.coin_name}</p>
                    <p className="font-mono text-xs text-slate-500">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-medium text-slate-50">
                    {formatPrice(data.price_usd)}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs font-medium",
                      isPositive
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-red-500/10 text-red-500"
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {isPositive ? "+" : "-"}{formatPercent(data.change_24h_percent)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-800/50 px-3 py-2">
                  <p className="text-xs text-slate-500 mb-1">Market Cap</p>
                  <p className="font-mono text-slate-300">
                    {formatCurrency(data.market_cap_usd)}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 px-3 py-2">
                  <p className="text-xs text-slate-500 mb-1">24h Volume</p>
                  <p className="font-mono text-slate-300">
                    {formatCurrency(data.volume_24h_usd)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedCoins.length === 0 && searchQuery && (
        <div className="flex h-32 items-center justify-center">
          <p className="text-slate-400">No coins match "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

function getCoinBgColor(coinId: string): string {
  const colors: Record<string, string> = {
    bitcoin: "bg-[#F7931A]",
    ethereum: "bg-[#627EEA]",
    ripple: "bg-[#23292F]",
    litecoin: "bg-[#345D9D]",
    cardano: "bg-[#0033AD]",
    solana: "bg-[#9945FF]",
    dogecoin: "bg-[#C2A633]",
    polkadot: "bg-[#E6007A]",
    tether: "bg-[#26A17B]",
    "binance-coin": "bg-[#F3BA2F]",
  };
  return colors[coinId] || "bg-blue-600";
}
