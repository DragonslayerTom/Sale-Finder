import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

interface RetailerResult {
  retailer: string;
  price: number;
  url: string;
  highlights?: string;
}

interface Product {
  name: string;
  retailers: RetailerResult[];
}

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/search', {
        params: { q: searchQuery, limit: 12 }
      });
      // The API returns { products: [...] }
      setProducts(response.data.products || []);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch deals. Please check if the backend is running.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">
          {loading ? 'Searching web...' : `Results for "${query}"`}
        </h2>
        <p className="text-slate-400">
          Showing real-time prices from across the web.
        </p>
      </div>

      {error && (
        <div className="glass border-red-500/20 bg-red-500/5 text-red-400 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card h-[300px] animate-pulse">
              <div className="h-6 w-3/4 bg-white/5 rounded mb-4"></div>
              <div className="h-10 w-1/2 bg-white/5 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-white/5 rounded"></div>
                <div className="h-4 w-full bg-white/5 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          ) : !loading && query && (
            <div className="text-center py-20 glass-card">
              <p className="text-xl text-slate-400 mb-2">No deals found for "{query}"</p>
              <p className="text-sm text-slate-500">Try a more general search term.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
