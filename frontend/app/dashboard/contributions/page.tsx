"use client";

import { Text, Button } from "@mantine/core";
import { DataTable } from "@/app/_components/DataTable";
import { TableHeader } from "@/app/_components/TableHeader";
import { SearchInput } from "@/app/_components/SearchInput";
import { artisanColumns } from "../artisans/_columns/artisan.columns";
import { useGetArtisans, type Artisan, artisanKeys } from "@/app/lib/services/artisan";
import { useMemo, useState, useEffect } from "react";
import { useDrawerContext } from "@/providers/drawer-provider";
import { AddArtisanForm } from "@/app/_components/forms/AddArtisan.form";
import { AddArtisanSelection } from "@/app/_components/forms/AddArtisanSelection";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useDebouncedValue } from "@mantine/hooks";
import { UserPlus } from "lucide-react";

export default function ContributionsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  // Debounce search query to avoid too many API calls
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  const { openDrawer, closeDrawer } = useDrawerContext();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id; // Get current user ID

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  // Fetch current user's contributions
  const { data, isLoading, isFetching, error } = useGetArtisans({
    page,
    limit: pageSize,
    q: debouncedSearchQuery || undefined,
    submittedBy: userId || undefined, // Filter by current user's submissions
  });

  const artisans = data?.data || [];
  const pagination = data?.meta?.pagination;

  // Calculate pageCount for server-side pagination
  const pageCount = useMemo(() => {
    if (!pagination) return 0;
    return pagination.pageCount;
  }, [pagination]);

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

  const handleOpenAddArtisanDrawer = () => {
    openDrawer({
      title: "Ajouter un artisan",
      body: (
        <AddArtisanSelection
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

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <Text c="red" size="sm">
            Erreur lors du chargement de vos contributions. Veuillez réessayer.
          </Text>
        </div>
      )}

      <div className="space-y-0">
        <TableHeader
          title="Mes Contributions"
          rightSection={
            <div className="flex items-center justify-between w-full">
              <SearchInput
                placeholder="Rechercher contributions..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="mx-auto"
              />
              <Button
                leftSection={<UserPlus className="h-4 w-4" />}
                onClick={handleOpenAddArtisanDrawer}
                className="cursor-pointer"
                radius={10}
                size="md"
              >
                Ajouter un Artisan
              </Button>
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
            editOnly: true, // Only show edit button, no delete/reject
          }}
        />
      </div>
    </div>
  );
}
