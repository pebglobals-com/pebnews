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
    api.rss.breaking(12).then((data) => {
      setItems(data.items)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading || items.length === 0) return null

  return (
    <div className="bg-red-600 text-white overflow-hidden">
      <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <span className="shrink-0 bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-red-600 z-10">
          Breaking
        </span>
        <div className="relative overflow-hidden py-1.5 ml-3 w-full">
          <div className="flex animate-ticker gap-8 whitespace-nowrap hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
            {[...items, ...items].map((item, i) => (
              <span
                key={`${item.id}-${i}`}
                className="inline-flex items-center gap-1.5 text-sm text-white/90 shrink-0"
              >
                <span className="font-semibold">{item.source_name}:</span>
                <span>{item.headline}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
