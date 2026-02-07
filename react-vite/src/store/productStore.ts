/* 
* ===== productStore.ts ======
* Zustand State Management for Product Data on Table

* This file implements global state management for product data using Zustand.
* It handles Create, Read, Update, Delete (CRUD) operations and data fetching from the API.

* ===== State Properties =====
* products: An array that holds product objects fetched from the Laravel API.
* isLoading: A boolean flag that indicates whether the product data is currently being fetched.
* error: A variable that stores error messages if API calls fail, or null if there are no errors.

* ===== Setter Actions =====
* setProducts: Directly replace the entire products array.
* setLoading: Update the loading state
* setError: Update the error message

* ===== CRUD Actions =====
* These actions modify the products array without API calls, allowing for immediate UI updates.

* addProduct: Insert a new product into the products array, after a successful API creation
* updateProduct: Modify an existing product in the array based on its product_id, after a successful API update
* deleteProduct: Remove a product from the array based on its product_id, after a successful API deletion

* ===== ASYNC API Operations =====
* fetchProducts: Async function to fetch products from Laravel API

* Flow:
* 1. Sets isLoading to true and clears the previous error state.
* 2. Calls getProducts() API hook (makes actual HTTP request)
* 3. On success: Updates products with fetched data and sets isLoading to false.
* 4. On error: Captures error message, updates error state, and sets isLoading to false.
*/
import { create } from "zustand";
import type { ProductStateData } from "@/types/product-state";
import { getProducts } from "@/hooks/get-products";

export const useProductStore = create<ProductStateData>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }), /*  */
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
