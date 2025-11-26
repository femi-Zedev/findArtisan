"use client";

import { Title, Text } from "@mantine/core";

export default function SubmissionsPage() {
  return (
    <div>
      <Title order={2} mb="md">
        Soumissions Communautaires
      </Title>
      <Text c="dimmed">
        Cette page affichera tous les profils d'artisans soumis par la communauté pour examen (Administrateur uniquement).
      </Text>
      <Text size="sm" c="dimmed" mt="sm">
        TODO: Implémenter la liste des soumissions, l'examen, l'approbation, le rejet et la fonctionnalité d'édition.
      </Text>
    </div>
  );
}

