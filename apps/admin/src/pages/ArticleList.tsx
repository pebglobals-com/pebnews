import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi } from '../lib/api'
import { Plus, FileText, ArrowLeft } from 'lucide-react'

export default function ArticleList() {
  const [articles, setArticles] = useState<any[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    adminApi.articles.my(filter !== 'all' ? filter : undefined)
      .then((data) => {
        setArticles(data.articles)
        setLoading(false)
      }).catch(() => setLoading(false))
  }, [filter])

  const statusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700'
      case 'scheduled': return 'bg-blue-100 text-blue-700'
      default: return 'bg-amber-100 text-amber-700'
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/editor/dashboard')} className="btn-secondary text-sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard
          </button>
          <h1 className="text-2xl font-bold text-surface-900">All Articles</h1>
        </div>
        <Link to="/editor/articles/new" className="btn-primary text-sm">
          <Plus className="mr-1.5 h-4 w-4" /> New Article
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'draft', 'scheduled', 'published'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-surface-600 border border-surface-300 hover:bg-surface-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-surface-200" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-surface-300" />
          <p className="mt-4 text-surface-500">No articles found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/editor/articles/${article.id}/edit`}
              className="card flex items-center justify-between hover:border-primary-300 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-surface-900">{article.title}</h3>
                <p className="mt-0.5 text-xs text-surface-400">
                  {new Date(article.updated_at || article.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(article.status)}`}>
                {article.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
