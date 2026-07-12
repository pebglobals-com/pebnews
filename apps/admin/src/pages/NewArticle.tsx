import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { adminApi } from '../lib/api'
import SectionPicker from '../components/SectionPicker'
import PublishBar from '../components/PublishBar'
import RichTextEditor from '../components/RichTextEditor'
import ImageUploader from '../components/ImageUploader'
import ArticlePreview from '../components/ArticlePreview'
import { ArrowLeft, Flame, Eye, Edit3 } from 'lucide-react'

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
  const [showPreview, setShowPreview] = useState(false)
  const [extraImages, setExtraImages] = useState<string[]>([])

  useEffect(() => {
    adminApi.sections.list().then((data) => setSections(data.sections))
  }, [])

  // Restore draft from localStorage if page was refreshed
  useEffect(() => {
    const saved = localStorage.getItem('draft_in_progress')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.title && !title) setTitle(parsed.title)
        if (parsed.excerpt && !excerpt) setExcerpt(parsed.excerpt)
        if (parsed.body && !body) setBody(parsed.body)
        if (parsed.featuredImageUrl && !featuredImageUrl) setFeaturedImageUrl(parsed.featuredImageUrl)
        if (parsed.isBreaking !== undefined) setIsBreaking(parsed.isBreaking)
      } catch { /* ignore */ }
    }
  }, [])

  // Auto-save draft to localStorage as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      const draft = { title, excerpt, body, featuredImageUrl, isBreaking }
      localStorage.setItem('draft_in_progress', JSON.stringify(draft))
    }, 2000)
    return () => clearTimeout(timer)
  }, [title, excerpt, body, featuredImageUrl, isBreaking])

  function buildPayload(status: string, scheduledAt?: string) {
    const payload: any = {
      title,
      section_id: selectedSection!.id,
      excerpt,
      body,
      featured_image_url: featuredImageUrl || null,
      status,
      is_breaking: isBreaking ? 1 : 0,
    }
    if (status === 'published' && !scheduledAt) {
      payload.published_at = new Date().toISOString()
    }
    if (status === 'scheduled' && scheduledAt) {
      payload.published_at = scheduledAt
    }
    if (originSourceName) payload.origin_source_name = originSourceName
    if (originSourceLink) payload.origin_source_link = originSourceLink
    return payload
  }

  async function handlePublish(scheduledAt?: string) {
    if (!selectedSection || !title.trim()) return
    setSaving(true)
    try {
      const res = await adminApi.articles.create(
        buildPayload(scheduledAt ? 'scheduled' : 'published', scheduledAt)
      )
      setArticleId(res.article.id)
      localStorage.removeItem('draft_in_progress')
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
    try {
      const res = await adminApi.articles.create(buildPayload('draft'))
      setArticleId(res.article.id)
      localStorage.removeItem('draft_in_progress')
    } catch (err: any) {
      alert(err.message || 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  function addExtraImage(url: string) {
    setExtraImages((prev) => [...prev, url])
    // Append to body as an image
    setBody((prev) => prev + `<figure><img src="${url}" alt="" /></figure>`)
  }

  function removeExtraImage(index: number) {
    setExtraImages((prev) => prev.filter((_, i) => i !== index))
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setSelectedSection(null)} className="btn-secondary text-sm">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Change Section
        </button>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="h-4 w-4 rounded border-surface-300 text-red-500 focus:ring-red-500"
            />
            <Flame className={`h-4 w-4 ${isBreaking ? 'text-red-500' : 'text-surface-300'}`} />
            <span className="font-medium text-surface-700">Breaking</span>
          </label>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`btn-secondary text-sm ${showPreview ? 'ring-2 ring-primary-300' : ''}`}
          >
            <Eye className="mr-1.5 h-4 w-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: selectedSection.color_hex }}
        >
          {selectedSection.name}
        </span>
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

      {showPreview ? (
        <div className="card p-6 sm:p-8">
          <ArticlePreview
            sectionName={selectedSection.name}
            sectionColor={selectedSection.color_hex}
            title={title}
            excerpt={excerpt}
            body={body}
            featuredImageUrl={featuredImageUrl}
            authorName={localStorage.getItem('user_name') || undefined}
            publishedAt={new Date().toISOString()}
          />
        </div>
      ) : (
        <div className="space-y-6">
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

            <ImageUploader
              value={featuredImageUrl}
              onChange={setFeaturedImageUrl}
              label="Featured Image"
            />

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-surface-700">
                Short Read <span className="text-surface-400">({excerpt.length}/500)</span>
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
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Article Body
              </label>
              <RichTextEditor content={body} onChange={setBody} />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Additional Images
              </label>
              <ImageUploader
                value=""
                onChange={addExtraImage}
                label=""
              />
              {extraImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {extraImages.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="h-16 w-24 rounded object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExtraImage(i)}
                        className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-surface-400">
                Upload extra images — they are appended to the article body automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      <PublishBar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saving={saving}
        articleId={articleId}
      />
    </div>
  )
}
