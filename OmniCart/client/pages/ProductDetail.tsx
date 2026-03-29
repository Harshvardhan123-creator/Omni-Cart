import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api';
import PriceComparisonWidget from '../components/PriceComparisonWidget';

interface ProductOptionValue {
  value: string;
  priceModifier: number;
}

interface ProductOption {
  name: string;
  values: ProductOptionValue[];
}

interface CompetitorData {
  amazon?: { price: number; url: string };
  flipkart?: { price: number; url: string };
  myntra?: { price: number; url: string };
  croma?: { price: number; url: string };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  brand: string;
  description: string;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  stock: number;
  options?: ProductOption[];
  competitorData?: CompetitorData;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track heart icon
  const [isFavorite, setIsFavorite] = useState(false);

  // Track selected variants dynamically based on what the DB gives us
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("No product ID provided");
        const data = await api.getProduct(id) as Product;
        setProduct(data);

        // Auto-select the first available options for convenience
        const initialSelections: Record<string, string> = {};
        if (data.options && data.options.length > 0) {
          data.options.forEach((opt: ProductOption) => {
            if (opt.values && opt.values.length > 0) {
              initialSelections[opt.name] = opt.values[0].value;
            }
          });
        }
        setSelectedOptions(initialSelections);
      } catch (err: any) {
        setError(err.message || 'Error fetching product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product._id,
      name: product.name,
      price: currentPrice,
      vendor: product.brand || 'OmniCart Official',
      image: product.image,
      selectedOptions: selectedOptions, // Crucial payload addition
      shippingMethod: 'Standard Shipping',
      shippingCost: 0,
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
        <div className="lg:grid lg:grid-cols-2 gap-12">
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded mt-8"></div>
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h2>
        <p className="text-gray-500">{error}</p>
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  // Check if all options are selected
  const allOptionsSelected = product.options ? product.options.every((opt: ProductOption) => selectedOptions[opt.name]) : true;
  const isOutOfStock = product.stock === 0;

  // Calculate dynamic price
  const calculateCurrentPrice = () => {
    if (!product) return 0;
    let totalModifier = 0;
    if (product.options) {
      product.options.forEach(opt => {
        const selectedValue = selectedOptions[opt.name];
        const optionValue = opt.values.find(v => v.value === selectedValue);
        if (optionValue) {
          totalModifier += optionValue.priceModifier;
        }
      });
    }
    return product.price + totalModifier;
  };

  const currentPrice = calculateCurrentPrice();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in zoom-in duration-300">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex mb-6 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center space-x-2">
          <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
          <li><span className="material-icons-round text-xs">chevron_right</span></li>
          <li><Link to={`/search?q=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors capitalize">{product.category.replaceAll('&', 'and')}</Link></li>
          <li><span className="material-icons-round text-xs">chevron_right</span></li>
          <li aria-current="page" className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative w-full aspect-square md:aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/800x800/ffffff/d1d5db?text=Image+Not+Found';
              }}
            />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`absolute top-4 right-4 p-3 rounded-full bg-white/90 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-all shadow-sm ${isFavorite ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-500'}`}
            >
              <span className="material-icons-round">{isFavorite ? 'favorite' : 'favorite_border'}</span>
            </button>
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow">
                OUT OF STOCK
              </div>
            )}
          </div>

          {/* New Image Gallery Thumbnails */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setProduct(prev => prev ? { ...prev, image: img } : null)}
                  className={`w-20 h-20 rounded-lg flex-shrink-0 border-2 overflow-hidden bg-white p-2 transition-all ${product.image === img ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt={`View ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Configuration */}
        <div className="lg:col-span-5 mt-10 lg:mt-0 flex flex-col h-full">
          <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-primary tracking-wide uppercase bg-primary/10 px-2.5 py-1 rounded">{product.brand}</span>
              <div className="flex items-center text-yellow-400">
                <span className="material-icons-round text-sm">star</span>
                <strong className="text-gray-900 dark:text-white text-sm ml-1 mr-2">{product.rating}</strong>
                <span className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer underline">({product.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">{product.name}</h1>
            <div className="flex flex-col mb-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₹{currentPrice.toLocaleString('en-IN')}</span>
                <div className="flex flex-col">
                  <span className="text-gray-400 line-through text-sm">₹{Math.floor(currentPrice * 1.25).toLocaleString('en-IN')}</span>
                  <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Save 20%</span>
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium">Inclusive of all local taxes</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
              <span className="material-icons-round text-base">local_shipping</span> Free express delivery available
            </p>
          </div>

          {/* Dynamic Options Mapped from DB */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
              {product.options.map((opt: ProductOption) => (
                <div key={opt.name}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{opt.name}</h3>
                    {selectedOptions[opt.name] && <span className="text-sm text-gray-500 font-medium">{selectedOptions[opt.name]}</span>}
                  </div>

                  {/* Color Swatch Logic vs Standard Pill Logic */}
                  {opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'shade' ? (
                    <div className="flex flex-wrap gap-3">
                      {opt.values.map((v) => {
                        const val = v.value;
                        const isSelected = selectedOptions[opt.name] === val;
                        // Simple CSS trick to use standard faker colors directly
                        const cssColor = val.replace(/\s+/g, '').toLowerCase();
                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionSelect(opt.name, val)}
                            className={`relative w-12 h-12 rounded-full border-2 focus:outline-none transition-all shadow-sm flex items-center justify-center 
                                                    ${isSelected ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-gray-200 dark:border-gray-700 hover:scale-105'}`}
                            style={{ backgroundColor: cssColor }}
                            title={val}
                          >
                            {/* If it's pure white, add a borderline inside */}
                            {(cssColor === 'white' || cssColor === '#fff' || cssColor === '#ffffff') && (
                              <span className="absolute inset-0 border border-black/10 rounded-full"></span>
                            )}
                            {isSelected && <span className="material-icons-round text-white drop-shadow-md text-sm mix-blend-difference">check</span>}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((v) => {
                        const val = v.value;
                        const isSelected = selectedOptions[opt.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionSelect(opt.name, val)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all flex items-center justify-center
                                                    ${isSelected
                                ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-md'
                                : 'bg-white border-gray-200 text-slate-700 hover:border-slate-400 dark:bg-gray-800 dark:border-gray-700 dark:text-slate-300 dark:hover:border-slate-500'}`}
                          >
                            {val}
                            {v.priceModifier > 0 && <span className="ml-2 text-[10px] opacity-70">+₹{v.priceModifier.toLocaleString('en-IN')}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Product Description */}
          <div className="prose dark:prose-invert max-w-none mb-8 text-gray-600 dark:text-gray-300 text-sm">
            <p className="leading-relaxed">{product.description}</p>
            <ul className="mt-4 space-y-2 text-gray-500">
              <li>✓ 100% Genuine product guaranteed</li>
              <li>✓ 30-Day returns included</li>
              <li>✓ Fulfilled from verified sellers</li>
            </ul>
          </div>

          {/* Action Bar */}
          <div className="mt-auto space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || !allOptionsSelected}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg
                        ${isOutOfStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                  : !allOptionsSelected
                    ? 'bg-primary/50 text-white cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white hover:shadow-xl hover:-translate-y-0.5'}`}
            >
              {isOutOfStock ? 'Sold Out' : !allOptionsSelected ? 'Select Attributes to Buy' : 'Add to Cart — ' + '₹' + currentPrice.toLocaleString('en-IN')}
              {!isOutOfStock && allOptionsSelected && <span className="material-icons-round">shopping_cart</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Full Width Matrix Display below the primary float block */}
      <div className="mt-12 col-span-12 w-full">
        <PriceComparisonWidget omniCartPrice={currentPrice} competitorData={product.competitorData} />
      </div>

    </div>
  );
};

export default ProductDetail;