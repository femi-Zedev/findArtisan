"use client";

import { useUserStore } from "@/stores/userStore";
import { Button, Card, Title, Text, Group, Badge, Stack } from "@mantine/core";
import { User, Shield, UserCheck, LogOut } from "lucide-react";

export default function TestAuthPage() {
  const { user, isAuthenticated, setUser, clearUser, getUserType } = useUserStore();
  const userType = getUserType();

  const setAdminUser = () => {
    setUser({
      id: "admin_1",
      name: "Admin Test",
      email: "admin@test.com",
      userType: "admin",
    });
  };

  const setContributorUser = () => {
    setUser({
      id: "contributor_1",
      name: "Contributeur Test",
      email: "contributor@test.com",
      userType: "contributor",
    });
  };

  const setRegularUser = () => {
    setUser({
      id: "user_1",
      name: "Utilisateur Test",
      email: "user@test.com",
      userType: "user",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Title order={1} mb="xs">
            Page de Test d'Authentification
          </Title>
          <Text c="dimmed" size="sm">
            Utilisez cette page pour tester différents types d'utilisateurs dans le store.
            Cette page est uniquement à des fins de développement.
          </Text>
        </div>

        {/* Current User Status */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            État actuel
          </Title>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Authentifié :
              </Text>
              <Badge color={isAuthenticated ? "green" : "red"}>
                {isAuthenticated ? "Oui" : "Non"}
              </Badge>
            </Group>
            {user && (
              <>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    Nom :
                  </Text>
                  <Text size="sm">{user.name}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    Email :
                  </Text>
                  <Text size="sm">{user.email}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    Type d'utilisateur :
                  </Text>
                  <Badge
                    color={
                      userType === "admin"
                        ? "red"
                        : userType === "contributor"
                          ? "blue"
                          : "gray"
                    }
                  >
                    {userType === "admin"
                      ? "Administrateur"
                      : userType === "contributor"
                        ? "Contributeur"
                        : "Utilisateur"}
                  </Badge>
                </Group>
              </>
            )}
          </Stack>
        </Card>

        {/* Action Buttons */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Définir un utilisateur
          </Title>
          <Stack gap="md">
            <Button
              leftSection={<Shield className="h-4 w-4" />}
              onClick={setAdminUser}
              color="red"
              variant="light"
              fullWidth
              size="md"
            >
              Définir comme Administrateur
            </Button>
            <Text size="xs" c="dimmed">
              Accès complet au tableau de bord, gestion des artisans et soumissions
            </Text>

            <Button
              leftSection={<UserCheck className="h-4 w-4" />}
              onClick={setContributorUser}
              color="blue"
              variant="light"
              fullWidth
              size="md"
            >
              Définir comme Contributeur
            </Button>
            <Text size="xs" c="dimmed">
              Accès au tableau de bord pour gérer ses contributions et ajouter des artisans
            </Text>

            <Button
              leftSection={<User className="h-4 w-4" />}
              onClick={setRegularUser}
              color="gray"
              variant="light"
              fullWidth
              size="md"
            >
              Définir comme Utilisateur Régulier
            </Button>
            <Text size="xs" c="dimmed">
              Pas d'accès au tableau de bord
            </Text>

            {isAuthenticated && (
              <>
                <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
                <Button
                  leftSection={<LogOut className="h-4 w-4" />}
                  onClick={clearUser}
                  color="red"
                  variant="outline"
                  fullWidth
                  size="md"
                >
                  Déconnecter
                </Button>
              </>
            )}
          </Stack>
        </Card>

        {/* Navigation Help */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Navigation
          </Title>
          <Stack gap="xs">
            <Text size="sm">
              • Une fois un administrateur ou contributeur défini, vous pouvez accéder au{" "}
              <a
                href="/dashboard"
                className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
              >
                tableau de bord
              </a>
            </Text>
            <Text size="sm">
              • Les utilisateurs réguliers ne peuvent pas accéder au tableau de bord
            </Text>
            <Text size="sm">
              • Cette page devrait être supprimée ou protégée en production
            </Text>
          </Stack>
        </Card>
      </div>
    </div>
  );
}

