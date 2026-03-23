import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface WatchlistItem {
  id: string
  productName: string
  targetPrice: number
  currentPrice?: number
  bestRetailer?: string
  addedAt: string
  notified: boolean
}

export default function Watchlist() {
  const navigate = useNavigate()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({
    productName: '',
    targetPrice: 0
  })

  // Load watchlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dealWatchlist')
    if (stored) {
      setWatchlist(JSON.parse(stored))
    }
  }, [])

  // Save watchlist to localStorage
  const saveWatchlist = (items: WatchlistItem[]) => {
    localStorage.setItem('dealWatchlist', JSON.stringify(items))
    setWatchlist(items)
  }

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.productName.trim() || newItem.targetPrice <= 0) return

    const item: WatchlistItem = {
      id: Date.now().toString(),
      productName: newItem.productName,
      targetPrice: newItem.targetPrice,
      addedAt: new Date().toISOString(),
      notified: false
    }

    saveWatchlist([...watchlist, item])
    setNewItem({ productName: '', targetPrice: 0 })
    setShowAddForm(false)
  }

  const removeItem = (id: string) => {
    saveWatchlist(watchlist.filter(item => item.id !== id))
  }

  const searchProduct = (productName: string) => {
    navigate(`/search?q=${encodeURIComponent(productName)}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">⭐ Your Watchlist</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {showAddForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={addItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={newItem.productName}
                onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                placeholder="e.g., MacBook Pro 16"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Price ($)</label>
              <input
                type="number"
                value={newItem.targetPrice || ''}
                onChange={(e) => setNewItem({ ...newItem, targetPrice: parseFloat(e.target.value) || 0 })}
                placeholder="Max price you'll pay"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add to Watchlist
            </button>
          </form>
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">No items on your watchlist yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {watchlist.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{item.productName}</h2>
                  <p className="text-gray-600 text-sm">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Target Price</p>
                  <p className="text-2xl font-bold text-blue-600">${item.targetPrice.toFixed(2)}</p>
                </div>
                {item.currentPrice && (
                  <div>
                    <p className="text-gray-600 text-sm">Current Best</p>
                    <p className={`text-2xl font-bold ${item.currentPrice <= item.targetPrice ? 'text-green-600' : 'text-orange-600'}`}>
                      ${item.currentPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.bestRetailer}</p>
                  </div>
                )}
                {item.notified && (
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-lg font-bold text-green-600">✓ Price Alert Sent!</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => searchProduct(item.productName)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Check Current Prices
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="font-bold mb-2">💡 How to Use</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Add products you want to buy with your target price</li>
          <li>• Use "Check Current Prices" to search for the product</li>
          <li>• When a retailer's price drops below your target, you'll see a green alert</li>
          <li>• Remove items once you've purchased them</li>
        </ul>
      </div>
    </div>
  )
}
