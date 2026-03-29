import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { element: '#search-bar-tour', popover: { title: 'Search Everywhere', description: 'Search across 50+ stores instantly from one place.' } },
        { element: '#cart-tour', popover: { title: 'Universal Cart', description: 'Items from different stores stack up here in your unified cart.' } },
        { element: '#profile-tour', popover: { title: 'One Account', description: 'Manage your profile and orders across all retailers.' } },
      ]
    });
    driverObj.drive();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-6 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Now supporting 50+ major retailers
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                One Cart. <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-200 dark:to-slate-400">Every Store.</span> <br className="hidden lg:block" />
                <span className="text-primary">Best Prices.</span>
              </h1>
              <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Stop switching tabs. OmniCart aggregates Amazon India, Flipkart, Myntra, Croma and more into a single, seamless checkout experience. Save time and money automatically.
              </p>

              {/* Search Component */}
              <div className="mt-10 max-w-xl mx-auto lg:mx-0 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-dark rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <form onSubmit={handleSearch} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl flex items-center p-2 border border-slate-200 dark:border-slate-700">
                  <span className="material-icons text-slate-400 ml-3">search</span>
                  <input
                    className="w-full border-0 bg-transparent focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 h-12"
                    placeholder="Search for 'AirPods Pro' or 'Running Shoes'..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 flex-shrink-0">
                    Search
                  </button>
                </form>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 pl-2">
                  Try searching for: <Link to="/search?q=boAt" className="text-primary cursor-pointer hover:underline">boAt Rockerz</Link>, <Link to="/search?q=MacBook" className="text-primary cursor-pointer hover:underline">MacBook Air</Link>
                </p>
              </div>

              {/* Trust Signals */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Trusted Integration Partners</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 text-xl">
                    <span className="material-icons">local_shipping</span> Amazon India
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 text-xl">
                    <span className="material-icons">shopping_cart</span> Flipkart
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 text-xl">
                    <span className="material-icons">checkroom</span> Myntra
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 text-xl">
                    <span className="material-icons">devices</span> Croma
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="lg:col-span-5 relative mt-12 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium uppercase">My Cart</span>
                    <span className="font-bold text-slate-900 dark:text-white">3 Items from 3 Stores</span>
                  </div>
                  <span className="text-primary font-bold">₹42,900</span>
                </div>
                {/* Product 1 */}
                <Link to="/product/1" className="flex items-center gap-4 mb-4 p-3 hover:bg-background-light dark:hover:bg-background-dark/50 rounded-lg transition-colors group cursor-pointer">
                  <div className="w-16 h-16 rounded bg-slate-100 dark:bg-slate-800 flex-shrink-0 relative overflow-hidden">
                    <img alt="Headphones" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP9HIXZ6S7-3af3WG9rvZQ9FVAxFHrFvM8E63ehopn1nBIo7A3-MSyNu1fScuYyTMPOhPI70wHXA0Vl0ffaK4KVFqivzh0K7VWkNjQYxzOiU5-f6SuhwaFjZuSfmIgBu6bsqebyUSSr_cUYfPv9Ub9sp8rvo91k31IZS115IFqzuoQ-RJHQxCvFfstvvpPcuCvVKno3Nijq0zNNs1bJsqdGPpD_gp1pmrYiPzXhOp2k2jemqnSSZ5Zvk6uy7VShtlLiPSuHjrUr4w" />
                    <div className="absolute bottom-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-1">Amazon</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Premium ANC Headphones</h4>
                    <p className="text-xs text-slate-500">Black • Wireless</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">₹29,900</span>
                    <span className="text-[10px] text-green-600 font-medium">Best Price</span>
                  </div>
                </Link>
                {/* Product 2 */}
                <div className="flex items-center gap-4 mb-4 p-3 hover:bg-background-light dark:hover:bg-background-dark/50 rounded-lg transition-colors group cursor-pointer">
                  <div className="w-16 h-16 rounded bg-slate-100 dark:bg-slate-800 flex-shrink-0 relative overflow-hidden">
                    <img alt="Shoes" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABHasCsj4G0pMrcIBvKUQaiqGsynbXtsvHmj0jA7AA2RA7JrtJuO6__zeThc24RwR6YvRbOpslwa75XcGOozm2MhTOVrS_-uZBowVggd5frfgpZnC-OTjKNs2EFPLUEZzOdv5JWyeB4Kg-8bOZ5lQ_YkTS6N9EgN0sDlV8kmf169K7Y3JOtAi2WLxH0z-17saHL_UzUksYH8Ao5L1mvyGsBCUGU-77atAxmG8rwqDMZ7yaQdqaZJlTXOh9iKL2A0pC1w_PQq1uWZc" />
                    <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-1">Walmart</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Speedster Running Shoes</h4>
                    <p className="text-xs text-slate-500">Size 10 • Red</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">₹8,900</span>
                    <span className="text-[10px] text-slate-400 line-through">₹11,000</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link to="/cart" className="w-full bg-primary h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary/25 cursor-pointer hover:bg-primary-dark transition-colors">
                    Checkout All Items
                  </Link>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -right-4 top-10 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <span className="material-icons text-xl">savings</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Savings</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹3,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Popular Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trending Categories</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">What others are bundling today</p>
            </div>
            <Link to="/categories" className="text-primary font-medium hover:underline flex items-center gap-1">
              View all <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category Card 1 */}
            <Link to="/categories#tech" className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all">
              <img alt="Electronics" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6j5o2sve71M90PmVizu_7QGDyrdEu-bemmhQpmHzg9QR_4IGX9MIiaI0xz9ioxNuUuBH0bmubsF7qA6xcb6ay0vmbMNjKpSQpICQsDYlLQMAz7TfWFgJmUqOjMJSe-9YHPaobNqwr53eS2yDNdY0E_WwMlikU1bfoAKaJ-Zvzm9RRF6ZoKxdvAgLoBKZQscJ9d9BdbHs3SQz3-H4DFSQUOQWYrcJsMpGK6uDvosVx1t09gww5KBfjHoStq1vZS91NbwKqlgFPj0s" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-lg">Electronics</span>
                <span className="text-white/70 text-sm">240k+ Products</span>
              </div>
            </Link>
            {/* Category Card 2 */}
            <Link to="/categories#fashion" className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all">
              <img alt="Sneakers" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2WvyO1DPXyu6pYGyJWK2axDRhb7F1FbUw2Q1M6xk1Dlgtk0tG6ScAmmZSxQhyMzO6emkWLkWAKPVUC09ld9vABFWwD2mJxW37Pc-RFkkETNVYsAKqq_u-SWzPCeqybqRqQxEDEit6nusj_ZwXhyb5immVwU6s-JMVxkIsOlsc2XfH1-GZexxlKHgU7DNNuj2X1tMnBsyq6zcuhfDIXpCT60ZVN0dnZHkBB6aEg4kilHGF5wv48mvBsEE35cgyfXi6zVba7BfbR_4" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-lg">Sneakers</span>
                <span className="text-white/70 text-sm">12k+ Products</span>
              </div>
            </Link>
            {/* Category Card 3 */}
            <Link to="/categories#home" className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all">
              <img alt="Home" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-XqJQ8PQOG7u6rvw0HYmPO92AIkG3PWVKebLxYddoMVo3ANXboVMjuhpVAQb5mskMSfGDgSTJXaZZqww-f2uYhrV1pz7AXyMyM5ebX2K4nW07jv4ZWzhZV-llfcV4OmYoEcFUvzmQZHIzwLR4cjkCnMPLmSlL2dDiZFlv9zj1Gkvppa0joRCgVeVGZtvZn6ZZYt-ACvjPxYVAx8WWjJ7pdlcFJbJbRYJiVBD_l69t6M1JQP0o36g4HSArBsYkH2FFbIt3it4yNUk" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-lg">Home & Decor</span>
                <span className="text-white/70 text-sm">45k+ Products</span>
              </div>
            </Link>
            {/* Category Card 4 */}
            <Link to="/categories#sports" className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all">
              <img alt="Sports" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVbzU9XD34dgxf82Uwh_EYkNJaCFzARn51Iplgv7C7HkxgPGjlgse4g3S1a_vd8Uk985atRaNwFiCzS_J4_YjJ2y-GJQq5-2ou_gFWChxdTJFz5nyH45ndYzNsD_AyQJ_w7Y06QyaJqrQ1_HHoAkDourrAR8UWg87vvT6gwMx2rM2tIdrqx-LN-UGHMrihvPF38L7b0XzMz98EsAInWKZ_bXa0eV9AWOYlWAHzgPV7icSclM019HBctsHaEnTilY60uwAfMs_aubU" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-lg">Sports & Outdoors</span>
                <span className="text-white/70 text-sm">18k+ Products</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Ready to stop overpaying?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            Join 50,000+ shoppers who are saving an average of ₹2,000/month by using OmniCart. It's free to get started.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={startTour}
              className="px-8 py-4 bg-white dark:bg-background-dark text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary text-lg font-bold rounded-lg shadow-md transition-all"
            >
              View Demo
            </button>
            {/* Removed "Get Started for Free" button as requested */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;