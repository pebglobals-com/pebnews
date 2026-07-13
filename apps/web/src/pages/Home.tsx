import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import BreakingNewsGrid from '../components/BreakingNewsGrid'
import AdCard from '../components/AdCard'

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
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
  }

function ArticleCard({ article, section }: { article: any; section?: SectionGroup }) {
  const sec = section || { name: article.section_name, slug: article.section_slug, color_hex: article.section_color_hex }
  const d = new Date(article.published_at)
  const path = `/article/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${article.slug}`

  return (
    <Link to={path} className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {article.featured_image_url ? (
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img src={article.featured_image_url} alt="" className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-[1.03]" loading="lazy" />
        </div>
      ) : (
        <div className="aspect-[16/10] flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-300">No image</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-3">
        <span
          className="inline-flex items-center self-start rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
          style={{ backgroundColor: sec.color_hex }}
        >
          {sec.name}
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

export default function Home() {
  const [sections, setSections] = useState<SectionGroup[]>([])
  const [hero, setHero] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.articles.list(1),
      api.articles.list(20),
      api.sections.list(),
    ]).then(([heroArticle, recentNews, sectionData]) => {
      if (heroArticle.articles.length > 0) {
        setHero(heroArticle.articles[0])
      }
      const recentSection: SectionGroup = {
        slug: 'recent-news',
        name: 'Recent News',
        color_hex: '#dc2626',
        articles: recentNews.articles.slice(0, 12),
      }
      Promise.all(
        sectionData.sections.map((s: any) =>
          api.articles.bySection(s.slug, 12).then((res) => ({
            slug: s.slug,
            name: s.name,
            color_hex: s.color_hex,
            articles: res.articles,
          }))
        )
      ).then((allSections) => {
        setSections([recentSection, ...allSections.filter((s) => s.slug !== 'recent-news')])
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 rounded-xl bg-gray-200" />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="aspect-[16/9] rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
       {/* Hero Section — two-column split layout */}
       {hero && hero.featured_image_url && (
         <section className="mb-8">
           <Link
             to={`/article/${new Date(hero.published_at).getFullYear()}/${String(new Date(hero.published_at).getMonth() + 1).padStart(2, '0')}/${String(new Date(hero.published_at).getDate()).padStart(2, '0')}/${hero.slug}`}
             className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
           >
             <div className="flex flex-col md:flex-row md:min-h-[500px]">
               <div className="md:w-[55%] overflow-hidden">
                 <img
                   src={hero.featured_image_url}
                   alt={hero.title}
                   className="h-[280px] md:h-full w-full object-cover object-center"
                 />
               </div>
               <div className="flex flex-1 flex-col justify-center p-6 md:p-8 lg:p-10">
                 <span
                   className="inline-flex items-center self-start rounded px-2 py-0.5 text-xs font-semibold text-white mb-3"
                   style={{ backgroundColor: hero.section_color_hex }}
                 >
                   {hero.section_name}
                 </span>
                 <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl lg:text-4xl">
                   {hero.title}
                 </h2>
                 <p className="mt-2 text-base leading-relaxed text-gray-600 line-clamp-3">
                   {hero.excerpt}
                 </p>
                 <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                   {hero.author_name && <span>By: {hero.author_name}</span>}
                   <span>{timeAgo(hero.published_at)}</span>
                   <span>{hero.view_count ?? 0} views</span>
                 </div>
               </div>
             </div>
           </Link>
         </section>
       )}

       {/* Secondary Featured Articles Row */}
       {sections.length > 0 && sections[0].articles.length > 4 && (
         <section className="mb-8">
           <h2 className="mb-4 text-lg font-bold text-gray-900 border-b-2 border-gray-900 pb-1">
             Latest Updates
           </h2>
           <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
             {sections[0].articles.slice(1, 5).map((article: any) => (
               <ArticleCard key={article.id} article={article} />
             ))}
           </div>
         </section>
       )}

       {/* Breaking News Grid */}
       <BreakingNewsGrid />

       {/* Two-column layout */}
       <div className="flex flex-col gap-8 lg:flex-row">
         {/* Main Content */}
         <div className="flex-1 min-w-0">
          {/* Recent News — first section articles as cards */}
          {sections.length > 0 && sections[0].articles.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-bold text-gray-900 border-b-2 border-gray-900 pb-1">
                Recent News
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sections[0].articles.slice(0, 4).map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}

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
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                  {section.articles.slice(0, 8).map((article: any) => (
                    <ArticleCard key={article.id} article={article} section={section} />
                  ))}
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
            <AdCard />
            <AdCard />
          </div>
        </aside>
      </div>
    </div>
  )
}
