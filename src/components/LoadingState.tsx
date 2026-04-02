"use client";

import { Activity } from "lucide-react";
import { DashboardSkeleton } from "./Skeleton";

export function LoadingState() {
  return <DashboardSkeleton />;
}

// Keep the spinner for refresh operations
export function RefreshSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0F19]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500" />
          <Activity className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-slate-50">Loading market data...</p>
          <p className="mt-1 text-sm text-slate-400">Fetching latest cryptocurrency prices</p>
        </div>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0F19] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-slate-50">
          Failed to load data
        </h2>
        <p className="mb-6 text-slate-400">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-blue-500"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
