import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, } from "@/context/AppContextProvider";

export const GuestLayoutGuard = () => {
    const { isAuthenticated, loading } = useAuth();

    // IMPORTANT: Wait for the auth check to finish before rendering anything
    if (loading) return <p>Loading...</p>; 

    if (isAuthenticated) {
        return <Navigate to="/me" replace />;
    }

    return <Outlet />; // Renders the child route (Login/Register)
};