import { NextRequest, NextResponse } from "next/server";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "Missing q (location query)" }, { status: 400 });
  }

  try {
    const url = new URL(NOMINATIM);
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("addressdetails", "0");

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json", "User-Agent": "HotelSearchApp/1.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Location not found", lat: null, lng: null }, { status: 404 });
    }
    const first = data[0] as { lat: string; lon: string; boundingbox?: string[] };
    const lat = parseFloat(first.lat);
    const lng = parseFloat(first.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 502 });
    }
    let bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } } | undefined;
    if (Array.isArray(first.boundingbox) && first.boundingbox.length >= 4) {
      const [s, n, w, e] = first.boundingbox.map(Number);
      bounds = {
        sw: { lat: s, lng: w },
        ne: { lat: n, lng: e },
      };
    } else {
      const delta = 0.05;
      bounds = {
        sw: { lat: lat - delta, lng: lng - delta },
        ne: { lat: lat + delta, lng: lng + delta },
      };
    }
    return NextResponse.json({ lat, lng, bounds });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
