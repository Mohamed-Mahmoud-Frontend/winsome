import { NextRequest, NextResponse } from "next/server";
import { getMockHotelsPaginated } from "@/features/hotels/mocks/hotelMock";
import type { HotelResult } from "@/types/hotel";

const SEARCHAPI_BASE = "https://www.searchapi.io/api/v1/search";

/** Use mock when USE_MOCK_HOTELS is set (default) or when SEARCHAPI_KEY is missing. */
function isMockHotelsEnabled(): boolean {
  const useMock = process.env.USE_MOCK_HOTELS !== "0";
  const hasKey = !!process.env.SEARCHAPI_KEY;
  return useMock || !hasKey;
}

/** Map SearchApi.io "properties" item to our HotelResult shape. */
function mapSearchApiProperty(p: {
  property_token?: string;
  name?: string;
  link?: string;
  description?: string;
  gps_coordinates?: { latitude?: number; longitude?: number };
  price_per_night?: { extracted_price?: number; price?: string };
  total_price?: { extracted_price?: number };
  rating?: number;
  reviews?: number;
  images?: Array<{ thumbnail?: string; original?: string }>;
  city?: string;
  country?: string;
}): HotelResult {
  const lat = p.gps_coordinates?.latitude;
  const lng = p.gps_coordinates?.longitude;
  const thumb = p.images?.[0]?.thumbnail ?? p.images?.[0]?.original;
  const amount = p.price_per_night?.extracted_price ?? p.total_price?.extracted_price ?? 0;
  return {
    title: p.name ?? "",
    link: p.link ?? "",
    description: p.description ?? undefined,
    latitude: lat,
    longitude: lng,
    place_id: p.property_token,
    thumbnail: thumb,
    rating: p.rating,
    reviews: p.reviews,
    price: amount ? { amount, currency: "USD", period: "night" } : undefined,
    address: [p.city, p.country].filter(Boolean).join(", ") || undefined,
  };
}

/** Call SearchApi.io Google Hotels and return our unified response. */
async function fetchSearchApiHotels(params: {
  q: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  next_page_token?: string | null;
}): Promise<{ results: HotelResult[]; nextPage: string | null; total: number }> {
  const apiKey = process.env.SEARCHAPI_KEY!;
  const sp = new URLSearchParams({
    engine: "google_hotels",
    api_key: apiKey,
    q: params.q || "Hotels",
    check_in_date: params.check_in_date,
    check_out_date: params.check_out_date,
    adults: String(params.adults),
  });
  if (params.next_page_token) {
    sp.set("next_page_token", params.next_page_token);
  }

  const url = `${SEARCHAPI_BASE}?${sp.toString()}`;
  const res = await fetch(url, { next: { revalidate: 0 } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SearchApi error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const error = data.error ?? data.search_metadata?.status;
  if (error && String(error).toLowerCase() !== "success") {
    throw new Error(data.error ?? "SearchApi returned an error");
  }

  const properties = data.properties ?? [];
  const pagination = data.pagination ?? {};
  const nextToken = pagination.next_page_token ?? null;
  const total = data.search_information?.total_results ?? properties.length;

  const results = properties.map(mapSearchApiProperty);

  return {
    results,
    nextPage: nextToken,
    total: typeof total === "number" ? total : results.length,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (isMockHotelsEnabled()) {
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(20, Math.max(5, parseInt(searchParams.get("limit") ?? "10", 10) || 10));
    const sw_lat = searchParams.get("sw_lat") ? parseFloat(searchParams.get("sw_lat")!) : undefined;
    const sw_lng = searchParams.get("sw_lng") ? parseFloat(searchParams.get("sw_lng")!) : undefined;
    const ne_lat = searchParams.get("ne_lat") ? parseFloat(searchParams.get("ne_lat")!) : undefined;
    const ne_lng = searchParams.get("ne_lng") ? parseFloat(searchParams.get("ne_lng")!) : undefined;
    const data = getMockHotelsPaginated({ page, limit, sw_lat, sw_lng, ne_lat, ne_lng });
    return NextResponse.json(data);
  }

  // SearchApi.io mode: require q, check_in_date, check_out_date, adults
  const q = searchParams.get("q")?.trim() || "Hotels";
  const check_in_date = searchParams.get("check_in_date") || new Date().toISOString().slice(0, 10);
  const check_out_date = searchParams.get("check_out_date") || check_in_date;
  const adults = Math.min(10, Math.max(1, parseInt(searchParams.get("adults") ?? "2", 10) || 2));
  const next_page_token = searchParams.get("next_page_token") || undefined;

  try {
    const data = await fetchSearchApiHotels({
      q,
      check_in_date,
      check_out_date,
      adults,
      next_page_token: next_page_token || null,
    });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "SearchApi request failed";
    return NextResponse.json(
      { error: message, results: [], nextPage: null, total: 0 },
      { status: 503 }
    );
  }
}
