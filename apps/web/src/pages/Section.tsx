import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import AdCard from '../components/AdCard'

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
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!section) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-gray-500">Section not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
           <div className="flex flex-col gap-8 lg:flex-row">
             <div className="flex-1 min-w-0">
               <div className="mb-6 border-b-2 border-gray-900 pb-1">
                 <h1 className="text-2xl font-bold text-gray-900">{section.name}</h1>
               </div>

               {articles.length > 0 ? (
                 <div className="space-y-0">
                   {articles.map((article: any, i: number) => {
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
                           <span
                             className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-white"
                             style={{ backgroundColor: section.color_hex }}
                           >
                             {section.name}
                           </span>
                           <span className="ml-2 text-xs text-gray-400">{timeAgo(article.published_at)}</span>
                           <h3 className="mt-1 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                             {article.title}
                           </h3>
                           {article.excerpt && (
                             <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                           )}
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
                 <p className="py-8 text-sm text-gray-400">No articles in this section yet.</p>
               )}
             </div>

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
