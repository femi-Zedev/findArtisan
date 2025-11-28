"use client";

import { useMemo } from "react";
import { useUserStore } from "@/stores/userStore";
import { Card, Text, Title, Group, Skeleton } from "@mantine/core";
import { Users, FileText, TrendingUp } from "lucide-react";
import { useGetDashboardStats, type AdminStats, type UserStats } from "@/app/lib/services/dashboard";

export default function DashboardPage() {
  const { user, getUserType, isAdmin } = useUserStore();
  const userType = getUserType();
  const { data: stats, isLoading, error } = useGetDashboardStats();

  // Build stats array based on role and fetched data
  const statsCards = useMemo(() => {
    if (!stats) return [];

    if (isAdmin()) {
      const adminStats = stats as AdminStats;
      return [
        {
          label: "Total Artisans",
          value: adminStats.totalArtisans.toLocaleString(),
          icon: Users,
          color: "teal",
        },
        {
          label: "Soumissions récentes",
          value: adminStats.pendingSubmissions.toLocaleString(),
          icon: FileText,
          color: "yellow",
        },
        {
          label: "Ce mois-ci",
          value: adminStats.thisMonth.toLocaleString(),
          icon: TrendingUp,
          color: "blue",
        },
      ];
    } else {
      const userStats = stats as UserStats;
      return [
        {
          label: "Total Artisans",
          value: userStats.totalArtisans.toLocaleString(),
          icon: Users,
          color: "teal",
        },
        {
          label: "Mes Contributions",
          value: userStats.myContributions.toLocaleString(),
          icon: FileText,
          color: "yellow",
        },
        {
          label: "Ce mois-ci",
          value: userStats.thisMonth.toLocaleString(),
          icon: TrendingUp,
          color: "blue",
        },
      ];
    }
  }, [stats, isAdmin]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <Title order={1} className="flex items-center gap-2" mb="xs">
          Bon retour, <p className="capitalize">{user?.name || "Utilisateur"}</p> !
        </Title>
        <Text c="dimmed" size="sm">
          {isAdmin()
            ? "Gérez les artisans, examinez les soumissions et supervisez la plateforme."
            : "Gérez vos contributions et ajoutez de nouveaux artisans à la plateforme."}
        </Text>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} padding="lg" radius="md" withBorder>
              <Skeleton height={20} mb="xs" />
              <Skeleton height={32} />
            </Card>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-3">
            <Card padding="lg" radius="md" withBorder>
              <Text c="red" size="sm">
                Erreur lors du chargement des statistiques. Veuillez réessayer.
              </Text>
            </Card>
          </div>
        ) : (
          // Stats cards
          statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} padding="lg" radius="md" withBorder>
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
          })
        )}
      </div>

      {/* Platform Information */}
      <Card padding="lg" radius="md" withBorder>
        <Title order={2} mb="md">
          Comment fonctionne la plateforme ?
        </Title>
        <div className="space-y-4">
          {isAdmin() ? (
            <>
              <Text size="sm" mb="sm">
                FindArtisan est une plateforme communautaire qui facilite la découverte d'artisans locaux au Bénin.
                Voici comment elle fonctionne :
              </Text>
              <div className="space-y-2">
                <Text size="sm">• <strong>Découverte facile :</strong> Les utilisateurs peuvent rechercher des artisans par profession et zone géographique</Text>
                <Text size="sm">• <strong>Contributions communautaires :</strong> Les membres de la communauté ajoutent des profils d'artisans qu'ils connaissent</Text>
                <Text size="sm">• <strong>Votre rôle :</strong> En tant qu'administrateur, vous examinez et validez les soumissions pour maintenir la qualité des données</Text>
                <Text size="sm">• <strong>Impact :</strong> Chaque profil validé aide les Béninois à trouver rapidement les services dont ils ont besoin</Text>
              </div>
            </>
          ) : (
            <>
              <Text size="md" mb="sm">
                FindArtisan est une plateforme communautaire qui facilite la découverte d'artisans locaux au Bénin.
                Voici comment elle fonctionne et pourquoi votre contribution est importante :
              </Text>
              <div className="space-y-3 text-balance w-full">
                <p className="text-md">• <strong>Découverte facile :</strong> Les utilisateurs peuvent rechercher des artisans par profession et zone géographique</p>
                <p className="text-md">• <strong>Contributions communautaires :</strong> Vous pouvez ajouter des profils d'artisans que vous connaissez et recommandez</p>
                <p className="text-m text-balance">• <strong>Visibilité immédiate :</strong> Vos contributions sont <strong >visibles publiquement dès leur ajout</strong>.
                  Elles peuvent être retirées si elles ne respectent pas nos critères de qualité. Soyez prudent(e) avec les informations que vous publiez et assurez-vous qu'elles sont exactes et à jour</p>
                <p className="text-md">• <strong>Impact réel :</strong> Chaque artisan que vous ajoutez aide vos concitoyens à trouver rapidement les services dont ils ont besoin</p>
                <p className="text-md">• <strong>Communauté solidaire :</strong> Ensemble, nous créons un répertoire complet et fiable d'artisans locaux</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

