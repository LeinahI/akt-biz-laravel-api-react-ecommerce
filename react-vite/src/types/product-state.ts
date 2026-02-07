import type { ProductData } from "@/types/product-data";

export interface ProductStateData {
  products: ProductData[];
  isLoading: boolean;
  error: string | null;
  /* Actions */
  setProducts: (products: ProductData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  /* Crud Operations */
  addProduct: (product: ProductData) => void;
  updateProduct: (product: ProductData) => void;
  deleteProduct: (productId: number) => void;
  /* Fetch Products */
  fetchProducts: () => Promise<void>;
}
