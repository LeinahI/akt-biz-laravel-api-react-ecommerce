import { api } from "@/lib/api";
import type { ProductData } from "@/types/product-data";

export async function getSingleProduct(id: number): Promise<ProductData> {
  try {
    const res = await api.get(`/products/${id}`);
    
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch Product' + (error instanceof Error ? `: ${error.message}` : ''));
  }
}