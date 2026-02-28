import { create } from "zustand";
import type { GeoCoordinates, MapBounds, Guests } from "@/types/hotel";

const DEFAULT_CENTER: GeoCoordinates = { lat: 40.7128, lng: -74.006 };
const DEFAULT_BOUNDS: MapBounds = {
  ne: { lat: 40.82, lng: -73.9 },
  sw: { lat: 40.65, lng: -74.12 },
};
const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

export type RatingFilter = "any" | "4+" | "4or5";
export type AmenityFilter = "any" | "yes";

export interface HotelFiltersState {
  rating: RatingFilter;
  priceMin: number | null;
  priceMax: number | null;
  pool: AmenityFilter;
  spa: AmenityFilter;
  propertyType: string | null;
}

const DEFAULT_FILTERS: HotelFiltersState = {
  rating: "any",
  priceMin: null,
  priceMax: null,
  pool: "any",
  spa: "any",
  propertyType: null,
};

interface SearchState {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: Guests;
  mapCenter: GeoCoordinates;
  mapBounds: MapBounds | null;
  filters: HotelFiltersState;
  setLocation: (location: string) => void;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (guests: Guests) => void;
  setMapCenter: (center: GeoCoordinates) => void;
  setMapBounds: (bounds: MapBounds | null) => void;
  setFilters: (filters: Partial<HotelFiltersState>) => void;
  resetFilters: () => void;
  resetToDefault: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  location: "",
  checkIn: today,
  checkOut: tomorrow,
  guests: { adults: 1, children: 0 },
  mapCenter: DEFAULT_CENTER,
  mapBounds: DEFAULT_BOUNDS,
  filters: DEFAULT_FILTERS,
  setLocation: (location) => set({ location }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (guests) => set({ guests }),
  setMapCenter: (mapCenter) => set({ mapCenter }),
  setMapBounds: (mapBounds) => set({ mapBounds }),
  setFilters: (updates) =>
    set((s) => ({ filters: { ...s.filters, ...updates } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  resetToDefault: () =>
    set({
      mapCenter: DEFAULT_CENTER,
      mapBounds: DEFAULT_BOUNDS,
      location: "",
      filters: DEFAULT_FILTERS,
    }),
}));
