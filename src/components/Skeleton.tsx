"use client";

import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-800",
        className
      )}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32 mt-2" />
          <Skeleton className="h-3 w-20 mt-2" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-16 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="mb-4 flex items-baseline gap-3">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-800">
      <td className="px-4 py-4 sm:px-6">
        <Skeleton className="h-4 w-6" />
      </td>
      <td className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right sm:px-6">
        <Skeleton className="h-4 w-20 ml-auto" />
      </td>
      <td className="px-4 py-4 text-right sm:px-6">
        <Skeleton className="h-6 w-16 ml-auto rounded-md" />
      </td>
      <td className="px-4 py-4 text-right sm:px-6">
        <Skeleton className="h-4 w-16 ml-auto" />
      </td>
      <td className="px-4 py-4 text-right sm:px-6">
        <Skeleton className="h-4 w-16 ml-auto" />
      </td>
      <td className="px-4 py-4 text-center sm:px-6">
        <Skeleton className="h-5 w-5 mx-auto" />
      </td>
    </tr>
  );
}

export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-4 sm:p-6">
        <Skeleton className="h-6 w-36 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="px-4 py-3 sm:px-6"><Skeleton className="h-3 w-4" /></th>
              <th className="px-4 py-3 sm:px-6"><Skeleton className="h-3 w-12" /></th>
              <th className="px-4 py-3 sm:px-6"><Skeleton className="h-3 w-12 ml-auto" /></th>
              <th className="px-4 py-3 sm:px-6"><Skeleton className="h-3 w-16 ml-auto" /></th>
              <th className="px-4 py-3 sm:px-6"><Skeleton className="h-3 w-16 ml-auto" /></th>
              <th className="px-4 py-3 sm:px-6"><Skeleton className="h-3 w-16 ml-auto" /></th>
              <th className="px-4 py-3 sm:px-6"><Skeleton className="h-3 w-12 mx-auto" /></th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {/* Header Skeleton */}
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-48 mb-1" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </header>

        {/* Metric Cards Skeleton */}
        <section className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Chart Skeleton */}
        <section className="mb-8">
          <ChartSkeleton />
        </section>

        {/* Table Skeleton */}
        <section>
          <TableSkeleton />
        </section>
      </div>
    </div>
  );
}
