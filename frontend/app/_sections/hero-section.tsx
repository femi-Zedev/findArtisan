"use client";

import { AnimatedProfession } from "../_components/animated-profession";
import { HeroSearchInput } from "../_components/hero-search-input";

export function HeroSection() {
  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8 mt-14">
      <div className="mx-auto max-w-6xl text-center">
        {/* Main Headline */}
        <h1 className="mb-6 text-4xl font-extrabold leading-none tracking-tighter text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Trouvez le bon <AnimatedProfession /> <br /> près de{" "}
          chez vous
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-lg text-gray-600 dark:text-gray-300 sm:text-xl max-w-2xl mx-auto">
          Accélérez votre recherche avec notre collection d'artisans locaux au Bénin.
          Des plombiers aux électriciens, des menuisiers aux peintres. Trouvez et
          contactez le professionnel qu'il vous faut en quelques clics.
        </p>

        {/* Search Input with Filter */}
        <HeroSearchInput />
      </div>
    </section>
  );
}
