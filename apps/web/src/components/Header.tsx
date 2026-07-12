import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, ChevronDown, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const sections = [
  { name: 'Politics', slug: 'politics' },
  { name: 'Metro', slug: 'metro' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Editorial', slug: 'editorial' },
  { name: 'Business', slug: 'business' },
  { name: 'News', slug: 'news' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Health', slug: 'health' },
  { name: 'Education', slug: 'education' },
  { name: 'Agriculture', slug: 'agriculture' },
  { name: 'Oil & Gas', slug: 'oil-and-gas' },
  { name: 'Crime', slug: 'crime' },
  { name: 'Religion', slug: 'religion' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl items-center justify-end px-4 py-1.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {token ? (
              <Link to="/profile" className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <User className="h-3 w-3" /> Account
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/signup" className="text-xs font-medium text-blue-600 hover:text-blue-800">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logo + Search */}
      <div className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/">
            <img src="/logo.png" alt="PEB News" className="h-14 w-auto sm:h-16" />
          </Link>

          <div className="flex items-center gap-4">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-48 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="text-gray-500 hover:text-gray-700">
                  <Search className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-gray-500 hover:text-gray-700">
                <Search className="h-5 w-5" />
              </button>
            )}
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden border-b border-gray-200 bg-white md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            Home
          </Link>

          {/* Categories dropdown */}
          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Categories <ChevronDown className={`h-3 w-3 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full z-50 w-48 rounded-b-lg border border-gray-200 bg-white shadow-lg">
                {sections.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/section/${s.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setCatOpen(false)}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            About
          </Link>
          <Link to="/services" className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            Services
          </Link>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-b border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link to="/" className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Home</Link>
            {sections.map((s) => (
              <Link
                key={s.slug}
                to={`/section/${s.slug}`}
                className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                {s.name}
              </Link>
            ))}
            <Link to="/about" className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>About</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
