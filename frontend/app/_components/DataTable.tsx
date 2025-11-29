'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  CellContext,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
  PaginationState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCheckbox,
} from '@/app/_components/ui/table';
import { ReactNode, useState, useEffect, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon, Download } from 'lucide-react';
import { Button } from '@/app/_components/ui/Button';
import { TableSkeleton } from './ui/table-skeleton';
import { cn } from '@/app/lib/utils';

interface ExportKey {
  header: string;
  accessor: string | ((item: any) => string);
}

interface DataTableProps<TData, TValue> {
  isSelectable?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  columns: ColumnDef<TData, TValue>[];
  columnVisibility?: VisibilityState;
  data: TData[];
  isLoading?: boolean;
  hideTable?: boolean;
  hideTableHeader?: boolean;
  innerContent?: React.ReactNode;
  className?: string;
  footerClassName?: string;
  tableBodyClassName?: string;
  clickableRows?: boolean;
  maxRows?: number;
  scrollable?: boolean;
  onRowAction?: (action: string, row: TData) => void;
  onCellAction?: (action: string, row: TData) => void;
  rowRenderer?: (props: { row: any }) => React.ReactNode;
  enableDownload?: boolean;
  downloadPrefix?: string;
  exportKeys?: ExportKey[];
  onPaginationChange?: (pagination: number) => void;
  // Server-side pagination props
  manualPagination?: boolean;
  pageCount?: number;
  initialState?: {
    pagination?: {
      pageIndex: number;
      pageSize: number;
    };
  };
  // Controlled pagination state (for syncing with URL)
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationStateChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  meta?: Record<string, any>;
  noTopBorderRadius?: boolean; // When true, removes top border radius (for use with TableHeader)
}

export interface ExtendedCellContext<TData, TValue> extends CellContext<TData, TValue> {
  onRowAction?: (action: string, row: TData) => void;
  onCellAction?: (action: string, row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isSelectable = false,
  onSelectionChange,
  columnVisibility,
  className,
  hideTable = false,
  hideTableHeader = false,
  innerContent,
  footerClassName,
  tableBodyClassName,
  clickableRows = false,
  maxRows = 10,
  scrollable = false,
  onCellAction,
  onRowAction,
  isLoading = false,
  rowRenderer,
  enableDownload = false,
  downloadPrefix = 'data',
  exportKeys,
  onPaginationChange,
  // Server-side pagination props
  manualPagination = false,
  pageCount,
  initialState,
  pagination: controlledPagination,
  onPaginationStateChange,
  meta,
  noTopBorderRadius = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Use controlled pagination if provided, otherwise use internal state
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    controlledPagination || initialState?.pagination || { pageIndex: 0, pageSize: maxRows }
  );

  // Use controlled pagination if provided, otherwise use internal state
  // Memoize to ensure new reference when controlled prop changes (helps React Table detect changes)
  const paginationState = useMemo(() => {
    if (controlledPagination) {
      return {
        pageIndex: controlledPagination.pageIndex,
        pageSize: controlledPagination.pageSize
      };
    }
    return internalPagination;
  }, [controlledPagination?.pageIndex, controlledPagination?.pageSize, internalPagination]);

  // Sync internal state when controlled pagination changes (for initial render)
  useEffect(() => {
    if (controlledPagination) {
      setInternalPagination(controlledPagination);
    }
  }, [controlledPagination]);

