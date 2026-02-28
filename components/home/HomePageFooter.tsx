const BADGES = ["Next.js", "Google Hotels API"] as const;

export function HomePageFooter() {
  return (
    <footer className="relative z-10 border-t border-zinc-200/80 bg-white/60 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400">
        <span>© Hotel Search. Demo experience.</span>
        <div className="flex flex-wrap items-center gap-3">
          {BADGES.map((label) => (
            <span
              key={label}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
