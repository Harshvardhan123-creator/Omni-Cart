import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';
import Categories from './pages/Categories';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { CartProvider, useCart } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Toast = () => {
  const { notification, closeNotification } = useCart();
  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-[slideIn_0.3s_ease-out]">
      <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 min-w-[300px]">
        <span className="material-icons-round text-brand-green">check_circle</span>
        <p className="font-medium text-sm flex-1">{notification}</p>
        <button onClick={closeNotification} className="text-gray-400 hover:text-white dark:hover:text-slate-600">
          <span className="material-icons-round text-sm">close</span>
        </button>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <CartProvider>
      <HashRouter>
        <AuthProvider>
          <ScrollToTop />
          <AppContent />
        </AuthProvider>
      </HashRouter>
    </CartProvider>
  );
};

export default App;