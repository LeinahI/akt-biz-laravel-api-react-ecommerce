import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteProduct from "./dialog/delete-product";
import UpdateProduct from "./dialog/update-product";
import type { ProductData } from "@/types/product-data";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProductActions({ data }: { data: ProductData }) {

    const navigate = useNavigate();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    const handleViewProduct = () => {
        navigate(`/products/${data.product_id}`);
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8 p-0" variant="ghost">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={handleViewProduct}
                    >View Product</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowUpdateDialog(true)}
                    >Update Product</DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-400 focus:text-red-600 hover:bg-red-600/10"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        Delete Product
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* View Product */}

            {/* Delete Dialog */}
            <DeleteProduct
                data={data}
                isOpen={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
            {/* Update Dialog */}
            <UpdateProduct
                data={data}
                isOpen={showUpdateDialog}
                onOpenChange={setShowUpdateDialog}
            />
        </>
    )
};
