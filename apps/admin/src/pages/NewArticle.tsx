import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { adminApi } from '../lib/api'
import SectionPicker from '../components/SectionPicker'
import PublishBar from '../components/PublishBar'
import { ArrowLeft, Flame } from 'lucide-react'

export default function NewArticle() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [sections, setSections] = useState<any[]>([])
  const [selectedSection, setSelectedSection] = useState<any | null>(null)
  const [title, setTitle] = useState(searchParams.get('title') || '')
  const [excerpt, setExcerpt] = useState(searchParams.get('excerpt') || '')
  const [body, setBody] = useState('')
  const [featuredImageUrl, setFeaturedImageUrl] = useState(searchParams.get('featured_image_url') || '')
  const [isBreaking, setIsBreaking] = useState(searchParams.get('is_breaking') === '1')
  const [originSourceName, setOriginSourceName] = useState(searchParams.get('origin_source_name') || '')
  const [originSourceLink, setOriginSourceLink] = useState(searchParams.get('origin_source_link') || '')
  const [saving, setSaving] = useState(false)
  const [articleId, setArticleId] = useState<string | null>(null)

  useEffect(() => {
    adminApi.sections.list().then((data) => setSections(data.sections))
  }, [])

  async function handlePublish(scheduledAt?: string) {
    if (!selectedSection || !title.trim()) return
    setSaving(true)
    const payload: any = {
      title,
      section_id: selectedSection.id,
      excerpt,
      body,
      featured_image_url: featuredImageUrl || null,
      status: scheduledAt ? 'scheduled' : 'published',
      published_at: scheduledAt || undefined,
      is_breaking: isBreaking ? 1 : 0,
    }
    if (originSourceName) payload.origin_source_name = originSourceName
    if (originSourceLink) payload.origin_source_link = originSourceLink
    try {
      const res = await adminApi.articles.create(payload)
      setArticleId(res.article.id)
      navigate('/editor/dashboard')
    } catch (err: any) {
      alert(err.message || 'Failed to publish')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveDraft() {
    if (!selectedSection || !title.trim()) return
    setSaving(true)
    const payload: any = {
      title,
      section_id: selectedSection.id,
      excerpt,
      body,
      featured_image_url: featuredImageUrl || null,
      status: 'draft',
      is_breaking: isBreaking ? 1 : 0,
    }
    if (originSourceName) payload.origin_source_name = originSourceName
    if (originSourceLink) payload.origin_source_link = originSourceLink
    try {
      const res = await adminApi.articles.create(payload)
      setArticleId(res.article.id)
    } catch (err: any) {
      alert(err.message || 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  if (!selectedSection) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/editor/dashboard')} className="btn-secondary text-sm mb-6">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-surface-900 mb-6">New Article</h1>
        <p className="text-sm text-surface-500 mb-6">Choose a section to get started:</p>
        <SectionPicker sections={sections} onSelect={setSelectedSection} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => setSelectedSection(null)}
        className="btn-secondary text-sm mb-6"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Change Section
      </button>

      <div className="mb-6 flex items-center justify-between">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: selectedSection.color_hex }}
        >
          {selectedSection.name}
        </span>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isBreaking}
            onChange={(e) => setIsBreaking(e.target.checked)}
            className="h-4 w-4 rounded border-surface-300 text-red-500 focus:ring-red-500"
          />
          <Flame className={`h-4 w-4 ${isBreaking ? 'text-red-500' : 'text-surface-300'}`} />
          <span className="font-medium text-surface-700">Breaking News</span>
        </label>
      </div>

      {originSourceName && (
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          Based on news from <strong>{originSourceName}</strong>
          {originSourceLink && (
            <a href={originSourceLink} target="_blank" rel="noopener noreferrer" className="ml-1 underline hover:text-blue-600">
              (source)
            </a>
          )}
        </div>
      )}

      <div className="card space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-surface-700">
            Headline
          </label>
          <input
            id="title"
            type="text"
            className="input-field mt-1 text-lg font-semibold"
            placeholder="Article headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-surface-700">
            Featured Image URL
          </label>
          <input
            id="image"
            type="url"
            className="input-field mt-1"
            placeholder="https://example.com/image.jpg"
            value={featuredImageUrl}
            onChange={(e) => setFeaturedImageUrl(e.target.value)}
          />
          {featuredImageUrl && (
            <img
              src={featuredImageUrl}
              alt="Preview"
              className="mt-2 h-32 w-full rounded-lg object-cover"
            />
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-surface-700">
            Short Read <span className="text-surface-400">({excerpt.length}/200)</span>
          </label>
          <textarea
            id="excerpt"
            className="input-field mt-1 resize-none"
            rows={3}
            maxLength={500}
            placeholder="Brief summary for the homepage..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-surface-700">
            Article Body
          </label>
          <textarea
            id="body"
            className="input-field mt-1 min-h-[300px] resize-y font-serif leading-relaxed"
            placeholder="Write your article here... (HTML supported)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <p className="mt-1 text-xs text-surface-400">
            Supports basic HTML tags (&lt;p&gt;, &lt;h2&gt;, &lt;blockquote&gt;, &lt;img&gt;, etc.)
          </p>
        </div>
      </div>

      <PublishBar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saving={saving}
        articleId={articleId}
      />
    </div>
  )
}
