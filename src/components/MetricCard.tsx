"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlight?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlight = false,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200",
        "hover:border-slate-700 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
        highlight && "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-slate-50">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 font-mono text-sm text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-2 font-mono text-sm font-medium",
                trend.isPositive ? "text-emerald-500" : "text-red-500"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            "rounded-lg p-2.5",
            highlight
              ? "bg-amber-500/10 text-amber-500"
              : "bg-blue-500/10 text-blue-500"
          )}
        >
          {icon}
        </div>
      </div>
      {highlight && (
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5" />
      )}
    </div>
  );
}
