import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-surface-900">PEB News</h3>
            <p className="mt-2 text-sm text-surface-500 max-w-text">
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
              <span className="text-sm text-surface-500">Privacy Policy</span>
              <span className="text-sm text-surface-500">Terms of Service</span>
              <span className="text-sm text-surface-500">Contact Us</span>
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
