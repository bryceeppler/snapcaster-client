// datatable.tsx
import React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from './button';
import { WishlistCard } from '@/stores/wishlistStore';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setHoveredCard?: React.Dispatch<React.SetStateAction<TData | null>>;
  deleteRow?: (wishlistItemId: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setHoveredCard,
  deleteRow
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection
    }
  });

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center gap-4 py-2 w-full">
        <div className="flex text-sm text-muted-foreground text-left">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="default"
              onClick={() =>
                table
                  .getFilteredRowModel()
                  .rows.forEach((row) => row.toggleSelected(false))
              }
            >
              Clear selection
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                table
                  .getFilteredSelectedRowModel()
                  .rows.forEach((row) => {
                    if (deleteRow) {
                      deleteRow((row.original as WishlistCard).wishlist_item_id);
                    }
                  }
                );
                // clear selection
                table
                  .getFilteredRowModel()
                  .rows.forEach((row) => row.toggleSelected(false));
              }}
            >
              Delete {table.getFilteredSelectedRowModel().rows.length} row(s)
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-md border text-left w-full border-zinc-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onMouseEnter={() => {
                    if (setHoveredCard) {
                      setHoveredCard(row.original);
                      console.log('setting card to hovered', row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
