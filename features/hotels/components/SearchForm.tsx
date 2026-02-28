"use client";

import { useCallback } from "react";
import { useSearchStore } from "../store/searchStore";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";

const iconLocation = (
  <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const iconCalendar = (
  <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const iconGuests = (
  <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export function SearchForm({
  onSearch,
  isLoading,
  className,
}: {
  onSearch?: () => void;
  isLoading?: boolean;
  className?: string;
}) {
  const {
    location,
    checkIn,
    checkOut,
    guests,
    setLocation,
    setDates,
    setGuests,
  } = useSearchStore();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.();
    },
    [onSearch]
  );

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Hotel search"
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 sm:p-6",
        "grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.2fr_auto_auto_auto_auto] lg:items-end lg:gap-4",
        className
      )}
    >
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="search-location" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          Location
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 transition focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-200 dark:border-zinc-600 dark:bg-zinc-800/50 dark:focus-within:border-zinc-500 dark:focus-within:ring-zinc-700">
          <span className="shrink-0" aria-hidden>{iconLocation}</span>
          <input
            id="search-location"
            type="text"
            placeholder="City or area"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Search location (city or area)"
            className="min-w-0 flex-1 bg-transparent text-zinc-900 placeholder:text-zinc-500 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="search-checkin" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          Check-in
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 dark:border-zinc-600 dark:bg-zinc-800/50">
          <span className="shrink-0" aria-hidden>{iconCalendar}</span>
          <input
            id="search-checkin"
            type="date"
            value={checkIn}
            onChange={(e) => setDates(e.target.value, checkOut)}
            min={new Date().toISOString().slice(0, 10)}
            aria-label="Check-in date"
            className="min-w-0 flex-1 bg-transparent text-zinc-900 focus:outline-none dark:text-zinc-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="search-checkout" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          Check-out
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 dark:border-zinc-600 dark:bg-zinc-800/50">
          <span className="shrink-0" aria-hidden>{iconCalendar}</span>
          <input
            id="search-checkout"
            type="date"
            value={checkOut}
            onChange={(e) => setDates(checkIn, e.target.value)}
            min={checkIn}
            aria-label="Check-out date"
            className="min-w-0 flex-1 bg-transparent text-zinc-900 focus:outline-none dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-3">
          <span className="shrink-0" aria-hidden>{iconGuests}</span>
          <div className="flex items-center gap-3">
            <div>
              <label htmlFor="search-adults" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Adults
              </label>
              <input
                id="search-adults"
                type="number"
                min={1}
                max={9}
                value={guests.adults}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  setGuests({ ...guests, adults: Number.isNaN(n) ? 1 : Math.min(9, Math.max(1, n)) });
                }}
                aria-label="Number of adults"
                className="w-16 rounded-lg border border-zinc-200 bg-zinc-50/50 px-2 py-2 text-center text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:ring-zinc-600"
              />
            </div>
            <div>
              <label htmlFor="search-children" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Children
              </label>
              <input
                id="search-children"
                type="number"
                min={0}
                max={9}
                value={guests.children}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  setGuests({ ...guests, children: Number.isNaN(n) ? 0 : Math.min(9, Math.max(0, n)) });
                }}
                aria-label="Number of children"
                className="w-16 rounded-lg border border-zinc-200 bg-zinc-50/50 px-2 py-2 text-center text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:ring-zinc-600"
              />
            </div>
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          className="min-w-[120px] flex-1 lg:flex-none"
          isLoading={isLoading}
        >
          Search
        </Button>
      </div>
    </form>
  );
}
