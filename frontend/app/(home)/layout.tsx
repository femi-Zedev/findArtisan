import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/mantine-style.css";
import "@/app/globals.css";
import { Navbar } from "@/app/_components/navbar";
import { Footer } from "../_components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FindArtisan - Discover Local Artisans",
  description: "Find local artisans in Benin Republic",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <main className="relative min-h-screen flex flex-col"
    >
      <Suspense fallback={null}>
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </Suspense>
    </main>

  );
}
