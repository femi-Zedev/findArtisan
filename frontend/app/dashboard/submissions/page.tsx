"use client";

import { Text } from "@mantine/core";
import { DataTable } from "@/app/_components/DataTable";
import { TableHeader } from "@/app/_components/TableHeader";
import { SearchInput } from "@/app/_components/SearchInput";
import { artisanColumns } from "../artisans/_columns/artisan.columns";
import { useGetArtisans, useDeleteArtisan, useUpdateArtisan, type Artisan, artisanKeys } from "@/app/lib/services/artisan";
import { useMemo, useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useConfirmationContext } from "@/providers/confirmation-provider";
import { useDrawerContext } from "@/providers/drawer-provider";
import { AddArtisanForm } from "@/app/_components/forms/AddArtisan.form";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useDebouncedValue } from "@mantine/hooks";

export default function SubmissionsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  // Debounce search query to avoid too many API calls
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  const { openConfirmation } = useConfirmationContext();
  const { openDrawer, closeDrawer } = useDrawerContext();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const jwt = (session?.user as any)?.strapiJwt || '';

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  // Fetch community submissions (all statuses for admin review)
  const { data, isLoading, isFetching, error } = useGetArtisans({
    page,
    limit: pageSize,
    q: debouncedSearchQuery || undefined,
    isCommunitySubmitted: true, // Only show community submissions
    // Don't filter by status - show all (approved, pending, etc.) for admin review
  });

  const artisans = data?.data || [];
  const pagination = data?.meta?.pagination;

  // Calculate pageCount for server-side pagination
  const pageCount = useMemo(() => {
    if (!pagination) return 0;
    return pagination.pageCount;
  }, [pagination]);

  const deleteArtisanMutation = useDeleteArtisan({
    onSuccess: () => {
      notifications.show({
        title: "Suppression",
        message: "L'artisan a été supprimé avec succès",
        color: "red",
      });
      // Invalidate and refetch artisans list
      queryClient.invalidateQueries({ queryKey: artisanKeys.searches() });
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Erreur",
        message: error.message || "Une erreur est survenue lors de la suppression",
        color: "red",
      });
    },
  });

  const handleEdit = (artisan: Artisan) => {
    openDrawer({
      title: "Modifier l'artisan",
      body: (
        <AddArtisanForm
          artisan={artisan}
          onSuccess={() => {
            // Invalidate and refetch artisans list
            queryClient.invalidateQueries({ queryKey: artisanKeys.searches() });
            closeDrawer();
          }}
        />
      ),
      size: "xl",
      bodyClassName: "p-6 overflow-y-hidden",
    });
  };

  const updateArtisanMutation = useUpdateArtisan({
    onSuccess: () => {
      notifications.show({
        title: "Succès",
        message: "L'artisan a été rejeté avec succès",
        color: "red",
      });
      queryClient.invalidateQueries({ queryKey: artisanKeys.searches() });
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Erreur",
        message: error.message || "Une erreur est survenue lors du rejet",
        color: "red",
      });
    },
  });

  const handleReject = (artisan: Artisan) => {
    openConfirmation({
      message: `Êtes-vous sûr de vouloir rejeter l'artisan "${artisan.fullName}" ? Cette action changera son statut à "rejeté".`,
      confirmLabel: "Rejeter",
      cancelLabel: "Annuler",
      variant: "danger",
      onConfirm: async () => {
        if (!jwt) {
          notifications.show({
            title: "Erreur",
            message: "Authentification requise",
            color: "red",
          });
          return;
        }
        await updateArtisanMutation.mutateAsync({
          id: artisan.id,
          payload: {
            full_name: artisan.fullName,
            description: artisan.description || '',
            profession: artisan.profession?.slug || '',
            zones: artisan.zones.map(z => z.slug),
            phone_numbers: artisan.phoneNumbers.map(p => ({
              number: p.number,
              is_whatsapp: p.isWhatsApp,
            })),
            social_links: artisan.socialLinks.map(s => ({
              platform: s.platform,
              link: s.link,
            })),
            profile_photo: artisan.profilePhoto?.id,
            is_community_submitted: artisan.isCommunitySubmitted,
            status: 'rejected', // Set status to rejected
          },
          jwt,
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <Text c="red" size="sm">
            Erreur lors du chargement des soumissions. Veuillez réessayer.
          </Text>
        </div>
      )}

      <div className="space-y-0">
        <TableHeader
          title="Soumissions Communautaires"
          rightSection={
            <div className="flex items-center justify-end w-full">
              <SearchInput
                placeholder="Rechercher dans les soumissions..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
          }
          dataCount={pagination?.total}
        />

        <DataTable
          isSelectable
          noTopBorderRadius
          columns={artisanColumns}
          data={artisans}
          isLoading={isLoading}
          manualPagination={true}
          pageCount={pageCount}
          pagination={{
            pageIndex: page - 1, // TanStack Table uses 0-based index
            pageSize: pageSize,
          }}
          onPaginationStateChange={(newPagination) => {
            // Update local state when pagination changes
            const newPage = newPagination.pageIndex + 1; // Convert to 1-based
            // Validate page is within bounds before setting
            if (newPage >= 1 && (pageCount === 0 || newPage <= pageCount)) {
              setPage(newPage);
            }
          }}
          meta={{
            onEdit: handleEdit,
            onReject: handleReject,
            showReject: true, // Show reject button instead of delete
          }}
        />
      </div>
    </div>
  );
}
