import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Phase 1: Category data aligned with the actual seeded database
const categoriesData = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'devices',
    groups: [
      { title: 'Smartphones', items: ['OnePlus Smartphones', 'Samsung Galaxy', 'Apple iPhone', 'Asus ROG Phone'] },
      { title: 'Audio', items: ['boAt Rockerz', 'boAt Airdopes', 'Apple AirPods', 'Samsung Buds'] },
      { title: 'Laptops', items: ['MacBook Air', 'Asus VivoBook', 'Asus ZenBook', 'Samsung Galaxy Book', 'Asus TUF Gaming'] }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: 'checkroom',
    groups: [
      { title: 'Sneakers', items: ['Nike Air Max', 'Puma Smash', 'Nike Air Force', 'Puma RS-X'] },
      { title: 'Activewear', items: ['Nike Drifit', 'HRX Training', 'Puma Tech Fleece', 'Nike Running Shorts'] },
      { title: 'Casuals', items: ["Levi's Jeans", 'Peter England Shirt', 'Puma Denim Jacket', 'HRX T-Shirt'] }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive & Accessories',
    icon: 'two_wheeler',
    groups: [
      { title: 'Riding Gear', items: ['Royal Enfield Jacket', 'Riding Gloves', 'Riding Boots', 'Knee Guards'] },
      { title: 'Helmets', items: ['Steelbird SBA-1', 'Vega Cruiser', 'MT Targo', 'Steelbird Bolt'] },
      { title: 'Bike Accessories', items: ['Touring Mirror Kit', 'Mobile Holder', 'Paddock Stand', 'LED Fog Lamps'] }
    ]
  }
];

const Categories: React.FC = () => {
  // Phase 2: State Management
  const [activeCategoryId, setActiveCategoryId] = useState(categoriesData[0].id);
  const activeCategory = categoriesData.find(c => c.id === activeCategoryId) || categoriesData[0];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        {/* Header Section */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-8 pt-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Explore All Categories</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">Browse our extensive directory of products across the marketplace.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row gap-10">
                
                {/* Sidebar (Left Column) */}
                <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-28 self-start overflow-y-auto lg:pr-4">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 hidden lg:block">Jump To</h2>
                    <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                        {categoriesData.map((category) => {
                            const isActive = category.id === activeCategoryId;
                            return (
                                <li key={category.id} className="min-w-max lg:min-w-0">
                                    <button
                                        onClick={() => setActiveCategoryId(category.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 lg:px-3 lg:py-2.5 text-sm transition-colors cursor-pointer
                                            ${isActive 
                                                ? 'font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 dark:bg-primary/20 dark:text-blue-400' 
                                                : 'font-medium text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary rounded-lg'
                                            }
                                        `}
                                    >
                                        <span className="material-icons-round text-lg">{category.icon}</span>
                                        {category.name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                {/* Main Content (Right Column) */}
                <div className="flex-grow animate-in fade-in duration-300">
                    <div className="mb-12">
                        {/* Dynamic Category Header */}
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary dark:text-blue-400 shadow-sm border border-primary/20">
                                <span className="material-icons-round text-3xl">{activeCategory.icon}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{activeCategory.name}</h2>
                        </div>
                        
                        {/* Dynamic Category Groups Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                            {activeCategory.groups.map((group, index) => (
                                <div key={index} className="flex flex-col">
                                    <Link 
                                        to={`/search?category=${encodeURIComponent(activeCategory.name)}&subCategory=${encodeURIComponent(group.title)}`}
                                        className="font-semibold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2 hover:text-primary transition-colors"
                                    >
                                        {group.title}
                                        <span className="material-icons-round text-sm text-gray-300 group-hover:text-primary">arrow_forward</span>
                                    </Link>
                                    <ul className="space-y-3">
                                        {group.items.map((item, itemIdx) => (
                                            <li key={itemIdx}>
                                                <Link 
                                                    to={`/search?q=${encodeURIComponent(item)}&category=${encodeURIComponent(activeCategory.name)}&subCategory=${encodeURIComponent(group.title)}`}
                                                    className="flex items-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 hover:translate-x-1 transition-all group"
                                                >
                                                    <span className="material-icons-round text-[14px] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary dark:text-blue-400">chevron_right</span>
                                                    <span>{item}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        
                        {/* Discover All button for the category */}
                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                            <Link 
                                to={`/search?category=${encodeURIComponent(activeCategory.name)}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary/30 transition-all shadow-sm group"
                            >
                                Shop all {activeCategory.name}
                                <span className="material-icons-round text-sm text-gray-400 group-hover:text-primary transition-colors">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default Categories;