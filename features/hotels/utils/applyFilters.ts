import type { HotelResult } from "@/types/hotel";
import type { HotelFiltersState } from "../store/searchStore";

export function applyFilters(
  hotels: HotelResult[],
  filters: HotelFiltersState
): HotelResult[] {
  return hotels.filter((h) => {
    if (filters.rating !== "any") {
      const rating = h.rating ?? 0;
      if (filters.rating === "4+") {
        if (rating < 4) return false;
      } else if (filters.rating === "4or5") {
        if (rating < 4) return false;
      }
    }
    const amount = h.price?.amount ?? 0;
    if (filters.priceMin != null && amount < filters.priceMin) return false;
    if (filters.priceMax != null && amount > filters.priceMax) return false;
    if (filters.pool === "yes") {
      const text = [h.description, h.type, ...(h.extensions ?? [])].join(" ").toLowerCase();
      if (!text.includes("pool")) return false;
    }
    if (filters.spa === "yes") {
      const text = [h.description, h.type, ...(h.extensions ?? [])].join(" ").toLowerCase();
      if (!text.includes("spa")) return false;
    }
    if (filters.propertyType != null) {
      const type = (h.type ?? "").toLowerCase();
      const want = filters.propertyType!.toLowerCase();
      if (type !== want && !type.includes(want)) return false;
    }
    return true;
  });
}
