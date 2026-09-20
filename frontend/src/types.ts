export interface Product {
  id: string;
  name: string;
  basePrice: number;
  discountPercentage: number; // 0 to 100
  category: string;
  imageUrl: string;
  description: string;
  fabric: string;
  inStock: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface RawCartItem {
  productId: string;
  quantity: number;
  size: string;
}

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: string;
  type: 'price' | 'discount' | 'storewide' | 'stock' | 'system' | 'product';
}

export type ViewMode = 'split' | 'storefront' | 'admin';
export type MobileView = 'storefront' | 'admin';
