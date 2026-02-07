import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ProductData } from "@/types/product-data";
import { api } from "@/lib/api";
import { useState } from "react";
import useToasts from "@/hooks/use-toasts";
import { useProductStore } from "@/store/productStore";
import { useNavigate } from 'react-router-dom';


interface DeleteProductProps {
    data: ProductData;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    navigateLink?: string
}

export default function DeleteProduct({ data, isOpen, onOpenChange, navigateLink = "/products" }: DeleteProductProps) {

    // Then in your component, add this line after other hooks:
    const { showSuccessToast, showErrorToast } = useToasts();
    const deleteProduct = useProductStore((state) => state.deleteProduct);

    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            const response = await api.delete(`/products/${data.product_id}`);
            // Show success toast from API response
            if (response.message) {
                navigate(navigateLink);
                deleteProduct(data.product_id); // Update Zustand store by removing the deleted product
                showSuccessToast(response.message);
                onOpenChange(false);
            }
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message || "Failed to delete product";
            showErrorToast(errorMessage);
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Product {data.name} {data.brand}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};
