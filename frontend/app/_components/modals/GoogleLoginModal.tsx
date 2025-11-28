"use client";

import { signIn } from "next-auth/react";
import { useModalContext } from "@/providers/modal-provider";

export function GoogleLoginModal() {
  const { closeModal } = useModalContext();

  const handleGoogleLogin = async () => {
    try {
      // Close modal first
      closeModal();

      // Sign in with Google using NextAuth
      // Use redirect: true and set callbackUrl with query parameter to open drawer
      const callbackUrl = `${window.location.origin}${window.location.pathname}?openDrawer=addArtisan`;

      await signIn("google", {
        redirect: true,
        callbackUrl: callbackUrl,
      });
    } catch (error) {
      console.error("Login error:", error);
      // TODO: Show error toast notification
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
        <svg
          className="h-8 w-8 text-teal-600 dark:text-teal-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>

      {/* Description */}
      <div className="mb-8 space-y-3">
        <p className="text-base text-gray-600 dark:text-gray-300 text-balance font-medium">
          Pour ajouter un artisan, nous avons besoin de vous identifier.
          <br />
          Cela nous permet de garder une trace de qui ajoute quoi et de maintenir la qualité des informations sur la plateforme.
        </p>
      </div>

      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full cursor-pointer flex items-center gap-3 p-[3px] bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-xl transition-colors duration-200"
      >
        {/* White rounded container with Google logo */}
        <div className="flex items-center justify-center w-11 h-10 bg-white dark:bg-gray-100 rounded-l-xl rounded-r-sm shrink-0">
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </div>
        <span className="w-full text-center text-base font-bold">Se connecter avec Google</span>
      </button>

      {/* Privacy Note */}
      <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        En continuant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
      </p>
    </div>
  );
}

