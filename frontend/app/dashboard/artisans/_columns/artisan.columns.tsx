import { ColumnDef } from '@tanstack/react-table';
import { Artisan } from '@/app/lib/services/artisan';
import { Badge } from '@mantine/core';
import { Edit, Trash2, X } from 'lucide-react';

export const artisanColumns: ColumnDef<Artisan>[] = [
  {
    accessorKey: 'fullName',
    header: 'Nom complet',
    cell: ({ row }) => {
      const artisan = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {artisan.fullName}
          </span>
          {artisan.profession && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {artisan.profession.name}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'zones',
    header: 'Zones',
    cell: ({ row }) => {
      const zones = row.original.zones;
      if (!zones || zones.length === 0) {
        return <span className="text-gray-400 dark:text-gray-500">-</span>;
      }
      const zoneColors = [
        'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300 border-pink-200 dark:border-pink-800',
        'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      ];
      return (
        <div className="flex flex-wrap gap-1.5">
          {zones.slice(0, 2).map((zone, index) => (
            <Badge
              key={zone.id}
              size="sm"
              variant="light"
              className={`${zoneColors[index % zoneColors.length]} border`}
            >
              {zone.name}
            </Badge>
          ))}
          {zones.length > 2 && (
            <Badge
              size="sm"
              variant="light"
              className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700 border"
            >
              +{zones.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'phoneNumbers',
    header: 'Téléphone',
    cell: ({ row }) => {
      const phoneNumbers = row.original.phoneNumbers;
      if (!phoneNumbers || phoneNumbers.length === 0) {
        return <span className="text-gray-400 dark:text-gray-500">-</span>;
      }
      return (
        <span className="text-gray-900 dark:text-gray-100">
          {phoneNumbers[0].number}
          {phoneNumbers.length > 1 && (
            <span className="text-gray-500 dark:text-gray-400"> (+{phoneNumbers.length - 1})</span>
          )}
        </span>
      );
    },
  },

  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        pending: {
          label: 'En attente',
          className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        },
        approved: {
          label: 'Approuvé',
          className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800',
        },
        rejected: {
          label: 'Rejeté',
          className: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800',
        },
        removed: {
          label: 'Supprimé',
          className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
        },
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
      return (
        <Badge
          size="sm"
          variant="light"
          className={`${config.className} border`}
        >
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'isCommunitySubmitted',
    header: 'Source',
    cell: ({ row }) => {
      const isCommunity = row.original.isCommunitySubmitted;
      return (
        <Badge
          size="sm"
          variant="light"
          className={isCommunity
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800 border'
            : 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 border-teal-200 dark:border-teal-800 border'
          }
        >
          {isCommunity ? 'Communauté' : 'Admin'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date de soumission',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-gray-500 dark:text-gray-400">
          {date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const artisan = row.original;
      const meta = table.options.meta as any;
      const showReject = meta?.showReject ?? false; // Default to false (show delete)

      return (
        <div className="flex items-center  gap-2">
          <button
            onClick={() => meta?.onEdit?.(artisan)}
            className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
            aria-label="Modifier"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          {showReject ? (
            <button
              onClick={() => meta?.onReject?.(artisan)}
              className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Rejeter"
              title="Rejeter"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => meta?.onDelete?.(artisan)}
              className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Supprimer"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
];

