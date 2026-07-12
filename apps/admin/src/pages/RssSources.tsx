import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../lib/api'
import { Plus, Trash2, ArrowLeft, Rss } from 'lucide-react'
import { toast } from 'sonner'

export default function RssSources() {
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [feedUrl, setFeedUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    adminApi.rss.sources().then((data) => {
      setSources(data.sources)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    setAdding(true)
    try {
      const res = await adminApi.rss.add(name, feedUrl)
      setSources([...sources, res.source])
      setName('')
      setFeedUrl('')
      setShowForm(false)
      toast.success('RSS source added')
    } catch (err: any) {
      toast.error(err.message || 'Failed to add source')
    } finally {
      setAdding(false)
    }
  }

  async function handleToggle(id: string) {
    try {
      const res = await adminApi.rss.toggle(id)
      setSources(sources.map((s) => (s.id === id ? { ...s, active: res.active } : s)))
      toast.success(res.active ? 'Source enabled' : 'Source disabled')
    } catch {
      toast.error('Failed to toggle source')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this RSS source?')) return
    try {
      await adminApi.rss.delete(id)
      setSources(sources.filter((s) => s.id !== id))
      toast.success('Source removed')
    } catch {
      toast.error('Failed to delete source')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/editor/dashboard')} className="btn-secondary text-sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard
          </button>
          <h1 className="text-2xl font-bold text-surface-900">RSS Sources</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          <Plus className="mr-1.5 h-4 w-4" /> Add Source
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700">Source Name</label>
            <input
              type="text"
              required
              className="input-field mt-1"
              placeholder="e.g. AP News"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700">Feed URL</label>
            <input
              type="url"
              required
              className="input-field mt-1"
              placeholder="https://example.com/rss"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={adding} className="btn-primary">
              {adding ? 'Adding...' : 'Add Source'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-surface-200" />
          ))}
        </div>
      ) : sources.length === 0 ? (
        <div className="card text-center py-12">
          <Rss className="mx-auto h-12 w-12 text-surface-300" />
          <p className="mt-4 text-surface-500">No RSS sources configured yet</p>
          <p className="text-sm text-surface-400 mt-1">Add a source to start collecting breaking news headlines</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sources.map((source) => (
            <div key={source.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Rss className={`h-5 w-5 shrink-0 ${source.active ? 'text-amber-500' : 'text-surface-300'}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-surface-900">{source.name}</p>
                  <p className="truncate text-xs text-surface-400">{source.feed_url}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(source.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    source.active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                  }`}
                >
                  {source.active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDelete(source.id)}
                  className="rounded-lg p-2 text-surface-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
