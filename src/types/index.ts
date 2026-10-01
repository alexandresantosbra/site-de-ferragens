export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  image_url: string;
  specs: string;
  stock: number;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  items: CartItemData[];
  total: number;
  status: string;
  notes: string | null;
}

export interface CartItemData {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}
