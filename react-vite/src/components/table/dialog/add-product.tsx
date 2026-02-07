/* 
References:
Controller: https://react-hook-form.com/docs/usecontroller/controller
*/

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
import type { ProductStoreData } from "@/types/product-data";
import useToasts from "@/hooks/use-toasts";
import { fetchProductCategories } from "@/hooks/fetch-product-categories";
interface BackendErrors {
    [key: string]: string[];
}

export function AddProduct() {

    // Then in your component, add this line after other hooks:
    const { showSuccessToast, showErrorToast } = useToasts();

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

    /* For storing data */
    const { control, handleSubmit, formState: { isSubmitting }, reset, setError, } = useForm<ProductStoreData>({
        defaultValues: {
            store_name: "",
            store_brand: "",
            store_category: "",
            store_price: "",
            store_stock_quantity: "",
        }
    });

    const onSubmit = async (data: ProductStoreData) => {
        setBackendErrors({});
        try {
            const response = await api.post("/products", {
                store_name: data.store_name.trim(),
                store_brand: data.store_brand.trim(),
                store_category: data.store_category.trim(),
                store_price: data.store_price,
                store_stock_quantity: data.store_stock_quantity,
            });

            // Show success toast from API response
            if (response.message) {
                showSuccessToast(response.message);
                reset();
            }
        } catch (err: any) {
            // Handle backend validation errors
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors as BackendErrors;
                setBackendErrors(errors);

                Object.keys(errors).forEach((field) => {
                    setError(field as keyof ProductStoreData, {
                        type: "server",
                        message: errors[field][0] || "Validation error",
                    });
                });
                // showErrorToast(err.response.data.message || "Validation failed");
            } else {
                console.error("Failed to add product:", err);
                showErrorToast("Failed to add product");
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="2xs:w-full sm:w-fit bg-[#ccb965] hover:bg-[#ccb965]/70">Add New Product</Button>
            </DialogTrigger>
            <DialogContent className="2xs:max-w-2xs xs:max-w-sm md:max-w-lg lg:max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to add a new product. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="mt-5">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-1">
                                <Field>
                                    <Label htmlFor="store_name">Product Name</Label>
                                    <Controller
                                        name="store_name"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="store_name"
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
                                    <Label htmlFor="store_brand">Brand Name</Label>
                                    <Controller
                                        name="store_brand"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="store_brand"
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
                                    <Label htmlFor="store_category">Category</Label>
                                    <Controller
                                        name="store_category"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Select
                                                    disabled={fetchLoading || isSubmitting}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger id="store_category" className={error ? "border-red-500" : ""}>
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
                                    <Label htmlFor="store_price">Price in ₱</Label>
                                    <Controller
                                        name="store_price"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="store_price"
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
                                    <Label htmlFor="store_stock_quantity">Stock Quantity</Label>
                                    <Controller
                                        name="store_stock_quantity"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="store_stock_quantity"
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
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Product"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
