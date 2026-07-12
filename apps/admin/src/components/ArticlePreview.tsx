import { Eye, Calendar, User } from 'lucide-react'

interface Props {
  sectionName?: string
  sectionColor?: string
  title: string
  excerpt: string
  body: string
  featuredImageUrl?: string | null
  authorName?: string
  publishedAt?: string
}

export default function ArticlePreview({
  sectionName, sectionColor, title, excerpt, body,
  featuredImageUrl, authorName, publishedAt,
}: Props) {
  if (!title && !excerpt && !body && !featuredImageUrl) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 py-16 text-surface-400">
        <Eye className="mb-2 h-8 w-8" />
        <p className="text-sm">Start writing to see a preview</p>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl">
      {sectionName && (
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: sectionColor || '#2563eb' }}
        >
          {sectionName}
        </span>
      )}

      <h1 className="mt-4 text-3xl font-bold leading-tight text-surface-900 sm:text-4xl">
        {title || 'Untitled'}
      </h1>

      {(authorName || publishedAt) && (
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-surface-500">
          {authorName && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {authorName}
            </span>
          )}
          {publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(publishedAt).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-surface-300">
            <Eye className="h-4 w-4" /> 0 views
          </span>
        </div>
      )}

      {featuredImageUrl && (
        <div className="mt-6 overflow-hidden rounded-xl">
          <img
            src={featuredImageUrl}
            alt={title}
            className="w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      <div className="mt-8">
        {excerpt && (
          <>
            <p className="text-lg leading-relaxed text-surface-700 font-serif">{excerpt}</p>
            <hr className="my-6 border-surface-200" />
          </>
        )}
        {body ? (
          <div
            className="prose prose-surface max-w-none font-serif leading-relaxed text-surface-800"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          title && (
            <p className="text-surface-400 italic">Write the article body to see it here...</p>
          )
        )}
      </div>
    </article>
  )
}
