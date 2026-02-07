import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { ProductUpdateData } from "@/types/product-data";
import useToasts from "@/hooks/use-toasts";
import { fetchProductCategories } from "@/hooks/fetch-product-categories";
import { useProductStore } from "@/store/productStore";

interface BackendErrors {
    [key: string]: string[];
}

interface UpdateProductProps {
    data: ProductUpdateData;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UpdateProduct({ data, isOpen, onOpenChange }: UpdateProductProps) {

    // Then in your component, add this line after other hooks:
    const { showSuccessToast, showErrorToast } = useToasts();
    const updateProduct = useProductStore((state) => state.updateProduct);

    const [categories, setCategories] = useState<Record<string, string>>({});
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [backendErrors, setBackendErrors] = useState<BackendErrors>({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await fetchProductCategories();
                setCategories(data);
            } catch (err) {
                setFetchError(err instanceof Error ? err.message : 'Failed to fetch categories');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchCategories();
    }, []);

    /* For updating data */
    const { control, handleSubmit, formState: { isSubmitting }, reset, setError, } = useForm<ProductUpdateData>({
        defaultValues: {
            product_id: data.product_id,
            update_name: data.name || "",
            update_brand: data.brand || "",
            update_category: data.category || "",
            update_price: data.price || "",
            update_stock_quantity: data.stock_quantity || "",
        }
    });

    const onSubmit = async (data: ProductUpdateData) => {
        setBackendErrors({});
        try {
            const response = await api.put(`/products/${data.product_id}`, {
                update_name: data.update_name.trim(),
                update_brand: data.update_brand.trim(),
                update_category: data.update_category.trim(),
                update_price: data.update_price,
                update_stock_quantity: data.update_stock_quantity,
            });

            // Show success toast from API response
            if (response.message) {
                updateProduct(response.data); // Update Zustand store with updated product
                showSuccessToast(response.message);
                onOpenChange(false);
            }
        } catch (err: any) {
            // Handle backend validation errors
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors as BackendErrors;
                setBackendErrors(errors);

                Object.keys(errors).forEach((field) => {
                    setError(field as keyof ProductUpdateData, {
                        type: "server",
                        message: errors[field][0] || "Validation error",
                    });
                });
            } else {
                showErrorToast("Failed to update product");
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="2xs:max-w-2xs xs:max-w-sm md:max-w-lg lg:max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Update Product</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to update the product. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="mt-5">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-1">
                                <Field>
                                    <Label htmlFor="update_name">Product Name</Label>
                                    <Controller
                                        name="update_name"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="update_name"
                                                    placeholder="Product Name"
                                                    disabled={isSubmitting}
                                                    className={error ? "border-red-500" : ""}
                                                />
                                                {error && (
                                                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                                                )}
                                            </>
                                        )}
                                    />
                                </Field>
                            </div>
                            <div className="col-span-1">
                                <Field>
                                    <Label htmlFor="update_brand">Brand Name</Label>
                                    <Controller
                                        name="update_brand"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="update_brand"
                                                    placeholder="Brand Name"
                                                    disabled={isSubmitting}
                                                    className={error ? "border-red-500" : ""}
                                                />
                                                {error && (
                                                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                                                )}
                                            </>
                                        )}
                                    />
                                </Field>
                            </div>
                            <div className="col-span-2">
                                <Field>
                                    <Label htmlFor="update_category">Category</Label>
                                    <Controller
                                        name="update_category"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Select
                                                    disabled={fetchLoading || isSubmitting}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger id="update_category" className={error ? "border-red-500" : ""}>
                                                        <SelectValue placeholder={fetchLoading ? "Fetching categories..." : "Select a category"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(categories).map(([key, value]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {value}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {error && (
                                                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                                                )}
                                                {fetchError && <p className="text-red-500 text-sm">{fetchError}</p>}
                                            </>
                                        )}
                                    />
                                </Field>
                            </div>
                            <div className="col-span-1">
                                <Field>
                                    <Label htmlFor="update_price">Price in ₱</Label>
                                    <Controller
                                        name="update_price"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="update_price"
                                                    placeholder="1"
                                                    disabled={isSubmitting}
                                                    className={error ? "border-red-500" : ""}
                                                />
                                                {error && (
                                                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                                                )}
                                            </>
                                        )}
                                    />
                                </Field>
                            </div>
                            <div className="col-span-1">
                                <Field>
                                    <Label htmlFor="update_stock_quantity">Stock Quantity</Label>
                                    <Controller
                                        name="update_stock_quantity"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="update_stock_quantity"
                                                    placeholder="1"
                                                    disabled={isSubmitting}
                                                    className={error ? "border-red-500" : ""}
                                                />
                                                {error && (
                                                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                                                )}
                                            </>
                                        )}
                                    />
                                </Field>
                            </div>
                        </div>
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update Product"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
