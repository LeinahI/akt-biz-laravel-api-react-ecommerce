import { api } from "@/lib/api";
export async function fetchProductCategories(): Promise<Record<string, string>> {
    try {
        const res = await api.get('/product-categories');
        return res.data?.productCategory || {};
    } catch (error) {
        throw new Error('Failed to fetch product categories' + (error instanceof Error ? `: ${error.message}` : ''));
    }
}