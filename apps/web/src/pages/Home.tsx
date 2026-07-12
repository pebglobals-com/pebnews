import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import ArticleCard from '../components/ArticleCard'

interface SectionGroup {
  slug: string
  name: string
  color_hex: string
  articles: any[]
}

export default function Home() {
  const [sections, setSections] = useState<SectionGroup[]>([])
  const [hero, setHero] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.articles.list(1),
      api.sections.list(),
    ]).then(([articles, sectionData]) => {
      if (articles.articles.length > 0) {
        setHero(articles.articles[0])
      }
      // Fetch articles per section
      Promise.all(
        sectionData.sections.map((s: any) =>
          api.articles.bySection(s.slug, 3).then((res) => ({
            slug: s.slug,
            name: s.name,
            color_hex: s.color_hex,
            articles: res.articles,
          }))
        )
      ).then(setSections)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 rounded-xl bg-surface-200" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-surface-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Article */}
      {hero && (
        <a
          href={`/article/${new Date(hero.published_at).getFullYear()}/${String(new Date(hero.published_at).getMonth() + 1).padStart(2, '0')}/${String(new Date(hero.published_at).getDate()).padStart(2, '0')}/${hero.slug}`}
          className="group mb-10 block overflow-hidden rounded-2xl border border-surface-200 bg-white"
        >
          {hero.featured_image_url && (
            <img
              src={hero.featured_image_url}
              alt={hero.title}
              className="h-64 w-full object-cover sm:h-80 lg:h-96"
            />
          )}
          <div className="p-6">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: hero.section_color_hex }}
            >
              {hero.section_name}
            </span>
            <h2 className="mt-3 text-2xl font-bold text-surface-900 group-hover:text-primary-600 transition-colors sm:text-3xl lg:text-4xl">
              {hero.title}
            </h2>
            <p className="mt-2 text-base text-surface-500 max-w-text">
              {hero.excerpt}
            </p>
          </div>
        </a>
      )}

      {/* Section Rows */}
      {sections.map((section) => (
        <section key={section.slug} className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-xl font-bold"
              style={{ color: section.color_hex }}
            >
              {section.name}
            </h2>
            <a
              href={`/section/${section.slug}`}
              className="text-sm font-medium text-surface-500 hover:text-surface-900 transition-colors"
            >
              More {section.name} &rarr;
            </a>
          </div>
          {section.articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {section.articles.map((article: any) => (
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
            <p className="text-sm text-surface-400">No articles yet in this section.</p>
          )}
        </section>
      ))}
    </div>
  )
}
