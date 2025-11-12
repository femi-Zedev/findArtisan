import { Navbar } from "./_components/navbar";
import { HeroSection } from "./_sections/hero-section";
import { RecentlyAddedSection } from "./_sections/recently-added-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div id="artisans" className="relative z-10">
        <RecentlyAddedSection />
      </div>
    </>
  );
}