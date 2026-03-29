
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart, CartItem } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

  const subtotal = getCartTotal();
  const shipping = 0; // Simplified for now
  const tax = subtotal * 0.0825; // Example tax
  const total = subtotal + shipping + tax;

  // Group items by vendor
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.vendor]) {
      acc[item.vendor] = [];
    }
    acc[item.vendor].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const vendorKeys = Object.keys(groupedItems);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto"
        >
          <span className="material-icons-round text-gray-400 text-4xl">shopping_cart</span>
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-blue dark:text-white mb-2">Your Smart Cart</h1>
        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <span className="material-icons-round text-sm">info</span>
          Items are optimized into {vendorKeys.length} shipment package{vendorKeys.length !== 1 ? 's' : ''}.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Left Column: Cart Items (Stack Visualization) */}
        <div className="w-full lg:w-2/3 space-y-6">
          <AnimatePresence>
            {vendorKeys.map((vendor, index) => (
              <motion.section
                key={vendor}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                aria-labelledby={`package-${index}-title`}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-soft overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10"
                style={{ marginBottom: `-${vendorKeys.length > 1 ? '10px' : '0'}` }} // Overlap effect for stack look
              >
                <div className="bg-slate-blue/5 dark:bg-slate-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-icons-round text-primary dark:text-blue-400">inventory_2</span>
                    <div>
                      <h2 className="font-bold text-slate-blue dark:text-white text-lg" id={`package-${index}-title`}>Package {index + 1} of {vendorKeys.length}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Fulfilled by {vendor}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                    Free Shipping
                  </span>
                </div>
                <div className="p-6 space-y-8">
                  {groupedItems[vendor].map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 dark:border-gray-800 last:border-0 pb-6 last:pb-0">
                      <div className="w-full sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                        <img alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" src={item.image} />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors cursor-pointer">{item.name}</h3>
                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(' | ')}
                                </p>
                            )}
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 font-medium">In Stock</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">₹{item.price.toLocaleString('en-IN')}</p>
                            {item.originalPrice && (
                              <p className="text-xs text-gray-400 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-[44px] h-[44px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                                <span className="material-icons-round text-base">remove</span>
                              </button>
                              <div className="w-10 text-center font-medium text-gray-900 dark:text-white text-base">{item.quantity}</div>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-[44px] h-[44px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                                <span className="material-icons-round text-base">add</span>
                              </button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-sm text-gray-500 hover:text-red-500 font-medium px-2 py-2 rounded transition-colors flex items-center gap-1 group">
                              <span className="material-icons-round text-gray-400 group-hover:text-red-500 text-lg">delete_outline</span>
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="w-full lg:w-1/3 order-first lg:order-last">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-slate-blue dark:text-white mb-6">Order Summary</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-4 pb-2">
                  <div className="flex gap-2">
                    <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" placeholder="Promo code" type="text" />
                    <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Apply</button>
                  </div>
                </div>
              </div>
              <div className="border-t border-dashed border-gray-300 dark:border-gray-700 my-4"></div>
              <div className="flex justify-between items-center mb-6">
                 <span className="text-lg font-bold text-slate-blue dark:text-white">Total</span>
                 <span className="text-2xl font-bold text-primary dark:text-blue-400">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <Link to="/checkout" className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold text-lg py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group">
                Proceed to Checkout
                <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-4 border border-primary/20 dark:border-primary/30 flex items-start gap-3">
              <span className="material-icons-round text-primary dark:text-blue-400 mt-1">savings</span>
              <div>
                <p className="text-sm font-bold text-primary dark:text-blue-300">You saved ₹{(subtotal * 0.15).toLocaleString('en-IN')} today!</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Smart price comparison found the best deals automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;