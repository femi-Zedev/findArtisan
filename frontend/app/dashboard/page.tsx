"use client";

import { useMemo } from "react";
import { useUserStore } from "@/stores/userStore";
import { Card, Text, Title, Group, Skeleton, Button } from "@mantine/core";
import { Users, FileText, TrendingUp, UserPlus } from "lucide-react";
import {
  useGetDashboardStats,
  type AdminStats,
  type UserStats,
  dashboardKeys,
} from "@/app/lib/services/dashboard";
import { useDrawerContext } from "@/providers/drawer-provider";
import { AddArtisanSelection } from "@/app/_components/forms/AddArtisanSelection";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { user } = useUserStore();
  const { data: stats, isLoading, error } = useGetDashboardStats();
  const { openDrawer, closeDrawer } = useDrawerContext();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const sessionUserId = session?.user?.id;

  const handleOpenAddArtisanDrawer = () => {
    openDrawer({
      title: "Ajouter un artisan",
      body: (
        <AddArtisanSelection
        />
      ),
      size: "xl",
      bodyClassName: "p-6 overflow-y-hidden",
    });
  };

  // Build stats array based on role and fetched data
  const statsCards = useMemo(() => {
    if (!stats) return [];

    // Determine role from the shape of the stats, not from cached frontend role
    const isAdminStats = (stats as AdminStats).pendingSubmissions !== undefined;

    if (isAdminStats) {
      const adminStats = stats as AdminStats;
      return [
        {
          label: "Total Artisans",
          value: adminStats.totalArtisans.toLocaleString(),
          icon: Users,
          color: "teal",
          bgGradient: "from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30",
          iconBg: "bg-teal-500",
          borderColor: "border-teal-200 dark:border-teal-800",
          textColor: "text-teal-700 dark:text-teal-300",
        },
        {
          label: "Soumissions récentes",
          value: adminStats.pendingSubmissions.toLocaleString(),
          icon: FileText,
          color: "yellow",
          bgGradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30",
          iconBg: "bg-yellow-500",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          textColor: "text-yellow-700 dark:text-yellow-300",
        },
        {
          label: "Ce mois-ci",
          value: adminStats.thisMonth.toLocaleString(),
          icon: TrendingUp,
          color: "blue",
          bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
          iconBg: "bg-blue-500",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-700 dark:text-blue-300",
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
          bgGradient: "from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30",
          iconBg: "bg-teal-500",
          borderColor: "border-teal-200 dark:border-teal-800",
          textColor: "text-teal-700 dark:text-teal-300",
        },
        {
          label: "Mes Contributions",
          value: userStats.myContributions.toLocaleString(),
          icon: FileText,
          color: "yellow",
          bgGradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30",
          iconBg: "bg-yellow-500",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          textColor: "text-yellow-700 dark:text-yellow-300",
        },
        {
          label: "Ce mois-ci",
          value: userStats.thisMonth.toLocaleString(),
          icon: TrendingUp,
          color: "blue",
          bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
          iconBg: "bg-blue-500",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-700 dark:text-blue-300",
        },
      ];
    }
  }, [stats, user?.id]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 dark:from-teal-950/20 dark:via-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
        <Title order={1} className="flex items-center gap-2" mb="xs">
          Bon retour, <span className="capitalize text-teal-600 dark:text-teal-400">{user?.name || "Utilisateur"}</span> !
        </Title>
        <Text c="dimmed" size="sm">
          {stats && (stats as AdminStats).pendingSubmissions !== undefined
            ? "Gérez les artisans, examinez les soumissions et supervisez la plateforme."
            : "Gérez vos contributions et ajoutez de nouveaux artisans à la plateforme."}
        </Text>
      </div>

      {/* Stats Section Header with Add Button */}
      <div className="flex items-center justify-between">
        <Title order={2}>Statistiques</Title>
        <Button
          leftSection={<UserPlus className="h-4 w-4" />}
          onClick={handleOpenAddArtisanDrawer}
          radius="md"
          size="md"
          className="bg-teal-500 hover:bg-teal-600 text-white cursor-pointer"
        >
          Ajouter un Artisan
        </Button>
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
              <Card
                key={stat.label}
                padding="lg"
                radius="md"
                className={`bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} hover:shadow-lg transition-shadow`}
              >
                <Group justify="space-between" mb="xs">
                  <Text fw={500} size="sm" className={stat.textColor}>
                    {stat.label}
                  </Text>
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </Group>
                <Text fw={700} size="xl" className={stat.textColor}>
                  {stat.value}
                </Text>
              </Card>
            );
          })
        )}
      </div>

      {/* Platform Information */}
      <Card
        padding="lg"
        radius="lg"
        withBorder
        className="bg-white dark:bg-gray-950"
      >
        <Title order={2} mb="md">
          Comment fonctionne la plateforme ?
        </Title>
        <div className="space-y-4">
          {stats && (stats as AdminStats).pendingSubmissions !== undefined ? (
            <>
              <Text size="sm" className="text-gray-700 dark:text-gray-300">
                FindArtisan est une plateforme communautaire qui facilite la découverte d'artisans locaux au Bénin.
                Voici comment elle fonctionne :
              </Text>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">•</span>
                  <Text size="sm" className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold">Découverte facile :</strong> Les utilisateurs peuvent rechercher des artisans par profession et zone géographique
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">•</span>
                  <Text size="sm" className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold">Contributions communautaires :</strong> Les membres de la communauté ajoutent des profils d'artisans qu'ils connaissent
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">•</span>
                  <Text size="sm" className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold">Votre rôle :</strong> En tant qu'administrateur, vous examinez et validez les soumissions pour maintenir la qualité des données
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">•</span>
                  <Text size="sm" className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold">Impact :</strong> Chaque profil validé aide les Béninois à trouver rapidement les services dont ils ont besoin
                  </Text>
                </div>
              </div>
            </>
          ) : (
            <>
              <Text size="sm" className="text-gray-700 dark:text-gray-300">
                FindArtisan est une plateforme communautaire qui facilite la découverte d'artisans locaux au Bénin.
                Voici comment elle fonctionne et pourquoi votre contribution est importante :
              </Text>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">•</span>
                  <Text size="sm" className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold">Découverte facile :</strong> Les utilisateurs peuvent rechercher des artisans par profession et zone géographique
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">•</span>
                  <Text size="sm" className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold">Contributions communautaires :</strong> Vous pouvez ajouter des profils d'artisans que vous connaissez et recommandez
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">•</span>
                  <Text size="sm" className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold">Visibilité immédiate :</strong> Vos contributions sont <strong className="font-semibold">visibles publiquement dès leur ajout</strong>.
                    Elles peuvent être retirées si elles ne respectent pas nos critères de qualité. Soyez prudent(e) avec les informations que vous publiez et assurez-vous qu'elles sont exactes et à jour
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">•</span>
                  <Text size="sm" className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold">Impact réel :</strong> Chaque artisan que vous ajoutez aide vos concitoyens à trouver rapidement les services dont ils ont besoin
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">•</span>
                  <Text size="sm" className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold">Communauté solidaire :</strong> Ensemble, nous créons un répertoire complet et fiable d'artisans locaux
                  </Text>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

