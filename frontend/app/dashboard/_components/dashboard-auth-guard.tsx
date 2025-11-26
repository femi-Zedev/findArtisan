"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Loader, Center, Text, Button } from "@mantine/core";
import { AlertCircle } from "lucide-react";

interface DashboardAuthGuardProps {
  children: React.ReactNode;
  allowedUserTypes?: ("admin" | "contributor")[];
}

/**
 * Dummy Auth Guard Component
 * 
 * Currently checks user state from Zustand store.
 * TODO: Replace with actual authentication check against Strapi backend.
 */
export function DashboardAuthGuard({
  children,
  allowedUserTypes = ["admin", "contributor"]
}: DashboardAuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, canAccessDashboard, getUserType } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulate auth check delay
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (isChecking) {
    return (
      <Center className="min-h-screen">
        <div className="text-center">
          <Loader size="lg" color="teal" />
          <Text mt="md" size="sm" c="dimmed">
            Vérification de l'authentification...
          </Text>
        </div>
      </Center>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <Center className="min-h-screen">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <Text size="xl" fw={600} mb="sm">
            Authentification requise
          </Text>
          <Text size="sm" c="dimmed" mb="lg">
            Vous devez être authentifié pour accéder au tableau de bord. Veuillez vous connecter pour continuer.
          </Text>
          <Button
            onClick={() => router.push("/")}
            color="teal"
            variant="light"
          >
            Retour à l'accueil
          </Button>
        </div>
      </Center>
    );
  }

  // Check if user can access dashboard (admin or contributor)
  if (!canAccessDashboard()) {
    return (
      <Center className="min-h-screen">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <Text size="xl" fw={600} mb="sm">
            Accès refusé
          </Text>
          <Text size="sm" c="dimmed" mb="lg">
            Vous n'avez pas la permission d'accéder au tableau de bord. Seuls les administrateurs et les contributeurs peuvent accéder à cette zone.
          </Text>
          <Button
            onClick={() => router.push("/")}
            color="teal"
            variant="light"
          >
            Retour à l'accueil
          </Button>
        </div>
      </Center>
    );
  }

  // Check if user type is allowed for this specific route
  const userType = getUserType();
  // Type guard: ensure userType is admin or contributor before checking includes
  if (userType === "admin" || userType === "contributor") {
    if (!allowedUserTypes.includes(userType)) {
      return (
        <Center className="min-h-screen">
          <div className="text-center max-w-md p-6">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <Text size="xl" fw={600} mb="sm">
              Permissions insuffisantes
            </Text>
            <Text size="sm" c="dimmed" mb="lg">
              Votre type de compte ({userType === "admin" ? "Administrateur" : "Contributeur"}) n'a pas accès à cette section.
            </Text>
            <Button
              onClick={() => router.push("/dashboard")}
              color="teal"
              variant="light"
            >
              Retour au tableau de bord
            </Button>
          </div>
        </Center>
      );
    }
  }

  // User is authenticated and authorized
  return <>{children}</>;
}

