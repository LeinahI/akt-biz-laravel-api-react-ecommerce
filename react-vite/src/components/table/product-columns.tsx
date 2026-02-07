import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductData } from "@/types/product-data";

  /* 
  References:
  Columns: https://www.shadcnui-blocks.com/components/table
  */
export const productColumns: ColumnDef<ProductData>[] = [
  {
    accessorKey: "product_id",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  /* Product name */
  {
    accessorKey: "name",
    header: () => <div className="text-left">Name</div>,
    cell: ({ row }) => (
      <div className="flex justify-start">
        <div>{row.getValue("name")}</div>
      </div>
    ),
    enableSorting: false,
  },
  /* Product Image */
  {
    id: "product-image",
    header: () => <div className="text-left">Image</div>,
    accessorFn: () => {
      return "https://picsum.photos/200";
    },
    cell: ({ row }) => (
      <div className="flex justify-start">
        <img src={row.getValue("product-image")} alt="product" className="h-18 w-18 object-cover rounded" />
      </div>
    ),
  },
  /* Product Brand */
  {
    accessorKey: "brand",
    header: () => <div className="text-left">Brand</div>,
    cell: ({ row }) => (
      <div className="flex justify-start">
        <div>{row.getValue("brand")}</div>
      </div>
    ),
  },
  /* Product Price */
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
        className="pl-1!"
      >
        Price
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(price);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  /* Product Category */
  {
    accessorKey: "category",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row }) => (
      <div className="flex justify-start">
        <div>{row.getValue("category")}</div>
      </div>
    ),
  },
  /* Stock quantity */
  {
    accessorKey: "stock_quantity",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
        className="pl-1!"
      >
        Stock Quantity
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("stock_quantity")}</div>
    ),
  },
  /* Updated at */
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
        className="pl-1!"
      >
        Updated At
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("updated_at")}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      // const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0" variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Update Product</DropdownMenuItem>
            <DropdownMenuItem>Delete Product</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];