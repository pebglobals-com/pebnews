import { useState, useEffect, useRef } from 'react'
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
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.rss.breaking(12).then((data) => {
      setItems(data.items)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading || items.length === 0) return null

  return (
    <div className="bg-red-600 text-white">
      <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <span className="shrink-0 bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
          Breaking
        </span>
          <div ref={scrollRef} className="overflow-hidden py-1.5 ml-3 flex-1">
            <div className="flex animate-scroll gap-8 whitespace-nowrap" style={{ width: 'max-content' }}>
              {[...items, ...items].map((item, i) => (
                <a
                  key={`${item.id}-${i}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors shrink-0"
                >
                  <span className="font-semibold">{item.source_name}:</span>
                  <span>{item.headline}</span>
                </a>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}
