"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DrawerProvider>
        <ModalProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ModalProvider>
      </DrawerProvider>
    </QueryClientProvider>
  );
}


