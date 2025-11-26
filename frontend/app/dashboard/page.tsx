"use client";

import { useUserStore } from "@/stores/userStore";
import { Card, Text, Title, Group, Badge } from "@mantine/core";
import { Users, FileText, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user, getUserType, isAdmin } = useUserStore();
  const userType = getUserType();

  const stats = [
    {
      label: "Total Artisans",
      value: "0",
      icon: Users,
      color: "teal",
    },
    {
      label: userType == "contributor" ? "Soumissions rejétées" : "Soumissions récentes",
      value: "0",
      icon: FileText,
      color: "yellow",
    },
    {
      label: "Ce mois-ci",
      value: "0",
      icon: TrendingUp,
      color: "blue",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <Title order={1} mb="xs">
          Bon retour, {user?.name || "Utilisateur"} !
        </Title>
        <Text c="dimmed" size="sm">
          {isAdmin()
            ? "Gérez les artisans, examinez les soumissions et supervisez la plateforme."
            : "Gérez vos contributions et ajoutez de nouveaux artisans à la plateforme."}
        </Text>
        <Badge color="teal" variant="light" mt="sm">
          {userType === "admin" ? "Administrateur" : "Contributeur"}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500} size="sm" c="dimmed">
                  {stat.label}
                </Text>
                <Icon className="h-5 w-5 text-gray-400" />
              </Group>
              <Text fw={700} size="xl">
                {stat.value}
              </Text>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">
          Actions rapides
        </Title>
        <div className="space-y-2">
          {isAdmin() ? (
            <>
              <Text size="sm">• Examiner les soumissions communautaires en attente</Text>
              <Text size="sm">• Gérer les profils d'artisans</Text>
              <Text size="sm">• Consulter les statistiques de la plateforme</Text>
            </>
          ) : (
            <>
              <Text size="sm">• Ajouter un nouvel artisan à la plateforme</Text>
              <Text size="sm">• Consulter l'historique de vos contributions</Text>
              <Text size="sm">• Vérifier le statut de vos soumissions</Text>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

