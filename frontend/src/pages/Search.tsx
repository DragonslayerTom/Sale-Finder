import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import PriceTable from '../components/PriceTable'

interface Product {
  id: number
  name: string
  description: string
  retailers: Array<{
    retailer: string
    price: number
    url: string
  }>
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/search', {
        params: { q: query }
      })
      setProducts(response.data)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Search failed. Please try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchParams.get('q')) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent)
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Searching for products...</p>
        </div>
      )}

      {products.length > 0 ? (
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <PriceTable retailers={product.retailers} />
            </div>
          ))}
        </div>
      ) : !loading && query && (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-gray-600">No products found for "{query}"</p>
        </div>
      )}
    </div>
  )
}
