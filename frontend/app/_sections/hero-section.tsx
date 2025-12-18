"use client";

import { AnimatedProfession } from "../_components/animated-profession";
import { HeroSearchInput } from "../_components/hero-search-input";

export function HeroSection() {

  return (
    <section className="w-full px-4 py-6 sm:py-10 sm:px-6 lg:px-8 mt-14">
      <div className="mx-auto max-w-6xl text-center">
        {/* Main Headline */}
        <h1 className="my-10 text-4xl font-extrabold leading-none tracking-tighter text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Trouve le bon <br className="block sm:hidden" /> <AnimatedProfession /> <br /> près de{" "}
          chez toi
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-lg text-gray-600 dark:text-gray-300 sm:text-xl max-w-2xl mx-auto">
          Accélère ta recherche avec notre collection d'artisans locaux au Bénin.
          Des plombiers aux électriciens, des menuisiers aux peintres. Trouve et
          contacte le professionnel qu'il te faut en quelques clics.
        </p>

        {/* Search Input with Filter */}
        <HeroSearchInput />


      </div>
    </section>
  );
}
