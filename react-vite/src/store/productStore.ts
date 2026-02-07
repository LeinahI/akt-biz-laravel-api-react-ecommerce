// State management for products CRUD function
import { create } from "zustand";
import type { ProductStoreData } from "@/types/product-store";
import { getProducts } from "@/hooks/get-products";

export const useProductStore = create<ProductStoreData>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addProduct: (product) => {
    set((state) => ({
      products: [...state.products, product],
    }));
  },

  updateProduct: (updatedProduct) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.product_id === updatedProduct.product_id
          ? updatedProduct
          : product,
      ),
    }));
  },

  deleteProduct: (productId) => {
    set((state) => ({
      products: state.products.filter(
        (product) => product.product_id !== productId,
      ),
    }));
  },

    /* Fetch products on product-table */
    fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getProducts();
      set({ products: data, isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },
}));
