import { Link } from 'react-router-dom'
import { Search, Menu, User } from 'lucide-react'
import { useState } from 'react'

const sections = [
  { name: 'Politics', slug: 'politics' },
  { name: 'Metro', slug: 'metro' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Editorial', slug: 'editorial' },
  { name: 'Business', slug: 'business' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const token = localStorage.getItem('token')

  return (
    <header className="border-b border-surface-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight text-surface-900">
            PEB News
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {sections.map((s) => (
              <Link
                key={s.slug}
                to={`/section/${s.slug}`}
                className="text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors"
              >
                {s.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {token ? (
              <Link to="/profile" className="btn-secondary text-sm">
                <User className="mr-1.5 h-4 w-4" />
                Account
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-surface-600 hover:text-surface-900">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Subscribe
                </Link>
              </>
            )}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-surface-200 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {sections.map((s) => (
                <Link
                  key={s.slug}
                  to={`/section/${s.slug}`}
                  className="text-sm font-medium text-surface-600 hover:text-surface-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
