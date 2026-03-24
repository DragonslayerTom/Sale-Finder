import React from 'react';

interface RetailerResult {
  retailer: string;
  price: number;
  url: string;
  highlights?: string;
}

interface ProductCardProps {
  product: {
    name: string;
    retailers: RetailerResult[];
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const bestPrice = Math.min(...product.retailers.map(r => r.price));
  const bestRetailer = product.retailers.find(r => r.price === bestPrice);

  return (
    <div className="glass-card group flex flex-col h-full bg-gradient-to-b from-white/[0.05] to-transparent">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-100 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          {product.retailers.length} Stores
        </span>
      </div>

      <div className="flex-grow">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-white tracking-tight">
            ${bestPrice.toFixed(2)}
          </span>
          <span className="text-slate-400 text-sm">Best price</span>
        </div>

        <div className="space-y-3 mb-6">
          {product.retailers.slice(0, 3).map((r, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                {r.retailer}
              </span>
              <span className="font-medium text-slate-200">${r.price.toFixed(2)}</span>
            </div>
          ))}
          {product.retailers.length > 3 && (
            <p className="text-xs text-slate-500 italic">+{product.retailers.length - 3} more retailers...</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <a 
          href={bestRetailer?.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary w-full text-center inline-block group-hover:scale-[1.02]"
        >
          View at {bestRetailer?.retailer}
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
