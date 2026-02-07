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

async function getProductCategories(): Promise<Record<string, string>> {
    try {
        const res = await api.get('/product-categories');
        return res.data?.productCategory || {};
    } catch (error) {
        throw new Error('Failed to fetch product categories' + (error instanceof Error ? `: ${error.message}` : ''));
    }
}
export function AddProduct() {

    const [categories, setCategories] = useState<Record<string, string>>({});
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getProductCategories();
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
    const [storeName, setStoreName] = useState("");
    const [storeBrand, setStoreBrand] = useState("");
    const [storeCategory, setStoreCategory] = useState("");
    const [storePrice, setStorePrice] = useState("");
    const [storeStockQuantity, setStoreStockQuantity] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/products", {
                store_name: storeName.trim(),
                store_brand: storeBrand.trim(),
                store_category: storeCategory.trim(),
                store_price: storePrice.trim(),
                store_stock_quantity: storeStockQuantity.trim(),
            });

        } catch (err: any) {
            console.error("Failed to add product:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add New Product</Button>
            </DialogTrigger>
            <DialogContent className="2xs:max-w-2xs xs:max-w-sm md:max-w-lg lg:max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to add a new product. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-1">
                                <Field>
                                    <Label htmlFor="store_name">Product Name</Label>
                                    <Input
                                        id="store_name"
                                        name="store_name"
                                        placeholder="Product Name"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </Field>
                            </div>
                            <div className="col-span-1">
                                <Field>
                                    <Label htmlFor="store_brand">Brand Name</Label>
                                    <Input
                                        id="store_brand"
                                        name="store_brand"
                                        placeholder="Brand Name"
                                        value={storeBrand}
                                        onChange={(e) => setStoreBrand(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </Field>
                            </div>
                            <div className="col-span-2">
                                <Field>
                                    <Label htmlFor="store_category">Category</Label>
                                    <Select
                                        name="store_category"
                                        disabled={fetchLoading || isLoading}
                                        value={storeCategory}
                                        onValueChange={(value) => setStoreCategory(value)}
                                    >
                                        <SelectTrigger id="store_category">
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
                                    {fetchError && <p className="text-red-500 text-sm">{fetchError}</p>}
                                </Field>
                            </div>
                            <div className="col-span-1">
                                <Field>
                                    <Label htmlFor="store_price">Price in ₱</Label>
                                    <Input
                                        id="store_price"
                                        name="store_price"
                                        type="number"
                                        placeholder="1"
                                        value={storePrice}
                                        onChange={(e) => setStorePrice(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </Field>
                            </div>
                            <div className="col-span-1">
                                <Field>
                                    <Label htmlFor="store_stock_quantity">Stock Quantity</Label>
                                    <Input
                                        id="store_stock_quantity"
                                        name="store_stock_quantity"
                                        type="number"
                                        placeholder="1"
                                        value={storeStockQuantity}
                                        disabled={isLoading}
                                        onChange={(e) => setStoreStockQuantity(e.target.value)}
                                    />
                                </Field>
                            </div>
                        </div>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Adding..." : "Add Product"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
