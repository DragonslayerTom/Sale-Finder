import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Find the Best Deals 🎯
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Search and compare prices across 50+ retailers instantly
      </p>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products... (e.g., headphones, laptop)"
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">⚡</div>
          <h2 className="text-xl font-bold mb-2">Fast Comparison</h2>
          <p className="text-gray-600">Compare prices across retailers in seconds</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">📊</div>
          <h2 className="text-xl font-bold mb-2">Real-Time Prices</h2>
          <p className="text-gray-600">Always up-to-date pricing information</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">💚</div>
          <h2 className="text-xl font-bold mb-2">100% Free</h2>
          <p className="text-gray-600">No signup or hidden fees</p>
        </div>
      </div>
    </div>
  )
}
