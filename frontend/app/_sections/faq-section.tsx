"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Comment puis-je trouver un artisan ?",
    answer:
      "Utilisez la barre de recherche en haut de la page. Vous pouvez rechercher par profession (plombier, électricien, etc.) et par zone (Akpakpa, Fidjrossè, Calavi, etc.). Les résultats s'afficheront avec les informations de contact de chaque artisan.",
  },
  {
    question: "Les artisans sont-ils vérifiés ?",
    answer:
      "FindArtisan est une plateforme communautaire. Les profils peuvent être soumis par la communauté et sont visibles après validation. Nous recommandons toujours de vérifier les références et de demander des devis avant de faire appel à un artisan.",
  },
  {
    question: "Puis-je ajouter un artisan à la plateforme ?",
    answer:
      "Oui ! Si vous connaissez un artisan fiable, vous pouvez l'ajouter en cliquant sur le bouton 'Ajouter un artisan' en haut de la page. Vous devrez vous connecter avec votre compte Google pour soumettre un nouveau profil.",
  },
  {
    question: "Le service est-il gratuit ?",
    answer:
      "Oui, FindArtisan est entièrement gratuit pour les utilisateurs. Vous pouvez rechercher et contacter des artisans sans frais. La plateforme est financée par la communauté et vise à faciliter l'accès aux services professionnels au Bénin.",
  },
  {
    question: "Comment contacter un artisan ?",
    answer:
      "Chaque profil d'artisan affiche son numéro de téléphone. Si l'artisan a WhatsApp, vous verrez un bouton pour le contacter directement via WhatsApp. Vous pouvez également l'appeler directement.",
  },
  {
    question: "Dans quelles villes le service est-il disponible ?",
    answer:
      "FindArtisan ambitionne couvrir toute les zones du Bénin. Vous pouvez nous aider en ajoutant les artisans de votre zone en cliquant sur le bouton 'Ajouter un artisan' en haut de la page.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-12 px-6 lg:px-8 ">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Trouvez des réponses aux questions les plus courantes
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "rounded-xl border transition-all duration-300 ease-in-out",
                  "bg-white dark:bg-gray-800",
                  "border-gray-200 dark:border-gray-700",
                  isOpen && "border-teal-500 dark:border-teal-500 shadow-md"
                )}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 dark:text-white flex-1">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "shrink-0 transition-transform duration-300 ease-in-out",
                      isOpen && "rotate-180"
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        isOpen
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-gray-400 dark:text-gray-500"
                      )}
                    />
                  </div>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-6 pb-4">
                    <p
                      className={cn(
                        "text-gray-600 dark:text-gray-300 leading-relaxed transition-opacity duration-300",
                        isOpen ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

