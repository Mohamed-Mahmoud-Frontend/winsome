"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useSearchStore } from "@/features/hotels/store/searchStore";

const iconLocation = (
  <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const iconMap = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const inputBase =
  "min-w-0 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500";

export function SearchPreviewCard() {
  const router = useRouter();
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
      router.push("/hotels");
    },
    [router]
  );

  const totalGuests = guests.adults + guests.children;

  return (
    <section className="mt-14 w-full max-w-[420px] shrink-0 lg:mt-0">
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none"
      >
        <div className="border-b border-zinc-100 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Search hotels
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Enter a city or address to see results on the map
          </p>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label htmlFor="home-destination" className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Destination
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 transition focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:focus-within:border-amber-400/50 dark:focus-within:ring-amber-400/20">
              <span className="shrink-0" aria-hidden>{iconLocation}</span>
              <input
                id="home-destination"
                type="text"
                placeholder="e.g. Paris, London, Dubai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Destination (city or address)"
                className={inputBase}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="home-checkin" className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Check-in
              </label>
              <input
                id="home-checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setDates(e.target.value, checkOut)}
                min={new Date().toISOString().slice(0, 10)}
                aria-label="Check-in date"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-amber-400/50 dark:focus:ring-amber-400/20"
              />
            </div>
            <div>
              <label htmlFor="home-checkout" className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Check-out
              </label>
              <input
                id="home-checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setDates(checkIn, e.target.value)}
                min={checkIn}
                aria-label="Check-out date"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-amber-400/50 dark:focus:ring-amber-400/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Guests
            </label>
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <label htmlFor="home-adults" className="text-xs text-zinc-500 dark:text-zinc-400">
                  Adults
                </label>
                <input
                  id="home-adults"
                  type="number"
                  min={1}
                  max={9}
                  value={guests.adults}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    setGuests({ ...guests, adults: Number.isNaN(n) ? 1 : Math.min(9, Math.max(1, n)) });
                  }}
                  aria-label="Number of adults"
                  className="w-14 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-center text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="home-children" className="text-xs text-zinc-500 dark:text-zinc-400">
                  Children
                </label>
                <input
                  id="home-children"
                  type="number"
                  min={0}
                  max={9}
                  value={guests.children}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    setGuests({ ...guests, children: Number.isNaN(n) ? 0 : Math.min(9, Math.max(0, n)) });
                  }}
                  aria-label="Number of children"
                  className="w-14 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-center text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">
                1 room, {totalGuests} guest{totalGuests !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:bg-amber-500 dark:text-zinc-900 dark:hover:bg-amber-400 dark:focus:ring-offset-zinc-900"
          >
            Search on map
            {iconMap}
          </button>
        </div>
      </form>
    </section>
  );
}
