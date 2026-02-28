"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useSearchStore } from "../store/searchStore";
import type { HotelResult } from "@/types/hotel";
import type { MapBounds } from "@/types/hotel";

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 };
const DEFAULT_ZOOM = 12;
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

export function HotelsMap({
  hotels,
  className,
}: {
  hotels: HotelResult[];
  className?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });
  const { mapCenter, setMapCenter, setMapBounds } = useSearchStore();
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      map.addListener("idle", () => {
        const center = map.getCenter();
        const b = map.getBounds();
        if (center) {
          setMapCenter({ lat: center.lat(), lng: center.lng() });
        }
        if (b) {
          const ne = b.getNorthEast();
          const sw = b.getSouthWest();
          setMapBounds({
            ne: { lat: ne.lat(), lng: ne.lng() },
            sw: { lat: sw.lat(), lng: sw.lng() },
          });
        }
      });
    },
    [setMapBounds, setMapCenter]
  );

  // عند تغيير mapCenter (مثلاً من جيوكود Location) نحرّك الخريطة لهناك
  useEffect(() => {
    if (!mapRef.current || !mapCenter) return;
    mapRef.current.panTo(mapCenter);
    mapRef.current.setZoom?.(DEFAULT_ZOOM);
  }, [mapCenter?.lat, mapCenter?.lng]);

  const markers = useMemo(
    () =>
      hotels.filter(
        (h): h is HotelResult & { latitude: number; longitude: number } =>
          h.latitude != null && h.longitude != null
      ),
    [hotels]
  );

  if (loadError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-8 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 ${className ?? ""}`}
      >
        <p className="font-medium">Map failed to load</p>
        <p className="text-sm">Enable &quot;Maps JavaScript API&quot; for your key in Google Cloud Console.</p>
        <a
          href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm text-blue-600 underline dark:text-blue-400"
        >
          Enable Maps JavaScript API →
        </a>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-8 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 ${className ?? ""}`}
      >
        <p>أضف مفتاح Google Maps لعرض الخريطة.</p>
        <p className="text-sm">Add <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">.env.local</code></p>
        <a
          href="https://console.cloud.google.com/apis/credentials"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm font-medium text-blue-600 underline dark:text-blue-400"
        >
          Get API key من هنا / Get key here →
        </a>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 ${className ?? ""}`}
      >
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={className} style={{ minHeight: 300 }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%", minHeight: 300, borderRadius: "0.75rem" }}
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        options={MAP_OPTIONS}
        onLoad={onLoad}
      >
        {markers.map((hotel, index) => (
          <Marker
            key={hotel.place_id ?? `marker-${hotel.latitude}-${hotel.longitude}-${index}`}
            position={{ lat: hotel.latitude, lng: hotel.longitude }}
            title={hotel.title}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
