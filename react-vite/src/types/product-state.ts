import type { ProductData } from "@/types/product-data";

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

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
