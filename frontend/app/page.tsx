import { Navbar } from "./_components/navbar";
import { HeroSection } from "./_components/hero-section";
import { ArtisansSection } from "./_components/artisans-section";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-linear-to-b from-blue-50 to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <HeroSection />
      <div id="artisans" className="relative z-10">
        <ArtisansSection />
      </div>
    </main>
  );
}