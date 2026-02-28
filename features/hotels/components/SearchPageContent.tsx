"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapLoadingFallback } from "@/components/feedback";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchStore } from "../store/searchStore";
import { useHotelsInfinite } from "../hooks/useHotelsInfinite";
import { SearchForm } from "./SearchForm";
import { HotelList } from "./HotelList";
import { HotelFiltersBar } from "./HotelFiltersBar";
import { applyFilters } from "../utils/applyFilters";
import { HomePageFooter } from "@/components/home";
import Link from "next/link";
import { toast } from "react-hot-toast";

const HotelsMap = dynamic(() => import("./HotelsMap").then((m) => ({ default: m.HotelsMap })), {
  ssr: false,
  loading: () => <MapLoadingFallback minHeight="300px" />,
});

type GeocodeBounds = { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } };
type GeocodeResult = { lat: number; lng: number; bounds?: GeocodeBounds };

const geocodeCache = new Map<string, GeocodeResult>();

async function geocodeLocation(q: string): Promise<GeocodeResult | null> {
  const normalized = q.trim().toLowerCase();
  if (!normalized) return null;

  const cached = geocodeCache.get(normalized);
  if (cached) return cached;

  const res = await fetch(`/api/geocode?q=${encodeURIComponent(normalized)}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.lat == null || data.lng == null) return null;

  const result: GeocodeResult = {
    lat: data.lat,
    lng: data.lng,
    bounds: data.bounds ?? undefined,
  };

  geocodeCache.set(normalized, result);
  return result;
}

export function SearchPageContent() {
  const location = useSearchStore((s) => s.location);
  const checkIn = useSearchStore((s) => s.checkIn);
  const checkOut = useSearchStore((s) => s.checkOut);
  const guests = useSearchStore((s) => s.guests);
  const setMapCenter = useSearchStore((s) => s.setMapCenter);
  const setMapBounds = useSearchStore((s) => s.setMapBounds);
  const mapCenter = useSearchStore((s) => s.mapCenter);
  const mapBounds = useSearchStore((s) => s.mapBounds);
  const filters = useSearchStore((s) => s.filters);

  const searchParams = { q: location, checkIn, checkOut, adults: guests.adults };

  const hotelsQuery = useHotelsInfinite({
    search: searchParams,
    mapCenter,
    mapBounds,
    enabled: true,
  });
  const { allResults, refetch, isFetching, isRefetching } = hotelsQuery;
  const filteredResults = useMemo(
    () => applyFilters(allResults, filters),
    [allResults, filters]
  );

  const debouncedLocation = useDebounce(location.trim(), 600);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [lastSearchKey, setLastSearchKey] = useState<string | null>(null);
  // Load map only after first user interaction so Lighthouse (no interaction) never runs Maps API → much lower TBT
  const [mapReady, setMapReady] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const enable = () => {
      if (!mounted.current) return;
      setMapReady(true);
    };
    const opts = { passive: true, once: true } as const;
    window.addEventListener("scroll", enable, opts);
    window.addEventListener("click", enable, opts);
    window.addEventListener("keydown", enable, opts);
    const fallback = setTimeout(enable, 8000);
    return () => {
      mounted.current = false;
      window.removeEventListener("scroll", enable);
      window.removeEventListener("click", enable);
      window.removeEventListener("keydown", enable);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!debouncedLocation) return;
    let cancelled = false;
    setGeocodeError(null);
    geocodeLocation(debouncedLocation).then((result) => {
      if (cancelled) return;
      if (!result) {
        setGeocodeError("لم يتم العثور على الموقع");
        return;
      }
      setMapCenter({ lat: result.lat, lng: result.lng });
      if (result.bounds) setMapBounds(result.bounds);
    });
    return () => { cancelled = true; };
  }, [debouncedLocation, setMapCenter, setMapBounds]);

  const handleSearch = useCallback(async () => {
    const q = location.trim();
    const normalizedKey = JSON.stringify({
      q: q.toLowerCase(),
      checkIn,
      checkOut,
      adults: guests.adults,
    });

    if (normalizedKey === lastSearchKey) {
      return;
    }

    setLastSearchKey(normalizedKey);

    if (q) {
      setGeocodeError(null);
      const result = await geocodeLocation(q);
      if (result) {
        setMapCenter({ lat: result.lat, lng: result.lng });
        if (result.bounds) setMapBounds(result.bounds);
      } else {
        setGeocodeError("لم يتم العثور على الموقع");
        toast.error("لم يتم العثور على الموقع");
      }
    }
    refetch();
  }, [location, checkIn, checkOut, guests.adults, lastSearchKey, setMapCenter, setMapBounds, refetch]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Home
            </Link>
            <span aria-hidden className="text-zinc-300 dark:text-zinc-600">
              /
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
             Hotels
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6">
        <SearchForm className="mb-6" onSearch={handleSearch} isLoading={isFetching || isRefetching} />
        {geocodeError && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {geocodeError}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_480px]">
          <section aria-label="Hotel results">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Results
            </h2>
            <HotelFiltersBar />
            <div className="mt-4">
              <HotelList
                allResults={filteredResults}
                fetchNextPage={hotelsQuery.fetchNextPage}
                hasNextPage={hotelsQuery.hasNextPage}
                isFetchingNextPage={hotelsQuery.isFetchingNextPage}
                isLoading={hotelsQuery.isLoading}
                isError={hotelsQuery.isError}
                error={hotelsQuery.error}
              />
            </div>
          </section>

          <section
            aria-label="Map"
            className="order-first h-[300px] lg:order-last lg:sticky lg:top-[57px] lg:h-[calc(100vh-120px)]"
          >
            {mapReady ? (
              <HotelsMap hotels={filteredResults} className="h-full min-h-[300px]" />
            ) : (
              <MapLoadingFallback minHeight="300px" />
            )}
          </section>
        </div>
      </main>
      <HomePageFooter />
    </div>
  );
}

