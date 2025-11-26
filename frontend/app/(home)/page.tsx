import { Navbar } from "../_components/navbar";
import { HeroSection } from "../_sections/hero-section";
import { RecentlyAddedSection } from "../_sections/recently-added-section";
import { FAQSection } from "../_sections/faq-section";
import { ContactSection } from "../_sections/contact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div id="artisans" className="relative z-10">
        <RecentlyAddedSection />
      </div>
      <FAQSection />
      <ContactSection />
    </>
  );
}