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
