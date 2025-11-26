"use client";

import { Title, Text } from "@mantine/core";

export default function ContributionsPage() {
  return (
    <div>
      <Title order={2} mb="md">
        Mes Contributions
      </Title>
      <Text c="dimmed">
        Cette page affichera tous les artisans que vous avez contribués à la plateforme.
      </Text>
      <Text size="sm" c="dimmed" mt="sm">
        TODO: Implémenter la liste des contributions, le suivi du statut et la fonctionnalité d'édition.
      </Text>
    </div>
  );
}

