/**
 * Client providers: React Query (QueryClientProvider). Wraps app for data fetching; no UI layout.
 */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "9999px",
            background: "#09090b",
            color: "#f9fafb",
            paddingInline: "1rem",
            paddingBlock: "0.75rem",
            boxShadow:
              "0 20px 25px -5px rgb(0 0 0 / 0.25), 0 8px 10px -6px rgb(0 0 0 / 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#0a0a0b",
            },
          },
          error: {
            iconTheme: {
              primary: "#f97373",
              secondary: "#0a0a0b",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
