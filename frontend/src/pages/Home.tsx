import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative isolate overflow-hidden min-h-[90vh] flex flex-col items-center justify-center px-6">
      {/* Background glow */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00acee] to-[#9b51e0] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 mt-16">
          Find the best deals, <br/>
          <span className="text-gradient">AI-Powered.</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Aggregating prices from 50+ retailers using neural search. 
          Stop overpaying and start discover the absolute lowest prices instantly.
        </p>

        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
          <div className="flex glass rounded-full p-2 transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-blue-500/50 group-focus-within:bg-white/10">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for today?"
              className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-3 text-lg text-white placeholder-slate-500"
            />
            <button
              type="submit"
              className="btn-primary"
            >
              Search
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 opacity-60 hover:opacity-100 transition-opacity">
          {['Amazon', 'eBay', 'Best Buy', 'Walmart', 'Target', 'Newegg'].map((brand) => (
            <div key={brand} className="glass py-3 px-6 rounded-xl text-sm font-medium text-slate-400 border-white/5">
              {brand}
            </div>
          ))}
          <div className="glass py-3 px-6 rounded-xl text-sm font-medium text-blue-400 border-blue-500/20 col-span-2 md:col-span-1">
            + 44 More
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
