"use client";
/* 
References:
Table: https://www.shadcnui-blocks.com/components/table
initialState: https://tanstack.com/table/v8/docs/framework/react/guide/table-state
*/
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductData } from "@/types/product-data";
import { useEffect, useState } from "react";
import { AddProduct } from "@/components/table/dialog/add-product";
import { productColumns } from "@/components/table/product-columns";
import type { ColumnDef } from "@tanstack/react-table";
import { useProductStore } from "@/store/productStore";;

export default function ProductTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [columnsProducts, setColumnsProducts] = useState<ColumnDef<ProductData>[]>([]);

    // Get products from Zustand store
  const { products, isLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    /* State management implemented from previous implementation */
    const loadData = async () => {
      await fetchProducts();
      const cols = await productColumns();
      setColumnsProducts(cols);
    };

    loadData();
  }, [fetchProducts]);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const table = useReactTable({
    data: products,
    columns: columnsProducts,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5, // 5 rows per page
      }
    }
  });

  /* Columns Filtering */
  return (
    <div className="w-full">
      <div className="flex 2xs:flex-col sm:flex-row items-center justify-between gap-2 py-4 ">
        {/* Search Input */}
        <Input
          className="max-w-sm"
          onChange={(event) =>
            setGlobalFilter(event.target.value)
          }
          placeholder="Filter by name or brand..."
          value={globalFilter}
        />
        {/* Create Product Dialog */}
        <AddProduct />
      </div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show loading rows while data is being fetched
              Array.from({ length: 1 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell
                    className="h-78 text-center text-muted-foreground"
                    colSpan={table.getAllColumns().length}
                  >
                    Loading data...
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              // Show error message in table rows
              <TableRow>
                <TableCell
                  className="h-78 text-center text-red-500"
                  colSpan={table.getAllColumns().length}
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
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
                  className="h-24 text-center"
                  colSpan={table.getAllColumns().length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of&nbsp;
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}