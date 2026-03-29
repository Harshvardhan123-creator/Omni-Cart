import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Checkout: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Form state pre-filled from user profile
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: user?.addresses?.[0]?.street || '',
    apartment: '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    zip: user?.addresses?.[0]?.zip || user?.addresses?.[0]?.zipCode || '',
    country: user?.addresses?.[0]?.country || 'India',
    phone: user?.addresses?.[0]?.phone || ''
  });

  const subtotal = getCartTotal();
  const shipping = 0;
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;

  const [cardNumber, setCardNumber] = useState('');
  const [isCardValid, setIsCardValid] = useState<boolean | null>(null);

  const luhnCheck = (val: string) => {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
      let calc = 0;
      calc = Number(val.charAt(i)) * j;
      if (calc > 9) {
        checksum = checksum + 1;
        calc = calc - 10;
      }
      checksum = checksum + calc;
      if (j === 1) { j = 2; } else { j = 1; }
    }
    return (checksum % 10) === 0;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCardNumber(val);
    if (val.length > 12) {
      setIsCardValid(luhnCheck(val));
    } else {
      setIsCardValid(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCardValid === false) {
      alert("Please enter a valid credit card number.");
      return;
    }
    
    if (!token || !user) {
      alert("You must be logged in to place an order.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        user: user._id,
        items: cartItems.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedOptions: item.selectedOptions
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
          country: formData.country
        },
        paymentMethod: 'Credit Card',
        totalAmount: total,
        shippingPrice: shipping,
        taxPrice: tax
      };

      await api.createOrder(orderData, token);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error("Order Creation Error:", err);
      alert(`Failed to place order: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  // ... inside render ...

  {/* Shipping Address */ }
  <section className="mb-8">
    {/* ... existing shipping address code ... */}
  </section>

  {/* Payment Details */ }
  <section className="mb-8">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h2>
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardChange}
            maxLength={19}
            placeholder="0000 0000 0000 0000"
            className={`block w-full rounded-lg shadow-sm sm:text-sm py-3 px-4 dark:text-white dark:bg-gray-800 transition-colors
                                    ${isCardValid === true ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
                                    ${isCardValid === false ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary'}
                                `}
          />
          {isCardValid === true && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="material-icons text-green-500">check_circle</span>
            </div>
          )}
          {isCardValid === false && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="material-icons text-red-500">error</span>
            </div>
          )}
        </div>
        {isCardValid === false && (
          <p className="mt-1 text-sm text-red-600">Invalid card number (Luhn Algorithm check failed)</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration Date</label>
          <input type="text" placeholder="MM / YY" className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
          <input type="text" placeholder="123" maxLength={4} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 dark:text-white" />
        </div>
      </div>
    </div>
  </section>


  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <span className="material-icons-round text-green-600 text-5xl">check</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-8 max-w-md">Thank you for your purchase. We have sent a confirmation email to you@example.com.</p>
        <Link to="/" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty. Cannot proceed to checkout.</p>
        <Link to="/" className="text-primary hover:underline">Go Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Stepper */}
      <nav aria-label="Progress" className="mb-10 max-w-4xl mx-auto">
        <ol className="flex items-center">
          <li className="relative pr-8 sm:pr-20">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="h-0.5 w-full bg-primary"></div>
            </div>
            <a href="#" className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary-dark">
              <span className="material-icons text-white text-sm">local_shipping</span>
            </a>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-primary uppercase tracking-wide">Shipping</span>
          </li>
          <li className="relative pr-8 sm:pr-20">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <a href="#" className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600">
              <span className="material-icons text-gray-500 text-sm">credit_card</span>
            </a>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 uppercase tracking-wide">Payment</span>
          </li>
          <li className="relative">
            <a href="#" className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600">
              <span className="material-icons text-gray-500 text-sm">check</span>
            </a>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 uppercase tracking-wide">Review</span>
          </li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit}>
            {/* Contact Info */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 dark:text-white" 
                  placeholder="you@example.com" 
                />
                <div className="mt-4 flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-white dark:bg-gray-800" />
                  <label className="ml-2 block text-sm text-gray-500 dark:text-gray-400">Email me with news and offers</label>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apartment, suite, etc.</label>
                  <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                  <select name="country" value={formData.country} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 dark:text-white">
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Province</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP / Postal code</label>
                  <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} required className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <div className="relative rounded-lg shadow-sm">
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 dark:text-white" placeholder="(555) 987-6543" />
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
              <Link to="/cart" className="flex items-center text-primary hover:text-primary-dark font-medium text-sm group">
                <span className="material-icons text-lg mr-1 transform transition-transform group-hover:-translate-x-1">chevron_left</span>
                Return to cart
              </Link>
              <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-brand-green hover:bg-brand-green-hover disabled:opacity-50 text-white px-8 py-3.5 rounded-lg text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors flex justify-center items-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="material-icons animate-spin text-lg">autorenew</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <span className="material-icons text-lg">check</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 mt-10 lg:mt-0">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Order Summary</h3>
              </div>
              <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {cartItems.map((item) => (
                    <li key={item.id} className="py-4 first:pt-0">
                      <div className="flex items-center mb-3">
                        <span className="material-icons text-gray-400 text-sm mr-1">storefront</span>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sold by {item.vendor}</p>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white">
                          <img src={item.image} alt={item.name} className="h-full w-full object-contain object-center" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.color} {item.size}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Qty {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">${item.price.toFixed(2)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Total Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <span>Estimated Taxes</span>
                    <span className="material-icons text-gray-400 text-sm ml-1">info</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Grand Total</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-500 font-normal">USD</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;