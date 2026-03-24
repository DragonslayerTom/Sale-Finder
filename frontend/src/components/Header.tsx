import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass border-x-0 border-t-0 border-b border-white/5 bg-black/50 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Sale<span className="text-blue-500">Finder</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/search?q=trending" className="hover:text-blue-400 transition-colors">Trending</Link>
          <Link to="/watchlist" className="hover:text-blue-400 transition-colors">Watchlist</Link>
          <button 
             onClick={() => navigate('/watchlist')}
             className="px-5 py-2 glass rounded-full hover:bg-white/10 transition-all text-white border-white/10"
          >
            Sign In
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
