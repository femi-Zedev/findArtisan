"use client";

import { Title, Text } from "@mantine/core";

export default function AddArtisanPage() {
  return (
    <div>
      <Title order={2} mb="md">
        Ajouter un Artisan
      </Title>
      <Text c="dimmed">
        Cette page contiendra un formulaire pour ajouter un nouvel artisan à la plateforme.
      </Text>
      <Text size="sm" c="dimmed" mt="sm">
        TODO: Implémenter le formulaire de soumission d'artisan avec validation.
      </Text>
    </div>
  );
}

