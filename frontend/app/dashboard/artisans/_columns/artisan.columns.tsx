import { ColumnDef } from '@tanstack/react-table';
import { Artisan } from '@/app/lib/services/artisan';
import { Badge } from '@mantine/core';
import { Edit, Trash2 } from 'lucide-react';

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
      return (
        <div className="flex flex-wrap gap-1.5">
          {zones.slice(0, 2).map((zone) => (
            <Badge
              key={zone.id}
              size="sm"
              variant="light"
              className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-0"
            >
              {zone.name}
            </Badge>
          ))}
          {zones.length > 2 && (
            <Badge
              size="sm"
              variant="light"
              className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-0"
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
    accessorKey: 'isCommunitySubmitted',
    header: 'Source',
    cell: ({ row }) => {
      const isCommunity = row.original.isCommunitySubmitted;
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCommunity
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
          : 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
          }`}>
          {isCommunity ? 'Communauté' : 'Admin'}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date de création',
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

      return (
        <div className="flex items-center  gap-2">
          <button
            onClick={() => meta?.onEdit?.(artisan)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
            aria-label="Modifier"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => meta?.onDelete?.(artisan)}
            className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            aria-label="Supprimer"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
];

