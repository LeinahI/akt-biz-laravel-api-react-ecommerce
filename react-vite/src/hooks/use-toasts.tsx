import { useCallback } from 'react';
import { toast } from 'sonner';

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

interface UseToastsReturn {
    showSuccessToast: (message: string) => void;
    showErrorToast: (message: string) => void;
    handleApiResponse: <T = any>(response: ApiResponse<T>) => boolean;
}

export default function useToasts(): UseToastsReturn {
       const showSuccessToast = useCallback((message: string) => {
        toast.success(message);
    }, []);

    const showErrorToast = useCallback((message: string) => {
        toast.error(message);
    }, []);

    // Helper to handle API responses directly
    const handleApiResponse = useCallback(<T = any,>(response: ApiResponse<T>): boolean => {
        if (response.success) {
            showSuccessToast(response.message);
            return true;
        } else {
            showErrorToast(response.message);
            return false;
        }
    }, [showSuccessToast, showErrorToast]);

    return {
        showSuccessToast,
        showErrorToast,
        handleApiResponse,
    };
}
