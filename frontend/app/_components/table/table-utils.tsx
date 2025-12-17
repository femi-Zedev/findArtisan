import { ColumnDef } from '@tanstack/react-table';
import { TableCheckbox } from '../ui/table';

/**
 * Creates a selection column for use in DataTable
 * This column will always appear first when isSelectable is true
 */
export function createSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    enableHiding: false,
    enableSorting: false,
    enableResizing: false,
    enableColumnFilter: false,
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <TableCheckbox
          checked={table.getIsAllPageRowsSelected()}
          onChange={(event) => table.toggleAllPageRowsSelected(event.currentTarget.checked)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <TableCheckbox
          checked={row.getIsSelected()}
          onChange={(event) => row.toggleSelected(event.currentTarget.checked)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 16,
    minSize: 16,
    maxSize: 16,
  };
}

