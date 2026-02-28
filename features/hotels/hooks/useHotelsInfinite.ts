"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchHotelsPage } from "../api/hotelsApi";
import { useDebounce } from "@/hooks/useDebounce";
import type { GeoCoordinates, MapBounds } from "@/types/hotel";

const QUERY_KEY = "hotels-infinite";

function toLl(center: GeoCoordinates | null): string | undefined {
  if (!center) return undefined;
  return `${Number(center.lat.toFixed(4))},${Number(center.lng.toFixed(4))}`;
}

/** Stable key from bounds (rounded) so pan/zoom refetches with updated viewport. */
function toBoundsKey(bounds: MapBounds | null): string | undefined {
  if (!bounds) return undefined;
  const sw = bounds.sw;
  const ne = bounds.ne;
  return `${Number(sw.lat.toFixed(3))},${Number(sw.lng.toFixed(3))},${Number(ne.lat.toFixed(3))},${Number(ne.lng.toFixed(3))}`;
}

export interface UseHotelsInfiniteParams {
  search: {
    q: string;
    checkIn: string;
    checkOut: string;
    adults: number;
  };
  mapCenter?: GeoCoordinates | null;
  /** When user moves/zooms the map, hotels are loaded for this bounds (mock filters by bounds; real API uses ll). */
  mapBounds?: MapBounds | null;
  enabled?: boolean;
}

export function useHotelsInfinite({ search, mapCenter, mapBounds, enabled = true }: UseHotelsInfiniteParams) {
  const ll = useMemo(() => toLl(mapCenter ?? null), [mapCenter?.lat, mapCenter?.lng]);
  const debouncedBounds = useDebounce(mapBounds ?? null, 400);
  const boundsKey = useMemo(() => toBoundsKey(debouncedBounds), [debouncedBounds]);

  const queryKey = useMemo(
    () => [
      QUERY_KEY,
      search.q,
      search.checkIn,
      search.checkOut,
      search.adults,
      boundsKey ?? ll,
    ],
    [search.q, search.checkIn, search.checkOut, search.adults, boundsKey, ll]
  );

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async (context: { pageParam: string | number; signal: AbortSignal }) => {
      const pageParam = context.pageParam ?? 1;
      const page = typeof pageParam === "number" ? pageParam : Number(pageParam);
      return fetchHotelsPage({
        pageParam: page,
        signal: context.signal,
        bounds: debouncedBounds ?? undefined,
        search: {
          q: search.q,
          checkIn: search.checkIn,
          checkOut: search.checkOut,
          adults: search.adults,
        },
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    enabled,
  });

  const allResults = useMemo(
    () => query.data?.pages.flatMap((p) => p.results) ?? [],
    [query.data]
  );

  return { ...query, allResults };
}
