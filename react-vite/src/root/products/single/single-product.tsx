'use client';

import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AppContextProvider';
import { Button } from '@/components/ui/button';
import { getSingleProduct } from '@/hooks/get-single-product';
import type { ProductData } from '@/types/product-data';
import { useState } from 'react';
import useToasts from "@/hooks/use-toasts";
import UpdateProduct from '@/components/table/dialog/update-product';
import DeleteProduct from '@/components/table/dialog/delete-product';
import { useProductStore } from '@/store/productStore';
export default function SingleProduct() {
    const navigate = useNavigate();
    const { user, loading, isAuthenticated } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const { showErrorToast } = useToasts();

    /* Use zustand state management to get the current product update */
    const products = useProductStore((state) => state.products);
    const product = products.find(p => p.product_id === parseInt(id || '0')) || null;

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    // Fetch product by ID
    useEffect(() => {
        if (!id || !isAuthenticated) return;

        // Check if product exists in store first
        const productInStore = products.find(p => p.product_id === parseInt(id));
        if (productInStore) return; // Product already in store, no need to fetch

        const fetchSingleProduct = async () => {
            setIsLoading(true);
            try {
                const data = await getSingleProduct(parseInt(id));
                useProductStore.setState(state => ({ products: [...state.products, data] }));
            } catch (error) {
                // showErrorToast("Failed to fetch product details. ");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSingleProduct();
    }, [id, isAuthenticated, products]);


    if (!isAuthenticated || !user) {
        return null; // Redirecting to login
    }
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[90vh] text-4xl">Loading...</div>;
    }

    if (!product) {
        return <div className="flex flex-col items-center justify-center min-h-[90vh] ">
            <span className='text-4xl text-red-600'>
                Product not found.
            </span>
            <p>
                <Link to="/products" className='ml-4 text-blue-600 underline'>
                    Go back to Products
                </Link>
            </p>
        </div>;
    }

    return (
        <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full flex-col items-center gap-0 py-0 px-4 bg-white dark:bg-black sm:items-start">
                <h1 className="2xs:text-4xl lg:text-6xl font-bold text-start">Single Product</h1>

                {/* Display Product */}
                <div
                    className="flex flex-col items-start w-full md:flex-row mt-10 gap-10 px-50"
                >
                    <img src={`https://picsum.photos/500`} alt="product" className="h-125 w-125 object-cover rounded" />
                    <div className="text-start">
                        <span className="font-medium text-muted-foreground text-sm uppercase">
                            {product.brand} | {product.category}
                        </span>
                        <h4 className="my-3 font-semibold text-3xl tracking-[-0.02em] uppercase">
                            {product.name}
                        </h4>
                        <p className='p-3 bg-[#ccb965]! w-fit text font-bold'>
                            <sup className='text-lg'>₱</sup><span className="text-3xl">{product.price}</span>
                        </p>
                        <p className='mt-4'>
                            In stock | <b>{product.stock_quantity}</b>&nbsp;Available
                        </p>
                        <p className="text-muted-foreground mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam aperiam blanditiis dolore atque laborum repellendus quasi deleniti nam eligendi porro ducimus consectetur mollitia magnam quas, inventore quod nobis, impedit sit itaque architecto distinctio delectus. Odit animi cupiditate, quo voluptas omnis, quia perspiciatis et provident eveniet incidunt impedit aspernatur vitae ipsa?</p>
                        <div className="flex gap-3 mt-6">
                            <Button className=" rounded-full" size="lg" onClick={() => setShowUpdateDialog(true)}>
                                Update
                            </Button>
                            <Button className="rounded-full" size="lg" onClick={() => setShowDeleteDialog(true)}>
                                Delete
                            </Button>
                        </div>

                        {/* Update Dialog */}
                        <UpdateProduct
                            data={product}
                            isOpen={showUpdateDialog}
                            onOpenChange={setShowUpdateDialog}
                        />
                        {/* Delete Dialog */}
                        <DeleteProduct
                            data={product}
                            isOpen={showDeleteDialog}
                            onOpenChange={setShowDeleteDialog}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
