/**
 * ISR hotel detail page: hero slider, overview, pricing, description, location, amenities, recommended.
 * [id] can be property_token (place_id) or slug from title. revalidate = 60.
 */
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { HotelImageSlider } from "@/features/hotels/components/HotelImageSlider";
import { HotelCard } from "@/features/hotels/components/HotelCard";
import type { HotelResult } from "@/types/hotel";
import type { Metadata } from "next";

const REVALIDATE_SECONDS = 60;
export const revalidate = 60;

async function getBaseUrl(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("host") ?? h.get("x-forwarded-host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    if (host) return `${proto === "https" ? "https" : "http"}://${host}`;
  } catch {
    // fallback when headers not available (e.g. static export)
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function getHotelDetail(id: string): Promise<{ hotel: HotelResult; recommended: HotelResult[] } | null> {
  const base = await getBaseUrl();
  const url = `${base}/api/hotels/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.hotel) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getHotelDetail(id);
  if (!data) return { title: "Hotel not found" };
  const { hotel } = data;
  const title = `${hotel.title} | Hotel details`;
  const description =
    hotel.description ?? `${hotel.title} – ${hotel.rating ?? "—"} rating, from ${hotel.price?.amount ?? "—"} ${hotel.price?.currency ?? ""} per night`;
  return { title, description, openGraph: { title, description } };
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getHotelDetail(id);
  if (!data) notFound();

  const { hotel, recommended } = data;
  const images = hotel.images?.length ? hotel.images : hotel.thumbnail ? [hotel.thumbnail] : [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 lg:mb-6" aria-label="Breadcrumb">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to search
          </Link>
        </nav>

        {/* Large screens: 50% gallery | 50% details */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
          {/* Left: gallery – full height on large screens */}
          <div className="lg:sticky lg:top-8 mb-8 lg:mb-0">
            {hasImages ? (
              <HotelImageSlider
                images={images}
                alt={hotel.title}
                className="overflow-hidden rounded-2xl shadow-xl lg:min-h-[65vh] lg:flex lg:flex-col"
                fillHeightOnLarge
              />
            ) : (
              <div className="flex aspect-16/10 items-center justify-center rounded-2xl bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                No image
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="space-y-8 lg:py-2">
            <header className="border-b border-zinc-200 pb-6 dark:border-zinc-700">
              <div className="flex flex-wrap items-center gap-3">
                {hotel.type && (
                  <span className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200">
                    {hotel.type}
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                {hotel.title}
              </h1>
            </header>

            {/* Price + CTA card */}
            <Section title="Rates & availability">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
                {hotel.price ? (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {hotel.price.amount}{" "}
                      <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">
                        {hotel.price.currency} / {hotel.price.period === "night" ? "night" : hotel.price.period ?? "night"}
                      </span>
                    </p>
                    {hotel.link && (
                      <a
                        href={hotel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      >
                        Book on site
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-zinc-500 dark:text-zinc-400">Contact property for rates and availability.</p>
                )}
              </div>
            </Section>

            {hotel.description && (
              <Section title="About">
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{hotel.description}</p>
              </Section>
            )}

            {hotel.address && (
              <Section title="Location">
                <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                  <span className="shrink-0 rounded-full bg-zinc-100 p-2 dark:bg-zinc-800">
                    <svg className="h-5 w-5 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300">{hotel.address}</p>
                </div>
              </Section>
            )}

            {hotel.extensions && hotel.extensions.length > 0 && (
              <Section title="Amenities">
                <ul className="flex flex-wrap gap-2">
                  {hotel.extensions.map((ext) => (
                    <li
                      key={ext}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      {ext}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </div>

        {/* Ratings: below gallery & details, above recommended cards */}
        {(hotel.rating != null || hotel.reviews != null || hotel.rating_breakdown || (hotel.review_list?.length ?? 0) > 0) && (
          <section className="mt-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Ratings
            </h2>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 space-y-6">
              {/* Overall rating row: stars + score + of 5 + reviews count */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {hotel.rating != null && (
                  <div className="flex items-center gap-2">
                    <div className="flex text-orange-500" aria-hidden>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="h-6 w-6 shrink-0"
                          fill={star <= Math.floor(hotel.rating!) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {hotel.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">of 5</span>
                  </div>
                )}
                {hotel.reviews != null && (
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {hotel.reviews.toLocaleString()} reviews
                  </p>
                )}
              </div>

              {hotel.rating_breakdown && (() => {
                const rb = hotel.rating_breakdown;
                const max = Math.max((rb[5] ?? 0), rb[4] ?? 0, rb[3] ?? 0, rb[2] ?? 0, rb[1] ?? 0, 1);
                return (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Rating breakdown</p>
                    {([5, 4, 3, 2, 1] as const).map((stars) => {
                      const n = rb[stars] ?? 0;
                      const widthPct = max ? (n / max) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3 text-sm">
                          <span className="w-14 shrink-0 font-medium text-zinc-700 dark:text-zinc-300">
                            {stars} star
                          </span>
                          <div className="flex-1 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden min-w-0">
                            <div
                              className="h-full rounded-full bg-orange-500 min-w-[2px] transition-[width]"
                              style={{ width: `${widthPct}%` }}
                              role="presentation"
                            />
                          </div>
                          <span className="w-12 shrink-0 text-right font-medium text-zinc-800 dark:text-zinc-200 tabular-nums">
                            {n.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {hotel.review_list && hotel.review_list.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Guest reviews</p>
                  <ul className="space-y-4" aria-label="Reviews">
                    {hotel.review_list.map((rev, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {rev.rating != null && (
                              <span className="flex text-orange-500 shrink-0" aria-hidden>
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <svg key={s} className="h-4 w-4" fill={s <= rev.rating! ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </span>
                            )}
                            {rev.author && (
                              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{rev.author}</span>
                            )}
                          </div>
                          {rev.date && (
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">{rev.date}</span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed" dir="auto">
                          {rev.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-700">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              You might also like
            </h2>
            <p className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Nearby or similar hotels
            </p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {recommended.map((h) => (
                <HotelCard key={h.place_id ?? h.link} hotel={h} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
