import { api } from "@/lib/api";
export async function getProducts(): Promise<Record<string, string>> {
  try {
    const res = await api.get('/products');
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch Products' + (error instanceof Error ? `: ${error.message}` : ''));
  }
}