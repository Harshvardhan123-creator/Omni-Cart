import React from 'react';

interface CompetitorPlatform {
    price: number;
    url: string;
}

interface CompetitorData {
    amazon?: CompetitorPlatform;
    flipkart?: CompetitorPlatform;
    myntra?: CompetitorPlatform;
    croma?: CompetitorPlatform;
}

interface PriceComparisonWidgetProps {
    omniCartPrice: number;
    competitorData?: CompetitorData;
}

const PriceComparisonWidget: React.FC<PriceComparisonWidgetProps> = ({ omniCartPrice, competitorData }) => {
    
    // Safety guard if missing mapping data
    if (!competitorData) {
        return null;
    }

    // Build array to easily map DOM structures programmatically
    const platforms = [
        { name: 'OmniCart Official', price: omniCartPrice, url: '#', isSelf: true, logo: 'shopping_bag' },
        ...(competitorData.amazon ? [{ name: 'Amazon India', price: competitorData.amazon.price, url: competitorData.amazon.url, isSelf: false, logo: 'local_shipping' }] : []),
        ...(competitorData.flipkart ? [{ name: 'Flipkart', price: competitorData.flipkart.price, url: competitorData.flipkart.url, isSelf: false, logo: 'shopping_cart' }] : []),
        ...(competitorData.myntra ? [{ name: 'Myntra', price: competitorData.myntra.price, url: competitorData.myntra.url, isSelf: false, logo: 'checkroom' }] : []),
        ...(competitorData.croma ? [{ name: 'Croma', price: competitorData.croma.price, url: competitorData.croma.url, isSelf: false, logo: 'devices' }] : [])
    ];

    // Find Math Absolute Min using standard JS reducer abstraction
    const lowestObject = platforms.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));

    return (
        <div className="w-full mt-10 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-gray-100">
                <span className="material-icons-round text-primary tracking-tighter">verified</span>
                Live Price Matrix
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {platforms.map(platform => {
                    const isWinner = platform.name === lowestObject.name;
                    return (
                        <a 
                            key={platform.name}
                            href={platform.url} 
                            target={platform.isSelf ? "_self" : "_blank"}
                            rel={platform.isSelf ? "" : "noopener noreferrer"}
                            className={`flex flex-col justify-between p-5 rounded-xl border-2 transition-all relative ${
                                isWinner 
                                ? 'bg-emerald-50 border-emerald-500 shadow-md dark:bg-emerald-900/10 dark:border-emerald-500 hover:shadow-lg scale-105 z-10 block cursor-pointer' 
                                : 'bg-gray-50 border-transparent hover:border-gray-300 dark:bg-gray-800/50 hover:dark:border-gray-600 block cursor-pointer'
                            }`}
                        >
                            {/* Absolute position badge for the math winner! */}
                            {isWinner && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                    Best Price
                                </span>
                            )}
                            
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`material-icons-round text-sm ${isWinner ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    {platform.logo}
                                </span>
                                <span className={`text-sm font-bold ${isWinner ? 'text-emerald-800 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {platform.name}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className={`text-2xl font-black ${isWinner ? 'text-emerald-600' : 'text-gray-900 dark:text-white'}`}>
                                    ₹{platform.price.toLocaleString('en-IN')}
                                </span>
                                {!platform.isSelf && (
                                    <span className="text-xs text-blue-500 hover:text-blue-700 font-semibold mt-2 flex items-center group-hover:underline">
                                        View Deal <span className="material-icons-round text-[10px] ml-1">open_in_new</span>
                                    </span>
                                )}
                                {platform.isSelf && !isWinner && (
                                     <span className="text-xs text-orange-500 font-semibold mt-2 bg-orange-50 px-2 py-1 rounded inline-block w-max">
                                        Price Match Pending
                                    </span>
                                )}
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
    );
};

export default PriceComparisonWidget;
