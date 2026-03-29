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
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'init-1',
      productId: '1',
      name: 'Sony WH-1000XM5 Noise Canceling Headphones',
      price: 348.00,
      originalPrice: 399.00,
      vendor: 'Amazon',
      vendorLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJkqsiyK_6jhV-DIPYpPkr1-A8oyLCNXz00bqVRvZl89X8paNUZqT50jLXuDQicPj6oLruwieH6Dok0TkPzIxl_mh668oRrXUVaQXNLsInUyb7ieLZB3br6teZVtHn8PXwERjSYiu_ypeSR_jMWg3hvG4y8mbdR645NT6C59aJI82PFNkGMV9Jm9B_bkqV9RKyqr4PJsqBAX9WWdaEKuGHzvlxGy4Col8e8g-balvSHXSxAbhvZ-DtgkZCTpCCSACaCnB2vRMhn68',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZnQz5l68UlDAJXStb0_THBDxkdsnyuUciF_6FqsAFaeq4Ww1qja-PnONARY5wkzCv7OOXgZmj7ABPLg-9uBZsxrhzOpJUrfpK4aFFF8vosq7pWeBsvSM3l-dSUAn4hAcS3fXP4v_2L7QmZMqAWTvvevP5v1qZxygK-0QtYHb5u5nTpB-5Z-1pP46fMQELzTAEV7tZJQnaP0bNKKGU2G2E0Vh4CyPy3ZWvvOOc7XltKGoNfLhEehHE8PE_uxL8xmBNzEpzagu-gnw',
      quantity: 1,
      selectedOptions: { Color: 'Midnight Black' },
      shippingMethod: 'Free Shipping',
      shippingCost: 0,
      estDelivery: 'Tomorrow, Oct 24'
    },
    {
      id: 'init-2',
      productId: '2',
      name: 'Nike Air Zoom Pegasus 39',
      price: 120.00,
      vendor: 'Nike',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1K5wg1uAARNIOJ5lK2ZYfBov1Q72JudNw5E_rxda4A0EUYsOaR6LU47GPfJVHoazwmC0RS7rFsEgU6eF-z955wMfgXIE-CGCtaiacaK-eqcpGY0Gz78CZMPdJLDywtre0e-HIa7OF6VuJwDNT044xN7XZWfvNqK3IvK1Pghl0j7J6RSKxeok6RDzajwnlazSMS-stYWOsDWroB0fAQqeqzWCNOR8kIhTf7aY7ysGbF57xYdUJrt_EXRVdWJ78eF4cIKFrgVea10',
      quantity: 1,
      selectedOptions: { Size: '10 US', Color: 'University Red' },
      shippingMethod: 'Standard Shipping',
      shippingCost: 0,
      estDelivery: 'Oct 24 - Oct 26'
    }
  ]);
  const [notification, setNotification] = useState<string | null>(null);

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