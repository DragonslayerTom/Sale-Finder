import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import NotFound from './pages/NotFound'
import Header from './components/Header'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}
