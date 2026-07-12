import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi } from '../lib/api'
import { Plus, FileText, Rss, Sparkles, LogOut } from 'lucide-react'

export default function Dashboard() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    adminApi.articles.my().then((data) => {
      setArticles(data.articles)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/editor/login')
  }

  const draftCount = articles.filter((a) => a.status === 'draft').length
  const publishedCount = articles.filter((a) => a.status === 'published').length
  const scheduledCount = articles.filter((a) => a.status === 'scheduled').length

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Editor Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link to="/editor/rss-sources" className="btn-secondary text-sm">
            <Rss className="mr-1.5 h-4 w-4" />
            RSS Sources
          </Link>
          <Link to="/editor/rss/curated" className="btn-secondary text-sm">
            <Sparkles className="mr-1.5 h-4 w-4" />
            Curated Feed
          </Link>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            <LogOut className="mr-1.5 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-2xl font-bold text-surface-900">{publishedCount}</p>
          <p className="text-sm text-surface-500">Published</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-amber-600">{draftCount}</p>
          <p className="text-sm text-surface-500">Drafts</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{scheduledCount}</p>
          <p className="text-sm text-surface-500">Scheduled</p>
        </div>
      </div>

      {/* New Article CTA */}
      <Link
        to="/editor/articles/new"
        className="mb-8 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50 py-6 text-primary-700 hover:bg-primary-100 transition-colors"
      >
        <Plus className="h-6 w-6" />
        <span className="text-lg font-semibold">New Article</span>
      </Link>

      {/* Recent Articles */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">Your Articles</h2>
          <Link to="/editor/articles" className="text-sm text-primary-600 hover:underline">
            View all &rarr;
          </Link>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-surface-200" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-sm text-surface-400 text-center py-8">
            No articles yet. Write your first one!
          </p>
        ) : (
          <div className="space-y-2">
            {articles.slice(0, 5).map((article) => (
              <Link
                key={article.id}
                to={`/editor/articles/${article.id}/edit`}
                className="flex items-center justify-between rounded-lg border border-surface-200 p-3 hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 shrink-0 text-surface-400" />
                  <span className="truncate text-sm font-medium text-surface-900">
                    {article.title}
                  </span>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  article.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : article.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {article.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
