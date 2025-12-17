"use client";

import { Title, Text } from "@mantine/core";
import { useUserStore } from "@/stores/userStore";

export default function ProfilePage() {
  const { user } = useUserStore();

  return (
    <div>
      <Title order={2} mb="md">
        Paramètres du Profil
      </Title>
      <Text c="dimmed">
        Gérez les informations de votre profil et les paramètres du compte.
      </Text>
      <Text size="sm" c="dimmed" mt="sm">
        TODO: Implémenter le formulaire d'édition de profil avec téléchargement d'avatar, nom, email et changement de mot de passe.
      </Text>
      {user && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Text size="sm" fw={500}>Utilisateur actuel :</Text>
          <Text size="sm">{user.name} ({user.email})</Text>
        </div>
      )}
    </div>
  );
}

