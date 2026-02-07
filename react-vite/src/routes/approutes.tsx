import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '@/components/nav/navigation.tsx';
import Login from '@/auth/login.tsx';
import Register from '@/auth/register.tsx';
import Me from '@/root/me.tsx';
import Products from '@/root/products/products.tsx';
import { useAuth } from "@/context/AppContextProvider";
import SingleProduct from '@/root/products/single/single-product';

export default function AppRoutes() {
    const { isAuthenticated } = useAuth();
    return (
        <div className="flex min-h-screen flex-col">
            <Navigation />
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/me" replace /> : <Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/me" element={<Me />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<SingleProduct />} />
            </Routes>
        </div>
    )
};
