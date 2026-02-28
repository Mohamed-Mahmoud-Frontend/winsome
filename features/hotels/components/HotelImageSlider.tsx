"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

const SLIDE_DURATION_MS = 5000;

export function HotelImageSlider({
  images,
  alt,
  className,
  fillHeightOnLarge,
}: {
  images: string[];
  alt: string;
  className?: string;
  fillHeightOnLarge?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => go(1), SLIDE_DURATION_MS);
    return () => clearInterval(t);
  }, [count, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!images.length) return null;

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800", className)}>
      <div
        className={cn(
          "relative w-full min-h-[200px] sm:min-h-[280px] aspect-video",
          fillHeightOnLarge && "lg:aspect-auto lg:min-h-0 lg:flex-1"
        )}
      >
        {images.map((src, i) => (
          <div
            key={src + i}
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            aria-hidden={i !== index}
          >
            <Image
              src={src}
              alt={`${alt} – image ${i + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/80"
            aria-label="Previous image"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/80"
            aria-label="Next image"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                )}
                aria-label={`Image ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
