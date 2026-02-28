"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchStore } from "../store/searchStore";
import type { RatingFilter, AmenityFilter } from "../store/searchStore";
import { cn } from "@/utils/cn";

const RATING_OPTIONS: { label: string; value: RatingFilter }[] = [
  { label: "Any rating", value: "any" },
  { label: "4+ rating", value: "4+" },
  { label: "4 or 5 star", value: "4or5" },
];

const PROPERTY_TYPES = [
  { label: "Any type", value: null },
  { label: "Hotel", value: "Hotel" },
  { label: "Resort", value: "Resort" },
  { label: "Motel", value: "Motel" },
  { label: "Apartment", value: "Apartment" },
  { label: "Guest house", value: "Guest house" },
];

const AMENITY_OPTIONS: { label: string; value: AmenityFilter }[] = [
  { label: "Any", value: "any" },
  { label: "With pool", value: "yes" },
];

const SPA_OPTIONS: { label: string; value: AmenityFilter }[] = [
  { label: "Any", value: "any" },
  { label: "With spa", value: "yes" },
];

function IconFilter({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function IconMoney({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconPool({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8m0 0v-4m0 4H4m4 0h4m4 0v-4m0 4h4m-4 0v-4m0-4h4M4 7h4m12 0v4m0 0v4m0-4h-4m4 0H8m-4 0v-4" />
    </svg>
  );
}

function IconSpa({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function IconProperty({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg className={cn("h-3.5 w-3.5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}

const dropdownPanelClass =
  "absolute left-0 bottom-full z-20 mb-1 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900";
const triggerClass =
  "inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/80 shrink-0";

function formatPriceRange(priceMin: number | null, priceMax: number | null): string {
  if (priceMin == null && priceMax == null) return "Price";
  if (priceMin != null && priceMax != null) return `$${priceMin} – $${priceMax}`;
  if (priceMin != null) return `From $${priceMin}`;
  return `Up to $${priceMax}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function HotelFiltersBar() {
  const filters = useSearchStore((s) => s.filters);
  const checkIn = useSearchStore((s) => s.checkIn);
  const checkOut = useSearchStore((s) => s.checkOut);
  const setFilters = useSearchStore((s) => s.setFilters);
  const setDates = useSearchStore((s) => s.setDates);
  const resetFilters = useSearchStore((s) => s.resetFilters);

  const [open, setOpen] = useState<"all" | "rating" | "price" | "pool" | "spa" | "property" | "checkout" | null>(null);
  const [priceMinInput, setPriceMinInput] = useState("");
  const [priceMaxInput, setPriceMaxInput] = useState("");
  const allRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const spaRef = useRef<HTMLDivElement>(null);
  const propertyRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  const closeAll = () => setOpen(null);

  useClickOutside(allRef, () => open === "all" && closeAll());
  useClickOutside(ratingRef, () => open === "rating" && closeAll());
  useClickOutside(priceRef, () => open === "price" && closeAll());
  useClickOutside(poolRef, () => open === "pool" && closeAll());
  useClickOutside(spaRef, () => open === "spa" && closeAll());
  useClickOutside(propertyRef, () => open === "property" && closeAll());
  useClickOutside(checkoutRef, () => open === "checkout" && closeAll());

  const hasActiveFilters =
    filters.rating !== "any" ||
    filters.priceMin != null ||
    filters.priceMax != null ||
    filters.pool === "yes" ||
    filters.spa === "yes" ||
    filters.propertyType != null;

  const ratingLabel = RATING_OPTIONS.find((o) => o.value === filters.rating)?.label ?? "Rating";
  const propertyLabel = PROPERTY_TYPES.find((o) => o.value === filters.propertyType)?.label ?? "Property type";
  const poolLabel = filters.pool === "yes" ? "With pool" : "Pool";
  const spaLabel = filters.spa === "yes" ? "With spa" : "Spa";

  const applyPriceRange = () => {
    const min = priceMinInput === "" ? null : parseInt(priceMinInput, 10);
    const max = priceMaxInput === "" ? null : parseInt(priceMaxInput, 10);
    setFilters({
      priceMin: min != null && !Number.isNaN(min) ? min : null,
      priceMax: max != null && !Number.isNaN(max) ? max : null,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
      {/* All filters */}
      <div className="relative shrink-0" ref={allRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => (o === "all" ? null : "all"))}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition shrink-0",
            hasActiveFilters
              ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              : "border-zinc-200 bg-white text-blue-600 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
          )}
          aria-expanded={open === "all"}
        >
          <IconFilter />
          All filters
        </button>
        {open === "all" && (
          <div
            className="absolute left-0 bottom-full z-20 mb-2 w-72 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            role="dialog"
            aria-label="All filters"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-700">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Filters</span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      resetFilters();
                      closeAll();
                    }}
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Rating</p>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ rating: e.target.value as RatingFilter })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {RATING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Price range (per night)</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min $"
                    value={filters.priceMin ?? ""}
                    onChange={(e) => setFilters({ priceMin: e.target.value === "" ? null : parseInt(e.target.value, 10) || null })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Max $"
                    value={filters.priceMax ?? ""}
                    onChange={(e) => setFilters({ priceMax: e.target.value === "" ? null : parseInt(e.target.value, 10) || null })}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Pool</p>
                <select
                  value={filters.pool}
                  onChange={(e) => setFilters({ pool: e.target.value as AmenityFilter })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {AMENITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Spa</p>
                <select
                  value={filters.spa}
                  onChange={(e) => setFilters({ spa: e.target.value as AmenityFilter })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {SPA_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Property type</p>
                <select
                  value={filters.propertyType ?? ""}
                  onChange={(e) => setFilters({ propertyType: e.target.value || null })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {PROPERTY_TYPES.map((o) => (
                    <option key={o.label} value={o.value ?? ""}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating dropdown */}
      <div className="relative shrink-0" ref={ratingRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => (o === "rating" ? null : "rating"))}
          className={triggerClass}
          aria-expanded={open === "rating"}
        >
          <IconStar className="text-amber-700 dark:text-amber-400" />
          {ratingLabel}
          <IconChevronDown className="ml-0.5" />
        </button>
        {open === "rating" && (
          <ul className={cn(dropdownPanelClass, "min-w-[160px]")} role="listbox">
            {RATING_OPTIONS.map((o) => (
              <li key={o.value} role="option">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ rating: o.value });
                    closeAll();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2 text-left text-sm",
                    filters.rating === o.value
                      ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  )}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price range dropdown */}
      <div className="relative shrink-0" ref={priceRef}>
        <button
          type="button"
          onClick={() => {
            if (open !== "price") {
              setPriceMinInput(filters.priceMin != null ? String(filters.priceMin) : "");
              setPriceMaxInput(filters.priceMax != null ? String(filters.priceMax) : "");
            }
            setOpen((o) => (o === "price" ? null : "price"));
          }}
          className={triggerClass}
          aria-expanded={open === "price"}
        >
          <IconMoney />
          {formatPriceRange(filters.priceMin, filters.priceMax)}
          <IconChevronDown className="ml-0.5" />
        </button>
        {open === "price" && (
          <div className={cn(dropdownPanelClass, "w-64 p-3")}>
            <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Price per night ($)</p>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={priceMinInput}
                onChange={(e) => setPriceMinInput(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <span className="flex items-center text-zinc-400">–</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={priceMaxInput}
                onChange={(e) => setPriceMaxInput(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                applyPriceRange();
                closeAll();
              }}
              className="mt-2 w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Pool dropdown */}
      <div className="relative shrink-0" ref={poolRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => (o === "pool" ? null : "pool"))}
          className={triggerClass}
          aria-expanded={open === "pool"}
        >
          <IconPool />
          {poolLabel}
          <IconChevronDown className="ml-0.5" />
        </button>
        {open === "pool" && (
          <ul className={cn(dropdownPanelClass, "min-w-[140px]")} role="listbox">
            {AMENITY_OPTIONS.map((o) => (
              <li key={o.value} role="option">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ pool: o.value });
                    closeAll();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2 text-left text-sm",
                    filters.pool === o.value
                      ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  )}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Spa dropdown */}
      <div className="relative shrink-0" ref={spaRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => (o === "spa" ? null : "spa"))}
          className={triggerClass}
          aria-expanded={open === "spa"}
        >
          <IconSpa />
          {spaLabel}
          <IconChevronDown className="ml-0.5" />
        </button>
        {open === "spa" && (
          <ul className={cn(dropdownPanelClass, "min-w-[140px]")} role="listbox">
            {SPA_OPTIONS.map((o) => (
              <li key={o.value} role="option">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ spa: o.value });
                    closeAll();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2 text-left text-sm",
                    filters.spa === o.value
                      ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  )}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Property type dropdown */}
      <div className="relative shrink-0" ref={propertyRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => (o === "property" ? null : "property"))}
          className={triggerClass}
          aria-expanded={open === "property"}
        >
          <IconProperty />
          {propertyLabel}
          <IconChevronDown className="ml-0.5" />
        </button>
        {open === "property" && (
          <ul className={cn(dropdownPanelClass, "min-w-[180px]")} role="listbox">
            {PROPERTY_TYPES.map((o) => (
              <li key={o.label} role="option">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ propertyType: o.value });
                    closeAll();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2 text-left text-sm",
                    filters.propertyType === o.value
                      ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  )}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Check-out dropdown */}
      <div className="relative shrink-0" ref={checkoutRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => (o === "checkout" ? null : "checkout"))}
          className={triggerClass}
          aria-expanded={open === "checkout"}
        >
          <IconCalendar />
          Check-out: {formatDate(checkOut)}
          <IconChevronDown className="ml-0.5" />
        </button>
        {open === "checkout" && (
          <div className={cn(dropdownPanelClass, "p-3")}>
            <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Check-out date</p>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => {
                setDates(checkIn, e.target.value);
                closeAll();
              }}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        )}
      </div>
    </div>
  );
}
