import { NextRequest, NextResponse } from "next/server";
import { getHotelById, getRecommendedHotels } from "@/features/hotels/mocks/hotelMock";
import type { HotelResult, HotelReview, RatingBreakdown } from "@/types/hotel";

const SEARCHAPI_BASE = "https://www.searchapi.io/api/v1/search";

/** Map SearchApi property response to HotelResult. */
function mapPropertyToHotel(p: {
  property_token?: string;
  name?: string;
  link?: string;
  description?: string;
  address?: string;
  gps_coordinates?: { latitude?: number; longitude?: number };
  price_per_night?: { extracted_price?: number; price?: string };
  total_price?: { extracted_price?: number };
  rating?: number;
  reviews?: number;
  images?: Array<{ thumbnail?: string; original?: string }>;
  hotel_class?: string;
  review_results?: { reviews?: Array<{ username?: string; text?: string }> };
  reviews_histogram?: Record<string, number>;
}): HotelResult {
  const lat = p.gps_coordinates?.latitude;
  const lng = p.gps_coordinates?.longitude;
  const amount = p.price_per_night?.extracted_price ?? p.total_price?.extracted_price ?? 0;
  const images = p.images?.map((i) => i.original ?? i.thumbnail).filter(Boolean) as string[] | undefined;
  const thumb = p.images?.[0]?.thumbnail ?? p.images?.[0]?.original;

  let review_list: HotelReview[] | undefined;
  if (p.review_results?.reviews?.length) {
    review_list = p.review_results.reviews.map((r) => ({
      text: r.text ?? "",
      author: r.username,
    }));
  }

  let rating_breakdown: RatingBreakdown | undefined;
  if (p.reviews_histogram && typeof p.reviews_histogram === "object") {
    rating_breakdown = {};
    for (const [k, v] of Object.entries(p.reviews_histogram)) {
      const num = parseInt(k, 10);
      if (num >= 1 && num <= 5) rating_breakdown[num as 1 | 2 | 3 | 4 | 5] = v;
    }
  }

  return {
    title: p.name ?? "",
    link: p.link ?? "",
    place_id: p.property_token,
    description: p.description,
    address: p.address,
    latitude: lat,
    longitude: lng,
    thumbnail: thumb,
    images: images?.length ? images : (thumb ? [thumb] : undefined),
    rating: p.rating,
    reviews: p.reviews,
    rating_breakdown,
    review_list,
    price: amount ? { amount, currency: "USD", period: "night" } : undefined,
    type: p.hotel_class ?? undefined,
  };
}

/** Map "people_also_viewed" or similar item to HotelResult. */
function mapAlsoViewedToHotel(p: {
  property_token?: string;
  name?: string;
  link?: string;
  description?: string;
  gps_coordinates?: { latitude?: number; longitude?: number };
  price_per_night?: { extracted_price?: number };
  rating?: number;
  reviews?: number;
  images?: Array<{ thumbnail?: string; original?: string }>;
}): HotelResult {
  const thumb = p.images?.[0]?.thumbnail ?? p.images?.[0]?.original;
  const amount = p.price_per_night?.extracted_price;
  return {
    title: p.name ?? "",
    link: p.link ?? "",
    place_id: p.property_token,
    description: p.description,
    latitude: p.gps_coordinates?.latitude,
    longitude: p.gps_coordinates?.longitude,
    thumbnail: thumb,
    rating: p.rating,
    reviews: p.reviews,
    price: amount != null ? { amount, currency: "USD", period: "night" } : undefined,
  };
}

/** Fetch hotel details from SearchApi Google Hotels Property API. */
async function fetchPropertyFromSearchApi(
  propertyToken: string,
  checkIn: string,
  checkOut: string
): Promise<{ hotel: HotelResult; recommended: HotelResult[] } | null> {
  const apiKey = process.env.SEARCHAPI_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    engine: "google_hotels_property",
    api_key: apiKey,
    property_token: propertyToken,
    check_in_date: checkIn,
    check_out_date: checkOut,
  });

  const url = `${SEARCHAPI_BASE}?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) return null;

  const data = await res.json();
  const prop = data.property;
  if (!prop) return null;

  const hotel = mapPropertyToHotel(prop);

  const alsoViewed = data.people_also_viewed ?? [];
  const recommended = Array.isArray(alsoViewed)
    ? alsoViewed.slice(0, 4).map((p: Record<string, unknown>) => mapAlsoViewedToHotel(p as Parameters<typeof mapAlsoViewedToHotel>[0]))
    : [];

  return { hotel, recommended };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing hotel id" }, { status: 400 });
  }

  // 1) Try mock first (supports place_id and slug)
  const mockHotel = getHotelById(id);
  if (mockHotel) {
    const recommended = getRecommendedHotels(mockHotel, 4);
    return NextResponse.json({ hotel: mockHotel, recommended });
  }

  // 2) If not in mock and we have SearchApi key, fetch from Google Hotels Property API
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("check_in") ?? searchParams.get("check_in_date") ?? new Date().toISOString().slice(0, 10);
  const checkOut = searchParams.get("check_out") ?? searchParams.get("check_out_date") ?? new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const fromApi = await fetchPropertyFromSearchApi(id, checkIn, checkOut);
  if (fromApi) {
    return NextResponse.json(fromApi);
  }

  return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
}
