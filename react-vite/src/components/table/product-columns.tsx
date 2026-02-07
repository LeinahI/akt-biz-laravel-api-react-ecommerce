/* 
References:
Columns: https://www.shadcnui-blocks.com/components/table
*/
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductData } from "@/types/product-data";
import ProductActions from "./product-actions";
import { fetchProductCategories } from "@/hooks/fetch-product-categories";

export const productColumns = async (): Promise<ColumnDef<ProductData>[]> => {

  const categories = await fetchProductCategories();
  return [
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
    /* Product Category */
    {
      accessorKey: "category",
      header: () => <div className="text-left">Category</div>,
      cell: ({ row }) => {
        const categoryKey = row.getValue("category") as string;
        const categoryName = categories[categoryKey] || categoryKey;
        return (
          <div className="flex justify-start">
            <div>{categoryName}</div>
          </div>
        );
      },
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
        const data = row.original as ProductData;
        return <ProductActions data={data} />;
      },
    },];
};