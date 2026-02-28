"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { HotelCard } from "./HotelCard";
import { HotelCardSkeleton } from "./HotelCardSkeleton";
import { useSearchStore } from "../store/searchStore";
import { EmptyState } from "@/components/feedback";
import type { HotelResult } from "@/types/hotel";
import { toast } from "react-hot-toast";

export interface HotelListProps {
  allResults: HotelResult[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const HotelList: React.FC<HotelListProps> = ({
  allResults,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
  error,
}) => {
  const resetToDefault = useSearchStore((s) => s.resetToDefault);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message ?? "Failed to load hotels");
    }
  }, [isError, error]);

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/30">
        <p className="font-medium text-red-800 dark:text-red-200">
          Failed to load hotels
        </p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error?.message ?? "Please try again later."}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (allResults.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
        description="No hotels found. Try another location or dates."
        action={{ label: "Reset search", onClick: resetToDefault }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {allResults.map((hotel: HotelResult, index: number) => (
          <HotelCard
            key={hotel.place_id ?? hotel.link ?? `hotel-${index}`}
            hotel={hotel}
            priority={index === 0}
          />
        ))}
      </div>
      {isFetchingNextPage && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <HotelCardSkeleton />
          <HotelCardSkeleton />
          <HotelCardSkeleton />
        </div>
      )}
      <div ref={sentinelRef} className="h-4" aria-hidden />
    </div>
  );
};
