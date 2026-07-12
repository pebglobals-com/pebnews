import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import ArticleCard from '../components/ArticleCard'
import BreakingNewsGrid from '../components/BreakingNewsGrid'

interface SectionGroup {
  slug: string
  name: string
  color_hex: string
  articles: any[]
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(dateStr).toLocaleDateString()
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function AdBlock() {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
      PLACE YOUR ADS HERE
    </div>
  )
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
      Promise.all(
        sectionData.sections.map((s: any) =>
          api.articles.bySection(s.slug, 4).then((res) => ({
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
          <div className="h-64 rounded-xl bg-gray-200" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Hero Section */}
      {hero && (
        <section className="mb-8">
          <Link
            to={`/article/${new Date(hero.published_at).getFullYear()}/${String(new Date(hero.published_at).getMonth() + 1).padStart(2, '0')}/${String(new Date(hero.published_at).getDate()).padStart(2, '0')}/${hero.slug}`}
            className="group block overflow-hidden rounded-lg border border-gray-200 bg-white md:flex"
          >
            {hero.featured_image_url && (
              <div className="md:w-3/5">
                <img
                  src={hero.featured_image_url}
                  alt={hero.title}
                  className="h-64 w-full object-cover md:h-full"
                />
              </div>
            )}
            <div className="flex flex-col justify-center p-6 md:w-2/5">
              <span
                className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: hero.section_color_hex }}
              >
                {hero.section_name}
              </span>
              <h2 className="mt-3 text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors md:text-2xl">
                {hero.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3">
                {hero.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                {hero.author_name && <span>By: {hero.author_name}</span>}
                <span>{timeAgo(hero.published_at)}</span>
                <span>{hero.view_count ?? 0} views</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Breaking News Grid */}
      <BreakingNewsGrid />

      {/* Two-column layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Recent News */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900 border-b-2 border-gray-900 pb-1">
              Recent News
            </h2>
            {sections.length > 0 && sections[0].articles.slice(0, 4).map((article: any, i: number) => {
              const section = sections.find((s) => s.slug === article.section_slug) || sections[0]
              const d = new Date(article.published_at)
              const path = `/article/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${article.slug}`
              return (
                <Link key={article.id} to={path} className={`group flex gap-4 py-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                  {article.featured_image_url && (
                    <div className="w-24 shrink-0 overflow-hidden rounded md:w-32">
                      <img src={article.featured_image_url} alt="" className="h-20 w-full object-cover md:h-24" loading="lazy" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-blue-600">{section.name} &nbsp;/&nbsp; {timeAgo(article.published_at)}</span>
                    <h3 className="mt-0.5 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">{article.view_count ?? 0} views</p>
                  </div>
                </Link>
              )
            })}
          </section>

          {/* Section Blocks */}
          {sections.slice(0, 3).map((section) => (
            <section key={section.slug} className="mb-8">
              <div className="mb-3 flex items-center justify-between border-b-2 border-gray-900 pb-1">
                <h2 className="text-lg font-bold text-gray-900">{section.name}</h2>
                <Link to={`/section/${section.slug}`} className="text-xs font-medium text-blue-600 hover:text-blue-800">
                  More {section.name} &rarr;
                </Link>
              </div>
              {section.articles.length > 0 ? (
                <div className="space-y-0">
                  {section.articles.slice(0, 5).map((article: any, i: number) => {
                    const d = new Date(article.published_at)
                    const path = `/article/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${article.slug}`
                    return (
                      <Link key={article.id} to={path} className={`group flex gap-4 py-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                        {article.featured_image_url && (
                          <div className="w-20 shrink-0 overflow-hidden rounded md:w-24">
                            <img src={article.featured_image_url} alt="" className="h-16 w-full object-cover md:h-20" loading="lazy" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold text-blue-600">{section.name} &nbsp;/&nbsp; {timeAgo(article.published_at)}</span>
                          <h3 className="mt-0.5 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                            {article.author_name && <span>By: {article.author_name}</span>}
                            <span>{article.view_count ?? 0} views</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="py-4 text-sm text-gray-400">No articles yet.</p>
              )}
            </section>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="space-y-6 lg:sticky lg:top-36">
            <AdBlock />
            <AdBlock />
          </div>
        </aside>
      </div>
    </div>
  )
}
