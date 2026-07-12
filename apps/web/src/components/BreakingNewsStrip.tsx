import { useState, useEffect } from 'react'
import { api } from '../lib/api'

interface BreakingItem {
  id: string
  source_name: string
  headline: string
  link: string
  pub_date: string | null
}

export default function BreakingNewsStrip() {
  const [items, setItems] = useState<BreakingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.rss.breaking(8).then((data) => {
      setItems(data.items)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading || items.length === 0) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2 overflow-hidden">
          <span className="shrink-0 rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
            Breaking
          </span>
          <div className="flex gap-6 overflow-x-auto scrollbar-none">
            {items.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm text-amber-900 hover:text-amber-700 transition-colors whitespace-nowrap"
              >
                <span className="font-medium">{item.source_name}:</span>{' '}
                {item.headline}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
