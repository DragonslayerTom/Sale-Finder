import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          🏷️ Deal Aggregator
        </Link>
        <div className="flex gap-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/search" className="text-gray-700 hover:text-blue-600">Search</Link>
          <Link to="/watchlist" className="text-gray-700 hover:text-blue-600">⭐ Watchlist</Link>
        </div>
      </nav>
    </header>
  )
}
