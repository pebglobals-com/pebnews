import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { ExternalLink, ImageOff } from 'lucide-react'

interface FeaturedItem {
  id: string
  source_name: string
  headline: string
  link: string
  source_domain?: string
  thumbnail_url?: string
}

export default function BreakingNewsGrid() {
  const [items, setItems] = useState<FeaturedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.rss.curated().then((data) => {
      setItems(data.featured)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return null
  if (items.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-gray-900 border-b-2 border-red-600 pb-1 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-red-600 animate-pulse" />
        Breaking News
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.slice(0, 10).map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
          >
            <div className="aspect-[16/9] overflow-hidden bg-gray-100">
              {item.thumbnail_url && item.thumbnail_url.trim() ? (
                <img
                  src={item.thumbnail_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                    const parent = (e.target as HTMLImageElement).parentElement!
                    parent.classList.add('flex', 'items-center', 'justify-center')
                    const placeholder = document.createElement('div')
                    placeholder.className = 'flex items-center justify-center'
                    placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
                    parent.appendChild(placeholder)
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageOff className="h-6 w-6 text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
                {item.source_name}
              </span>
              <p className="mt-1 text-xs font-medium leading-snug text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3">
                {item.headline}
              </p>
              <div className="mt-auto pt-1.5">
                <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-400">
                  Read <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
