/**
 * Hotels feature – public API.
 */

export { fetchHotelsPage, createAbortController } from "./api/hotelsApi";
export type { FetchHotelsPageParams, HotelsPageResponse } from "./api/hotelsApi";
export { useSearchStore } from "./store/searchStore";
export { useHotelsInfinite } from "./hooks/useHotelsInfinite";
export type { UseHotelsInfiniteParams } from "./hooks/useHotelsInfinite";
