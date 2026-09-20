import { createContext } from 'react';
import type { Product, CartItem, ActivityLog, ViewMode, MobileView } from '../types';

export interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'sale';
}

export interface BoutiqueContextType {
  products: Product[];
  cart: CartItem[];
  isCartOpen: boolean;
  activityLogs: ActivityLog[];
  viewMode: ViewMode;
  mobileView: MobileView;
  lastUpdatedProductId: string | null;
  activeSaleNotice: string | null;
  toasts: ToastInfo[];
  
  // Calculations
  cartCount: number;
  cartTotal: number;
  cartOriginalTotal: number;
  cartSavings: number;
  activeDiscountCount: number;
  
  // Product & Admin Operations
  updateBasePrice: (id: string, newPrice: number) => void;
  updateDiscount: (id: string, discountPercentage: number) => void;
  applyStorewideDiscount: (discountPercentage: number) => void;
  resetAllDiscounts: () => void;
  toggleStock: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  resetCatalog: () => void;

  // Cart Operations
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;

  // UI View Controls
  setViewMode: (mode: ViewMode) => void;
  setMobileView: (view: MobileView) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'sale') => void;
  dismissToast: (id: string) => void;
}

export const BoutiqueContext = createContext<BoutiqueContextType | undefined>(undefined);
