import { get, createAbortController } from "@/services/apiClient";
import type { MapBounds } from "@/types/hotel";

export interface FetchHotelsPageParams {
  /** Page number (mock) or next_page_token (SearchApi.io). */
  pageParam: number | string;
  /** Map bounds for dynamic load (mock API filters by bounds). */
  bounds?: MapBounds | null;
  /** Search params required for SearchApi.io mode (q, dates, adults). */
  search?: {
    q: string;
    checkIn: string;
    checkOut: string;
    adults: number;
  };
  signal?: AbortSignal;
}

export interface HotelsPageResponse {
  results: Array<{
    title: string;
    link: string;
    thumbnail?: string;
    position?: number;
    rating?: number;
    reviews?: number;
    price?: { amount: number; currency: string; period?: string };
    type?: string;
    description?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    extensions?: string[];
    place_id?: string;
  }>;
  /** Next page number (mock) or next_page_token (SearchApi.io). */
  nextPage: number | string | null;
  total: number;
}

/** Fetch one page from local /api/hotels (mock or SearchApi.io proxy). */
export async function fetchHotelsPage(
  params: FetchHotelsPageParams
): Promise<HotelsPageResponse> {
  const sp = new URLSearchParams();

  const isToken = typeof params.pageParam === "string";
  if (isToken) {
    sp.set("next_page_token", String(params.pageParam));
  } else {
    sp.set("page", String(params.pageParam));
    sp.set("limit", "10");
  }

  if (params.bounds) {
    sp.set("sw_lat", String(params.bounds.sw.lat));
    sp.set("sw_lng", String(params.bounds.sw.lng));
    sp.set("ne_lat", String(params.bounds.ne.lat));
    sp.set("ne_lng", String(params.bounds.ne.lng));
  }

  if (params.search) {
    sp.set("q", params.search.q);
    sp.set("check_in_date", params.search.checkIn);
    sp.set("check_out_date", params.search.checkOut);
    sp.set("adults", String(params.search.adults));
  }

  const url = `/hotels?${sp.toString()}`;
  return get<HotelsPageResponse>(url, { signal: params.signal });
}

export { createAbortController };
