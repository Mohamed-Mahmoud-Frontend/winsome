/**
 * Hotels feature – public API.
 */

export { fetchHotels, fetchHotelsPage, createAbortController } from "./api/hotelsApi";
export type { FetchHotelsParams, FetchHotelsPageParams, HotelsPageResponse } from "./api/hotelsApi";
export { useSearchStore } from "./store/searchStore";
export { useHotelsInfinite } from "./hooks/useHotelsInfinite";
export type { UseHotelsInfiniteParams } from "./hooks/useHotelsInfinite";