  // Inline selection column using TableCheckbox
  // This column will always appear first when isSelectable is true
  const selectionColumn: ColumnDef<TData, TValue> = {
    id: 'select',
    enableHiding: false,
    enableSorting: false,
    enableResizing: false,
    enableColumnFilter: false,
    header: ({ table }: any) => (
      <div className="flex items-center justify-center">
        <TableCheckbox
          checked={table.getIsAllPageRowsSelected()}
          onChange={(event) => table.toggleAllPageRowsSelected(event.currentTarget.checked)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }: any) => (
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

  // Ensure selection column is always first when selectable
  const finalColumns: ColumnDef<TData, TValue>[] = isSelectable
    ? [selectionColumn, ...columns]
    : columns;

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
      pagination: paginationState,
    },
    enableRowSelection: isSelectable,
    onRowSelectionChange: setRowSelection,
    initialState: initialState || { pagination: { pageSize: maxRows }, columnVisibility },
    manualPagination,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function'
        ? updater(paginationState)
        : updater;

      if (controlledPagination) {
        // If controlled, notify parent
        onPaginationStateChange?.(newPagination);
      } else {
        // If uncontrolled, update internal state
        setInternalPagination(newPagination);
      }
    },
    getSortedRowModel: getSortedRowModel(),
    meta,
  });

  // Call onSelectionChange when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange]);

  // Function to convert data to CSV and download
  const downloadCSV = () => {
    const currentPageData = table.getRowModel().rows.map((row) => row.original);

    let headers: string[];
    let csvRows: string[][];

    if (exportKeys && exportKeys.length > 0) {
      // Use custom export keys if provided
      headers = exportKeys.map((key) => key.header);

      csvRows = currentPageData.map((item) => {
        return exportKeys.map((key) => {
          let value = '';

          if (typeof key.accessor === 'string') {
            // Handle nested object properties (e.g., 'user.email')
            value = key.accessor.split('.').reduce((obj, prop) => obj?.[prop], item as any) || '';
          } else if (typeof key.accessor === 'function') {
            // Use custom function to extract value
            value = key.accessor(item) || '';
          }

          // Convert value to string and escape quotes
          const stringValue = String(value).replace(/"/g, '""');

          // Wrap in quotes if contains comma, quote, or newline
          if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            return `"${stringValue}"`;
          }

          return stringValue;
        });
      });
    } else {
      // Fallback to original logic if no export keys provided
      const visibleColumns = table.getVisibleLeafColumns().filter((col) => col.id !== 'select');

      headers = visibleColumns.map((col) => {
        const header = col.columnDef.header;
        if (typeof header === 'string') {
          return header;
        } else if (typeof header === 'function') {
          return (col.columnDef.meta as any)?.title || col.id || 'Column';
        }
        return col.id || 'Column';
      });

      csvRows = currentPageData.map((item) => {
        return visibleColumns.map((col) => {
          const columnDef = col.columnDef as any;
          const accessor = columnDef.accessorKey || columnDef.accessorFn;
          let value = '';

          if (typeof accessor === 'string') {
            value = accessor.split('.').reduce((obj, key) => obj?.[key], item as any) || '';
          } else if (typeof accessor === 'function') {
            value = accessor(item, 0) || '';
          } else {
            value = (item as any)[col.id] || '';
          }

          const stringValue = String(value).replace(/"/g, '""');

          if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            return `"${stringValue}"`;
          }

          return stringValue;
        });
      });
    }

    // Combine headers and rows
    const csvContent = [headers, ...csvRows].map((row) => row.join(',')).join('\n');

    // Create and download file
    const currentPage = table.getState().pagination.pageIndex + 1;
    const filename = `${downloadPrefix}_page_${currentPage}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Determine if footer should be shown
  // Hide footer when there's only one page with fewer items than page size
  // (unless rows are selected or download is enabled)
  const hasEnoughItemsForPagination = data.length >= paginationState.pageSize;
  const showFooter =
    table.getIsAllPageRowsSelected() ||
    table.getIsSomePageRowsSelected() ||
    (table.getPageCount() > 1) ||
    (table.getPageCount() === 1 && hasEnoughItemsForPagination) ||
    enableDownload;

  function handleCellClick(event: React.MouseEvent, cell: any) {
    // Only stop propagation if this cell has its own action handler
    const hasCellAction =
      typeof cell.column.columnDef.cell === 'function' && cell.column.columnDef.meta?.hasCellAction;

    if (hasCellAction) {
      // Stop the click event from bubbling up to the row
      event.stopPropagation();
    }
  }

  return (
    <div className={cn(' bg-white  w-full')}>
      {enableDownload && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      )}
      {!hideTable && (
        <>
          {isLoading ? (
            <TableSkeleton columnCount={columns.length} rowCount={4} hasHeader={!hideTableHeader} />
          ) : (
            <div className={cn('w-full inline-grid', className)}>
              <div
                className={cn(
                  'overflow-auto overflow-x-auto w-full border border-gray-200 dark:border-gray-800',
                  !noTopBorderRadius && 'rounded-t-lg',
                  !showFooter && 'rounded-b-xl border-b', // Add bottom border and radius when footer is hidden
                  showFooter && 'border-b-0', // Remove bottom border when footer is present
                  scrollable && `[&>div]:max-h-150`
                )}
              >
                <Table>
                  {hideTableHeader == false && (
                    <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-800">
                          {headerGroup.headers.map((header) => {
                            const isSelectColumn = header.column.id === 'select';
                            return (
                              <TableHead
                                key={header.id}
                                style={{
                                  width: header.getSize(),
                                }}
                                className={cn(
                                  "text-xs font-bold",
                                  isSelectColumn && "text-center pr-0"
                                )}
                                aria-sort={
                                  header.column.getIsSorted() === 'asc'
                                    ? 'ascending'
                                    : header.column.getIsSorted() === 'desc'
                                      ? 'descending'
                                      : 'none'
                                }
                              >
                                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                  <div
                                    className={cn(
                                      header.column.getCanSort() &&
                                      'flex h-full cursor-pointer items-center gap-2 select-none hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
                                    )}
                                    onClick={header.column.getToggleSortingHandler()}
                                    onKeyDown={(e) => {
                                      // Enhanced keyboard handling for sorting
                                      if (
                                        header.column.getCanSort() &&
                                        (e.key === 'Enter' || e.key === ' ')
                                      ) {
                                        e.preventDefault();
                                        header.column.getToggleSortingHandler()?.(e);
                                      }
                                    }}
                                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                                  >
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                    {{
                                      asc: (
                                        <ChevronUpIcon
                                          className="shrink-0 h-4 w-4 text-gray-600 dark:text-gray-400"
                                          aria-hidden="true"
                                        />
                                      ),
                                      desc: (
                                        <ChevronDownIcon
                                          className="shrink-0 h-4 w-4 text-gray-600 dark:text-gray-400"
                                          aria-hidden="true"
                                        />
                                      ),
                                    }[header.column.getIsSorted() as string] ?? null}
                                  </div>
                                ) : (
                                  flexRender(header.column.columnDef.header, header.getContext())
                                )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                  )}
                  <TableBody className={tableBodyClassName}>
                    {table.getRowModel().rows?.length ? (
                      <>
                        {table.getRowModel().rows.map((row) =>
                          rowRenderer ? (
                            rowRenderer({ row })
                          ) : (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && 'selected'}
                              className={cn(clickableRows && onRowAction && 'cursor-pointer')}
                              onClick={(e) => {
                                if (clickableRows && onRowAction) {
                                  onRowAction('row-click', row.original);
                                }
                              }}
                            >
                              {row.getVisibleCells().map((cell) => {
                                const isSelectColumn = cell.column.id === 'select';
                                return (
                                  <TableCell
                                    key={cell.id}
                                    style={{
                                      width: cell.column.getSize(),
                                    }}
                                    className={cn(
                                      "whitespace-nowrap",
                                      isSelectColumn && "text-center pr-0!"
                                    )}
                                    onClick={(e) => handleCellClick(e, cell)}
                                  >
                                    {typeof cell.column.columnDef.cell === 'function'
                                      ? cell.column.columnDef.cell({
                                        ...cell.getContext(),
                                        onCellAction,
                                      } as ExtendedCellContext<TData, TValue>)
                                      : cell.column.columnDef.cell}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          )
                        )}
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No data.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </>
      )}

      {hideTable == true && innerContent && <>{innerContent}</>}

      {showFooter && (
        <div
          id="footer"
          className={cn(
            'text-sm flex items-center justify-between py-4 px-6 border border-gray-200 dark:border-gray-800 border-t rounded-b-xl bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 font-normal',
            footerClassName
          )}
        >
          <div className="flex items-center space-x-4">
            {table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected() ? (
              <p className="text-gray-600 dark:text-gray-400">
                {table.getSelectedRowModel().rows.length} row(s) selected
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentPageIndex = table.getState().pagination.pageIndex;
                const newPageIndex = currentPageIndex - 1;

                if (controlledPagination) {
                  // For controlled pagination, notify parent to update state
                  onPaginationStateChange?.({ pageIndex: newPageIndex, pageSize: paginationState.pageSize });
                } else {
                  // For uncontrolled pagination, update internal state via table API
                  table.setPageIndex(newPageIndex);
                  onPaginationChange?.(newPageIndex);
                }
              }}
              disabled={!table.getCanPreviousPage() || isLoading}
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentPageIndex = table.getState().pagination.pageIndex;
                const newPageIndex = currentPageIndex + 1;

                if (controlledPagination) {
                  // For controlled pagination, notify parent to update state
                  onPaginationStateChange?.({ pageIndex: newPageIndex, pageSize: paginationState.pageSize });
                } else {
                  // For uncontrolled pagination, update internal state via table API
                  table.setPageIndex(newPageIndex);
                  onPaginationChange?.(newPageIndex);
                }
              }}
              disabled={!table.getCanNextPage() || isLoading}
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
