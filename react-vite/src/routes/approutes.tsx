import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '@/components/nav/navigation.tsx';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import Me from '@/pages/me/me';
import Products from '@/pages/products/products';
import { useAuth } from "@/context/AppContextProvider";
import SingleProduct from '@/pages/products/single-product';
import { AuthGuard } from '@/layouts/auth-layout-guard';
import { GuestLayoutGuard } from '@/layouts/guest-layout-guard';

export default function AppRoutes() {

    const { loading } = useAuth();

    // Show loading screen while auth is being checked
    if (loading) {
        return <div className="flex min-h-screen flex-col">
            <p>Loading...</p>
        </div>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navigation />
            <Routes>
                {/* Guest Routes - Non authenticated users */}
                <Route element={<GuestLayoutGuard />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                {/* Protected Routes - Only accessible when authenticated */}
                <Route element={<AuthGuard />}>
                    <Route path="/me" element={<Me />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<SingleProduct />} />
                </Route>

                {/* Catch-all root redirect */}
                <Route path="/" element={<Navigate to="/me" replace />} />

                {/* 404 fallback */}
                <Route path="*" element={<Navigate to="/me" replace />} />
            </Routes>
        </div>
    )
};
