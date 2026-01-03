"use client";

import { useRouter } from "next/navigation";
import { navRoutes } from "@/app/lib/navigation-routes";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { Loader, Center, Text, Button } from "@mantine/core";
import { AlertCircle } from "lucide-react";

interface DashboardAuthGuardProps {
  children: React.ReactNode;
  allowedUserTypes?: ("admin" | "user")[];
}

/**
 * Auth Guard Component
 * 
 * Checks NextAuth session and user permissions for dashboard access
 */
export function DashboardAuthGuard({
  children,
  allowedUserTypes = ["admin", "user"]
}: DashboardAuthGuardProps) {
  const router = useRouter();
  const { session, status, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (status === "loading") {
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
  if (!isAuthenticated || !session) {
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
            onClick={() => router.push(navRoutes.home)}
            color="teal"
            variant="light"
          >
            Retour à l'accueil
          </Button>
        </div>
      </Center>
    );
  }

  // Check if user can access dashboard (admin or user)
  const userType = session.user.userType;
  if (userType !== "admin" && userType !== "user") {
    return (
      <Center className="min-h-screen">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <Text size="xl" fw={600} mb="sm">
            Accès refusé
          </Text>
          <Text size="sm" c="dimmed" mb="lg">
            Vous n'avez pas la permission d'accéder au tableau de bord.
          </Text>
          <Button
            onClick={() => router.push(navRoutes.home)}
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
    if (!allowedUserTypes.includes(userType)) {
      return (
        <Center className="min-h-screen">
          <div className="text-center max-w-md p-6">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <Text size="xl" fw={600} mb="sm">
              Permissions insuffisantes
            </Text>
            <Text size="sm" c="dimmed" mb="lg">
            Votre type de compte ({userType === "admin" ? "Administrateur" : "Utilisateur"}) n'a pas accès à cette section.
            </Text>
            <Button
              onClick={() => router.push(navRoutes.dashboard.base)}
              color="teal"
              variant="light"
            >
              Retour au tableau de bord
            </Button>
          </div>
        </Center>
      );
  }

  // User is authenticated and authorized
  return <>{children}</>;
}

