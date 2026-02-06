'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AppContextProvider';

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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full flex-col items-center gap-6 py-32 px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="text-2xl font-bold">Products</h1>
                
            </main>
        </div>
    );
}
