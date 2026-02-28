"use client";

import { Skeleton } from "@/components/ui";
import { cn } from "@/utils/cn";

export function HotelCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
        className
      )}
    >
      <Skeleton className="aspect-16/10 w-full" />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-4 h-6 w-24" />
      </div>
    </div>
  );
}
