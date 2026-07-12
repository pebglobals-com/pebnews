import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Eye, Calendar, User } from 'lucide-react'

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<any | null>(null)
  const [viewCount, setViewCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    api.articles.get(slug).then((data) => {
      setArticle(data.article)
      setLoading(false)
      // Record view
      api.views.record(data.article.id).catch(() => {})
      // Get view count
      api.views.count(data.article.id).then((c) => setViewCount(c.count)).catch(() => {})
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-24 rounded bg-surface-200" />
          <div className="h-10 w-full rounded bg-surface-200" />
          <div className="h-64 rounded-xl bg-surface-200" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-full rounded bg-surface-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-surface-500">Article not found.</p>
        <Link to="/" className="text-primary-600 hover:underline">Back to Home</Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/section/${article.section_slug}`}
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: article.section_color_hex }}
      >
        {article.section_name}
      </Link>

      <h1 className="mt-4 text-3xl font-bold leading-tight text-surface-900 sm:text-4xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-surface-500">
        {article.author_name && (
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {article.author_name}
          </span>
        )}
        {article.published_at && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(article.published_at).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          {viewCount} views
        </span>
      </div>

      {article.featured_image_url && (
        <div className="mt-6 overflow-hidden rounded-xl">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="mt-8 max-w-text">
        <p className="text-lg leading-relaxed text-surface-700 font-serif">
          {article.excerpt}
        </p>
        <hr className="my-6 border-surface-200" />
        <div
          className="prose prose-surface max-w-none font-serif leading-relaxed text-surface-800"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </div>
    </article>
  )
}
