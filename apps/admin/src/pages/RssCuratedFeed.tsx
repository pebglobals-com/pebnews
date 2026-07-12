import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../lib/api'
import { ArrowLeft, Sparkles, ExternalLink, Newspaper, ImageOff, Edit3 } from 'lucide-react'
import { toast } from 'sonner'

export default function RssCuratedFeed() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    adminApi.rss.curated().then((data) => {
      setItems(data.items)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleFeature(id: string) {
    try {
      await adminApi.rss.feature(id)
      setItems(items.map((i) => (i.id === id ? { ...i, featured: 1, featured_at: new Date().toISOString() } : i)))
      toast.success('Featured on homepage')
    } catch { toast.error('Failed to feature item') }
  }

  async function handleUnfeature(id: string) {
    try {
      await adminApi.rss.unfeature(id)
      setItems(items.map((i) => (i.id === id ? { ...i, featured: 0, featured_at: null } : i)))
      toast.success('Removed from homepage')
    } catch { toast.error('Failed to unfeature item') }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/editor/dashboard')} className="btn-secondary text-sm">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard
        </button>
        <h1 className="text-2xl font-bold text-surface-900">Curated Feed</h1>
      </div>

      <p className="text-sm text-surface-500 mb-6">
        Promote breaking news headlines from RSS sources to the homepage curated grid.
        Items marked as "Featured" appear in the Breaking News Grid on the public site.
      </p>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-surface-200" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12">
          <Newspaper className="mx-auto h-12 w-12 text-surface-300" />
          <p className="mt-4 text-surface-500">No RSS items cached yet</p>
          <p className="text-sm text-surface-400 mt-1">Wait for the next cron fetch or trigger it manually</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`card flex items-center gap-4 ${item.featured ? 'ring-2 ring-amber-400 bg-amber-50/50' : ''}`}
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-100">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt="" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center') }} />
                ) : (
                  <div className="flex h-full items-center justify-center"><ImageOff className="h-5 w-5 text-surface-300" /></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-surface-900">{item.headline}</p>
                <p className="text-xs text-surface-400 mt-0.5">
                  {item.source_name}
                  {item.source_domain ? ` — ${item.source_domain}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/editor/articles/new?title=${encodeURIComponent(item.headline)}&origin_source_name=${encodeURIComponent(item.source_name)}&origin_source_link=${encodeURIComponent(item.link)}&featured_image_url=${encodeURIComponent(item.thumbnail_url || '')}&is_breaking=1`)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Write our own take on this story"
                >
                  <Edit3 className="mr-1 inline h-3 w-3" /> Write Our Take
                </button>
                {item.featured ? (
                  <button
                    onClick={() => handleUnfeature(item.id)}
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200 transition-colors"
                  >
                    Featured
                  </button>
                ) : (
                  <button
                    onClick={() => handleFeature(item.id)}
                    className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-500 hover:bg-surface-200 transition-colors"
                  >
                    <Sparkles className="mr-1 inline h-3 w-3" /> Feature
                  </button>
                )}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-surface-400 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
