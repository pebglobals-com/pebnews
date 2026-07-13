import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <img src="/logo.png" alt="PEB News" className="h-12 w-auto mb-2" />
            <p className="text-sm text-surface-500 max-w-text">
              Your trusted source for local and regional news, delivered with accuracy and integrity.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-900">Sections</h4>
            <div className="mt-3 flex flex-col gap-2">
              {['Politics', 'Metro', 'Sports', 'Editorial', 'Business'].map((s) => (
                <Link
                  key={s}
                  to={`/section/${s.toLowerCase()}`}
                  className="text-sm text-surface-500 hover:text-surface-900 transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-900">Legal</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="/privacy"
                className="text-sm text-surface-500 hover:text-surface-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-surface-500 hover:text-surface-900 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-sm text-surface-500 hover:text-surface-900 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-surface-200 pt-6 text-center text-sm text-surface-400">
          &copy; {new Date().getFullYear()} PEB News. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
