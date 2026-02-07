'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AppContextProvider';

export default function Me() {
    const navigate = useNavigate();
    const { user, loading, isAuthenticated, logout } = useAuth();

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
                <h1 className="2xs:text-4xl lg:text-6xl font-bold text-start">Your Profile</h1>
                
                <div className="w-full max-w-md space-y-4 mt-5">
                    <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                        <p className="text-lg font-semibold">{user.name}</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-lg font-semibold">{user.email}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </main>
        </div>
    );
}
