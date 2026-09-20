import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, CartItem, ActivityLog, ViewMode, MobileView } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'sale';
}

interface BoutiqueContextType {
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

const BoutiqueContext = createContext<BoutiqueContextType | undefined>(undefined);

export const calculateDiscountedPrice = (basePrice: number, discountPercentage: number): number => {
  if (!discountPercentage || discountPercentage <= 0) return basePrice;
  const discounted = basePrice * (1 - discountPercentage / 100);
  return Math.round(discounted);
};

export const BoutiqueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load products from localStorage if available, or fall back to INITIAL_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('classy_tailors_catalog');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse errors
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('classy_tailors_cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [mobileView, setMobileView] = useState<MobileView>('storefront');
  const [lastUpdatedProductId, setLastUpdatedProductId] = useState<string | null>(null);
  const [activeSaleNotice, setActiveSaleNotice] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'init-1',
      message: 'Atelier live session initialized. Dual-view sync connected.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'system'
    }
  ]);

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('classy_tailors_catalog', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('classy_tailors_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Keep cart items updated when products price/discount change
  useEffect(() => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        const matchingProduct = products.find((p) => p.id === item.product.id);
        if (matchingProduct) {
          return { ...item, product: matchingProduct };
        }
        return item;
      })
    );
  }, [products]);

  const addLog = useCallback((message: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'sale' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Admin Action: Update Base Price
  const updateBasePrice = useCallback((id: string, newPrice: number) => {
    const validPrice = Math.max(0, Math.round(newPrice));
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, basePrice: validPrice };
        }
        return p;
      })
    );
    setLastUpdatedProductId(id);
    setTimeout(() => setLastUpdatedProductId(null), 2500);

    const prod = products.find((p) => p.id === id);
    const prodName = prod ? prod.name : id;
    addLog(`Updated base price of "${prodName}" to $${validPrice.toLocaleString()}`, 'price');
    showToast(`Updated price for "${prodName}" to $${validPrice.toLocaleString()}`, 'info');
  }, [products, addLog, showToast]);

  // Admin Action: Update Discount
  const updateDiscount = useCallback((id: string, discountPercentage: number) => {
    const clampedDiscount = Math.min(100, Math.max(0, Math.round(discountPercentage)));
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, discountPercentage: clampedDiscount };
        }
        return p;
      })
    );
    setLastUpdatedProductId(id);
    setTimeout(() => setLastUpdatedProductId(null), 2500);

    const prod = products.find((p) => p.id === id);
    const prodName = prod ? prod.name : id;
    if (clampedDiscount > 0) {
      addLog(`Applied ${clampedDiscount}% discount to "${prodName}"`, 'discount');
      showToast(`Applied ${clampedDiscount}% discount to "${prodName}"`, 'sale');
    } else {
      addLog(`Removed discount from "${prodName}"`, 'discount');
      showToast(`Removed discount from "${prodName}"`, 'info');
    }
  }, [products, addLog, showToast]);

  // Admin Action: Storewide Discount
  const applyStorewideDiscount = useCallback((discountPercentage: number) => {
    const clampedDiscount = Math.min(100, Math.max(0, Math.round(discountPercentage)));
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        discountPercentage: clampedDiscount,
      }))
    );
    setActiveSaleNotice(`${clampedDiscount}% Storewide Atelier Sale Active`);
    addLog(`Applied Storewide ${clampedDiscount}% Off Sale across entire boutique`, 'storewide');
    showToast(`Storewide ${clampedDiscount}% Off Sale applied instantly!`, 'sale');
  }, [addLog, showToast]);

  // Admin Action: Reset All Discounts
  const resetAllDiscounts = useCallback(() => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        discountPercentage: 0,
      }))
    );
    setActiveSaleNotice(null);
    addLog('Reset all product discounts to 0%', 'storewide');
    showToast('All product discounts cleared to standard pricing.', 'info');
  }, [addLog, showToast]);

  // Admin Action: Toggle Stock
  const toggleStock = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = !p.inStock;
          addLog(`Marked "${p.name}" as ${newStatus ? 'In Stock' : 'Out of Stock'}`, 'stock');
          showToast(`"${p.name}" is now ${newStatus ? 'In Stock' : 'Out of Stock'}`, 'info');
          return { ...p, inStock: newStatus };
        }
        return p;
      })
    );
  }, [addLog, showToast]);

  // Admin Action: Add New Product
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const newId = `ct-${String(Date.now()).slice(-4)}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    setLastUpdatedProductId(newId);
    setTimeout(() => setLastUpdatedProductId(null), 2500);
    addLog(`Added new luxury garment: "${newProduct.name}" ($${newProduct.basePrice})`, 'product');
    showToast(`Added "${newProduct.name}" to catalog`, 'success');
  }, [addLog, showToast]);

  // Admin Action: Delete Product
  const deleteProduct = useCallback((id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    addLog(`Removed "${prod ? prod.name : id}" from catalog`, 'product');
    showToast(`Product removed from boutique catalog`, 'info');
  }, [products, addLog, showToast]);

  // Admin Action: Reset Catalog
  const resetCatalog = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setActiveSaleNotice(null);
    addLog('Reset entire catalog to default bespoke collection', 'system');
    showToast('Reset catalog to initial state', 'info');
  }, [addLog, showToast]);

  // Cart Operations
  const addToCart = useCallback((product: Product, size: string = '40R / M') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        return [...prev, { product, quantity: 1, size }];
      }
    });
    showToast(`Added "${product.name}" (${size}) to shopping bag`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  }, []);

  const updateCartQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculated totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce((total, item) => {
    const discountedPrice = calculateDiscountedPrice(
      item.product.basePrice,
      item.product.discountPercentage
    );
    return total + discountedPrice * item.quantity;
  }, 0);

  const cartOriginalTotal = cart.reduce(
    (total, item) => total + item.product.basePrice * item.quantity,
    0
  );

  const cartSavings = Math.max(0, cartOriginalTotal - cartTotal);

  const activeDiscountCount = products.filter((p) => p.discountPercentage > 0).length;

  return (
    <BoutiqueContext.Provider
      value={{
        products,
        cart,
        isCartOpen,
        activityLogs,
        viewMode,
        mobileView,
        lastUpdatedProductId,
        activeSaleNotice,
        toasts,
        cartCount,
        cartTotal,
        cartOriginalTotal,
        cartSavings,
        activeDiscountCount,
        updateBasePrice,
        updateDiscount,
        applyStorewideDiscount,
        resetAllDiscounts,
        toggleStock,
        addProduct,
        deleteProduct,
        resetCatalog,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        setIsCartOpen,
        setViewMode,
        setMobileView,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </BoutiqueContext.Provider>
  );
};

export const useBoutique = () => {
  const context = useContext(BoutiqueContext);
  if (!context) {
    throw new Error('useBoutique must be used within a BoutiqueProvider');
  }
  return context;
};
