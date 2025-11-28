"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import ModalProvider from "@/providers/modal-provider";
import { DrawerProvider } from "@/providers/drawer-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1, // Reduce default retries to 1 (instead of 3)
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <DrawerProvider>
          <ModalProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ModalProvider>
        </DrawerProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}


