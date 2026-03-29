
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const count = getCartCount();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-blue dark:text-white">OmniCart</span>
          </Link>

          {/* Search (Hidden on small mobile) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative" id="search-bar-tour">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons-round text-gray-400">search</span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-all text-slate-900 dark:text-white"
              placeholder="Search across 50+ stores..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/search" className="md:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-icons-round">search</span>
            </Link>

            <Link to="/categories" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative" title="Categories">
              <span className="material-icons-round">category</span>
            </Link>

            <Link to="/cart" id="cart-tour" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <span className="material-icons-round">shopping_cart</span>
              {count > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Auth / Profile */}
            <div className="relative" ref={dropdownRef} id="profile-tour">
              {user ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden sm:block text-slate-700 dark:text-slate-200">{user.name}</span>
                </button>
              ) : (
                <Link to="/profile" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                  Login
                </Link>
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/profile', { state: { activeTab: 'orders' } });
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Your Orders
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;