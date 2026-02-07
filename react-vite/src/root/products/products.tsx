'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AppContextProvider';
import ProductTable from '@/components/table/product-table';

export default function Products() {
    const navigate = useNavigate();
    const { user, loading, isAuthenticated } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    if (!isAuthenticated || !user) {
        return null; // Redirecting to login
    }

    return (
        <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full flex-col items-center gap-0 py-0 px-4 bg-white dark:bg-black sm:items-start">
                <h1 className="2xs:text-4xl lg:text-6xl font-bold text-start">Products</h1>
                <ProductTable />
            </main>
        </div>
    );
}
