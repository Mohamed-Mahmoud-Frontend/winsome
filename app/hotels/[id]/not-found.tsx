import Link from "next/link";

export default function HotelNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Hotel not found
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          This hotel does not exist or the link is invalid.
        </p>
        <Link
          href="/hotels"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Back to search
        </Link>
      </div>
    </div>
  );
}
