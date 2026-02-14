import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "@/context/AppContextProvider";

export const AuthGuard = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};