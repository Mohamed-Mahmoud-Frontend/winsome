"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { slugify } from "@/utils/slug";
import type { HotelResult } from "@/types/hotel";

export function HotelCard({
  hotel,
  className,
  priority,
}: {
  hotel: HotelResult;
  className?: string;
  /** Set for the first card to improve LCP */
  priority?: boolean;
}) {
  const description =
    hotel.description ??
    (hotel.extensions?.length ? hotel.extensions.slice(0, 2).join(" · ") : hotel.address ?? "");

  // استخدم الـ place_id القادم من SearchApi عندما يكون متاحًا
  // (token ثابت ومباشر لطلب تفاصيل الفندق)، ولو مش موجود نرجع لِـ slug.
  const slugOrId = hotel.place_id ?? slugify(hotel.title);
  const detailHref = `/hotels/${encodeURIComponent(slugOrId)}`;
  const isInternal = true;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900",
        className
      )}
    >
      <Link
        href={detailHref}
        {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        className="block"
      >
        <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {hotel.thumbnail ? (
            <Image
              src={hotel.thumbnail}
              alt={hotel.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              No image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
            {hotel.title}
          </h3>
          {hotel.rating != null && (
            <div className="mt-1 flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium text-amber-600 dark:text-amber-500">
                ★ {hotel.rating.toFixed(1)}
              </span>
              {hotel.reviews != null && (
                <span>({hotel.reviews.toLocaleString()} reviews)</span>
              )}
            </div>
          )}
          {description && (
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
          {hotel.price && (
            <p className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              ${hotel.price.amount}
              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                {" "}
                / {hotel.price.period ?? "night"}
              </span>
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
