import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  vendor: string;
  vendorLogo?: string;
  image: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
  shippingMethod: string;
  shippingCost: number;
  estDelivery?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  notification: string | null;
  closeNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('omnicart-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState<string | null>(null);

  // Persistence: Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('omnicart-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Legacy Check: Remove items with mock IDs ("1", "2") from previous versions
  useEffect(() => {
    const hasLegacyData = cartItems.some(item => item.productId === '1' || item.productId === '2');
    if (hasLegacyData) {
      console.log("🧹 Legacy cart data detected. Purging mock items...");
      setCartItems(prev => prev.filter(item => item.productId !== '1' && item.productId !== '2'));
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const closeNotification = () => setNotification(null);

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => 
        i.productId === item.productId && 
        i.vendor === item.vendor &&
        JSON.stringify(i.selectedOptions || {}) === JSON.stringify(item.selectedOptions || {})
      );
      if (existingItem) {
        showNotification(`Updated quantity for ${item.name}`);
        return prev.map(i => i.id === existingItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      showNotification(`Added ${item.name} to cart`);
      return [...prev, { ...item, quantity: 1, id: Math.random().toString(36).substr(2, 9) }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal, 
      getCartCount,
      notification,
      closeNotification
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};