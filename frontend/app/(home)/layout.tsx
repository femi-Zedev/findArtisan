import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/app/_components/navbar";
import { ConditionalFooter } from "@/app/_components/conditional-footer";

export const metadata: Metadata = {
  title: "FindArtisan - Discover Local Artisans",
  description: "Find local artisans in Benin Republic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <main className="relative min-h-screen bg-linear-to-b from-blue-50 to-gray-50 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <Suspense fallback={null}>
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <ConditionalFooter />
      </Suspense>
    </main>

  );
}
