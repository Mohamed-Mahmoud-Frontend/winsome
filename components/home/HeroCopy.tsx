import Link from "next/link";

const FEATURES = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    ),
    label: "Interactive map with live results",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    label: "Fast search with instant updates",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
    label: "Rich details and clear pricing",
  },
] as const;

export function HeroCopy() {
  return (
    <section className="max-w-xl space-y-8 lg:space-y-10">
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-800 dark:text-amber-400">
          Hotel search, reimagined
        </p>
        <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-[3.25rem]">
          Find your perfect stay{" "}
          <span className="text-amber-800 dark:text-amber-400">on the map.</span>
        </h1>
      </div>
      <p className="max-w-md text-base leading-relaxed text-zinc-800 dark:text-zinc-300">
        Search by location, compare hotels with an interactive map, and see
        availability and details in one place. No clutter—just the right
        hotel, fast.
      </p>

      <ul className="flex flex-col gap-4 text-sm text-zinc-800 dark:text-zinc-300">
        {FEATURES.map(({ icon, label }) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <svg
                className="h-4 w-4 text-amber-800 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {icon}
              </svg>
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <div className="pt-2">
        <Link
          href="/hotels"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-amber-900/20 transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:bg-amber-500 dark:text-zinc-900 dark:hover:bg-amber-400 dark:focus:ring-offset-zinc-950"
        >
          Search hotels
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
