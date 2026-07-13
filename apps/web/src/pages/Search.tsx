import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function ArticleCard({ article }: { article: any }) {
  const date = new Date(article.published_at)
  const path = `/article/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${article.slug}`

  return (
    <Link
      to={path}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      {article.featured_image_url ? (
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img src={article.featured_image_url} alt="" className="h-full w-full object-cover object-[50%_20%] transition-transform duration-150 group-hover:scale-[1.03]" loading="lazy" />
        </div>
      ) : (
        <div className="aspect-[16/10] flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-300">No image</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-3">
        <span
          className="inline-flex items-center self-start rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
          style={{ backgroundColor: article.section_color_hex }}
        >
          {article.section_name}
        </span>
        <h3 className="mt-1.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2">{article.excerpt}</p>
        )}
        <div className="mt-auto pt-2 flex items-center gap-2 text-[10px] text-gray-400">
          <span>{timeAgo(article.published_at)}</span>
          {article.view_count > 0 && <span>{article.view_count} views</span>}
        </div>
      </div>
    </Link>
  )
}

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      setResults([])
      setError('')
      return
    }
    setLoading(true)
    setError('')
    api.articles.search(query).then((data) => {
      setResults(data.articles)
      setLoading(false)
    }).catch(() => {
      setError('Search failed. Try again later.')
      setLoading(false)
    })
  }, [query])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-60 rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!query) {
    return null
  }

  if (results.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Search Results</h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">No articles found for <strong>"{query}"</strong></p>
          <p className="mt-2 text-sm text-gray-500">Try adjusting your search terms or check for typos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">
        Search Results {results.length > 0 && `(${results.length})`}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}