import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const subCategory = searchParams.get('subCategory') || '';
    const { addToCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (query) params.search = query;
                if (category) params.category = category;
                if (subCategory) params.subCategory = subCategory;
                
                const fetchedProducts = await api.getProducts(
                    Object.keys(params).length > 0 ? params : {}
                );
                setProducts(fetchedProducts);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, category, subCategory]);

    // Handle adding a generic product
    const handleAddToCart = (product: any) => {
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.price + 20, // Mock original price
            vendor: product.brand || 'OmniCart Official',
            image: product.image,
            shippingMethod: 'Free Shipping',
            shippingCost: 0
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <nav aria-label="Breadcrumb" className="flex text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <ol className="flex items-center space-x-2">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><span className="text-gray-300">/</span></li>
                            <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                            {category && (
                                <>
                                    <li><span className="text-gray-300">/</span></li>
                                    <li>
                                        <Link to={`/search?category=${encodeURIComponent(category)}`} className="hover:text-primary transition-colors">
                                            {category}
                                        </Link>
                                    </li>
                                </>
                            )}
                            {subCategory && (
                                <>
                                    <li><span className="text-gray-300">/</span></li>
                                    <li aria-current="page" className="font-medium text-slate-900 dark:text-white">{subCategory}</li>
                                </>
                            )}
                            {!category && !subCategory && query && (
                                <>
                                    <li><span className="text-gray-300">/</span></li>
                                    <li aria-current="page" className="font-medium text-slate-900 dark:text-white capitalize">{query}</li>
                                </>
                            )}
                        </ol>
                    </nav>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {subCategory ? subCategory : category ? category : query ? `Results for "${query}"` : 'All Products'}
                    </h1>
                    {!loading && <p className="text-sm text-gray-600 dark:text-gray-400">Showing {products.length} results{query && subCategory ? ` for "${query}"` : ''}</p>}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1">
                {/* Main Content Area */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((skel) => (
                                <div key={skel} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 animate-pulse h-96 flex flex-col">
                                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-auto"></div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full mt-4"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-12 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                            <h2 className="text-xl font-bold">{error}</h2>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <span className="material-icons-round text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No products found</h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">We couldn't find anything matching "{query}". Try checking your spelling or searching for a broader term.</p>
                            <Link to="/" className="mt-6 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                                Browse All Categories
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product._id} className="group bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                                    <div className="absolute top-3 right-3 z-10">
                                        {/* Show Stock Badge */}
                                        {product.stock < 15 && product.stock > 0 ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-orange-100 text-orange-800">Only {product.stock} left</span>
                                        ) : product.stock === 0 ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-800">Out of Stock</span>
                                        ) : null}
                                    </div>
                                    <Link to={`/product/${product._id}`} className="block relative aspect-square w-full h-full overflow-hidden bg-white flex items-center justify-center rounded-t-xl">
                                        
                                        {/* Competitor Price Badge Component */}
                                        {(() => {
                                            if (!product.competitorData) return null;
                                            const platforms = [
                                                { name: 'Amazon', data: product.competitorData.amazon, bg: 'bg-[#FF9900]', text: 'text-black' },
                                                { name: 'Flipkart', data: product.competitorData.flipkart, bg: 'bg-[#2874F0]', text: 'text-white' },
                                                { name: 'Myntra', data: product.competitorData.myntra, bg: 'bg-[#FF3E6C]', text: 'text-white' },
                                                { name: 'Croma', data: product.competitorData.croma, bg: 'bg-[#00E5FF]', text: 'text-black' }
                                            ].filter(p => p.data && p.data.price);
                                            
                                            // Find the winner organically to show its tag if it beats omnicart or is the leading marketplace
                                            if (platforms.length > 0) {
                                                const lead = platforms.reduce((prev, curr) => (prev.data.price < curr.data.price ? prev : curr));
                                                return (
                                                    <div className={`absolute bottom-0 left-0 px-2 py-1 flex items-center gap-1 ${lead.bg} ${lead.text} text-[10px] font-bold rounded-tr-lg z-10 shadow-sm opacity-90 backdrop-blur-sm`}>
                                                        <span>{lead.name} Match</span>
                                                    </div>
                                                );
                                            }
                                        })()}

                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="object-contain h-full w-full p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://placehold.co/500x500/ffffff/d1d5db?text=Image+Not+Found';
                                            }}
                                        />
                                    </Link>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="mb-2">
                                            {/* Ratings */}
                                            <div className="flex items-center gap-1 text-yellow-500 mb-1">
                                                <span className="material-icons-round text-[16px]">star</span>
                                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">{product.rating}</span>
                                                <span className="text-xs text-gray-400">({product.reviews})</span>
                                            </div>
                                            <Link to={`/product/${product._id}`}>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2" title={product.name}>
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{product.category} • {product.brand}</p>
                                        </div>

                                        {/* Custom Variations/Options Banner Component */}
                                        {(product.colors?.length > 0 || product.sizes?.length > 0) && (
                                            <div className="mt-2 text-xs flex gap-2">
                                                {product.colors?.length > 0 && (
                                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 font-medium">
                                                        {product.colors.length} Colors
                                                    </span>
                                                )}
                                                {product.sizes?.length > 0 && (
                                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 font-medium">
                                                        {product.sizes.length} Sizes
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex items-end gap-2 mb-4">
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="grid grid-cols-[auto_1fr] gap-2">
                                                <Link to={`/product/${product._id}`} className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                                                    <span className="material-icons-round">visibility</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={product.stock === 0}
                                                    className={`flex items-center justify-center h-12 px-4 rounded-lg font-medium shadow-sm transition-all ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-slate-blue hover:bg-slate-800 text-white hover:shadow-md'}`}
                                                >
                                                    {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;