"use client";

import { Title, Text } from "@mantine/core";

export default function ArtisansPage() {
  return (
    <div>
      <Title order={2} mb="md">
        Gestion des Artisans
      </Title>
      <Text c="dimmed">
        Cette page affichera tous les artisans avec les capacités de gestion (Administrateur uniquement).
      </Text>
      <Text size="sm" c="dimmed" mt="sm">
        TODO: Implémenter la liste des artisans, le filtrage, l'édition et la suppression.
      </Text>
    </div>
  );
}

