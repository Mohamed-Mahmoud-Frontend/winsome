import type { ReactNode } from "react";

const PATTERN_SVG =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

type HomePageBackgroundProps = {
  children: ReactNode;
};

export function HomePageBackground({ children }: HomePageBackgroundProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#faf9f7] font-sans text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{ backgroundImage: PATTERN_SVG }}
      />
      {children}
    </div>
  );
}
