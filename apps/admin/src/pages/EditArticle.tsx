import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminApi } from '../lib/api'
import PublishBar from '../components/PublishBar'
import { ArrowLeft } from 'lucide-react'

export default function EditArticle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [featuredImageUrl, setFeaturedImageUrl] = useState('')
  const [status, setStatus] = useState('draft')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<any[]>([])

  useEffect(() => {
    if (!id) return
    Promise.all([
      adminApi.sections.list(),
      // We need to fetch article by ID - for now use the slug approach
      // Since we don't have a get-by-id endpoint, we'll load sections
    ]).then(([sectionData]) => {
      setSections(sectionData.sections)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  // For now, show a simple form since we need the article data
  // In production, fetch the article by ID from the API

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-surface-200" />
          <div className="h-96 rounded-xl bg-surface-200" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate('/editor/dashboard')} className="btn-secondary text-sm mb-6">
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-surface-900 mb-6">Edit Article</h1>

      <p className="text-sm text-surface-500">
        Article {id} loaded. Full edit functionality requires fetching article data from the API.
      </p>
    </div>
  )
}
