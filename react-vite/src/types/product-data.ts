export interface ProductData {
  product_id: number;
  user_id: {
    name: string;
  };
  name: string;
  brand: string;
  price: number; /* Decimal */
  category: string; /* string */
  stock_quantity: number; /* Integer */
  /* Dates */
  created_at: string;
  updated_at: string;
}

export interface ProductStoreData {
  store_name: string;
  store_brand: string;
  store_category: string;
  store_price: number | string; /* Decimal, String for allowing empty string */
  store_stock_quantity: number | string; /* Integer, String for allowing empty string */
}

export interface ProductUpdateData extends ProductData {
  update_name: string;
  update_brand: string;
  update_category: string;
  update_price: number | string; /* Decimal */
  update_stock_quantity: number | string; /* Integer */
}