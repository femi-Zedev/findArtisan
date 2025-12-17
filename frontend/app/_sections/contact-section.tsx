"use client";

import { Mail, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@mantine/core";

export function ContactSection() {
  return (
    <section id="contact" className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Contactez-nous
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Une question ? Une suggestion ? Nous sommes là pour vous aider
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Email */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center transition-all hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                <Mail className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Email
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Envoyez-nous un message
            </p>
            <a
              href="mailto:contact@findartisan.bj"
              className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              contact@findartisan.bj
            </a>
          </div>

          {/* WhatsApp */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center transition-all hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                <MessageCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              WhatsApp
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Discutez avec nous
            </p>
            <a
              href="https://wa.me/229XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              +229 XX XX XX XX
            </a>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center transition-all hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                <MapPin className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Localisation
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Basé au Bénin
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cotonou, Bénin
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {/* <div className="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vous avez un problème à signaler ou une suggestion d'amélioration ?{" "}
            <a
              href="mailto:support@findartisan.bj"
              className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              Contactez notre équipe de support
            </a>
          </p>
        </div> */}
      </div>
    </section>
  );
}

