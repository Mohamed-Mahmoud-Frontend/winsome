"use client";

import { cn } from "@/utils/cn";

export interface EmptyStateProps {
  /** Optional icon (e.g. SVG or emoji) */
  icon?: React.ReactNode;
  title?: string;
  description: string;
  /** Optional primary action (e.g. "Reset search") */
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/50 sm:p-12",
        className
      )}
    >
      {icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-zinc-400 dark:text-zinc-500">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          {title}
        </h3>
      )}
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

