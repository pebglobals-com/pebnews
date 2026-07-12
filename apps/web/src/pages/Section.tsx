import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import ArticleCard from '../components/ArticleCard'

export default function Section() {
  const { slug } = useParams<{ slug: string }>()
  const [articles, setArticles] = useState<any[]>([])
  const [section, setSection] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    Promise.all([
      api.articles.bySection(slug, 50),
      api.sections.get(slug),
    ]).then(([articleData, sectionData]) => {
      setArticles(articleData.articles)
      setSection(sectionData.section)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-surface-200" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-surface-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!section) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-surface-500">Section not found.</p>
        <Link to="/" className="text-primary-600 hover:underline">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: section.color_hex }}>
          {section.name}
        </h1>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: any) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              sectionName={section.name}
              sectionSlug={section.slug}
              sectionColor={section.color_hex}
              featuredImageUrl={article.featured_image_url}
              publishedAt={article.published_at}
              viewCount={article.view_count ?? 0}
              authorName={article.author_name}
            />
          ))}
        </div>
      ) : (
        <p className="text-surface-500">No published articles in this section yet.</p>
      )}
    </div>
  )
}
