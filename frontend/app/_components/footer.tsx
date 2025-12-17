"use client";

import Link from "next/link";
import { Wrench, Heart } from "lucide-react";
import { cn } from "../lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-gray-200/50 dark:border-gray-800/50 bg-white/60 backdrop-blur-md dark:bg-gray-900/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                FindArtisan
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Trouvez facilement des artisans locaux fiables au Bénin.
              Votre plateforme de confiance pour tous vos besoins en services professionnels.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Liens rapides
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Rechercher un artisan
                </Link>
              </li>

              <button
                onClick={() => {
                  // This will be handled by the drawer context in the navbar
                  // For now, we'll just scroll to top or show a message
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
              >
                Ajouter un artisan
              </button>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              À propos
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Plateforme communautaire
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Gratuit et accessible
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Pour le Bénin
                </span>
              </li>
            </ul>
          </div>

          {/* Contact/Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Questions fréquentes
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              © {currentYear} FindArtisan. Tous droits réservés.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              Fait avec <Heart className="h-4 w-4 text-red-500 fill-red-500" /> pour la communauté
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

