import { api } from "@/lib/api";
import type { PaginationMeta } from "@/types/product-state";

interface GetProductsResponse extends PaginationMeta {
  data: Record<string, string> | Array<Record<string, string>>;
}
export async function getProducts(page: number = 1): Promise<GetProductsResponse> {
  try {
    const res = await api.get('/products', {
      params: { page }
    });
    return res.data; // Return the pagination object, not the wrapper
  } catch (error) {
    throw new Error('Failed to fetch Products' + (error instanceof Error ? `: ${error.message}` : ''));
  }
}