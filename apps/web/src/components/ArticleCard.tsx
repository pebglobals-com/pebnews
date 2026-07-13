import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string
  sectionName: string
  sectionSlug: string
  sectionColor: string
  featuredImageUrl?: string | null
  publishedAt?: string | null
  viewCount?: number
  authorName?: string
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function ArticleCard({
  title, slug, excerpt, sectionName, sectionColor,
  featuredImageUrl, publishedAt, viewCount, authorName,
}: ArticleCardProps) {
  const date = publishedAt || new Date().toISOString()
  const d = new Date(date)
  const articlePath = `/article/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${slug}`

  return (
    <Link to={articlePath} className="group block border-b border-gray-100 pb-4 mb-4 last:border-0">
      {featuredImageUrl && (
        <div className="mb-2.5 aspect-[16/9] overflow-hidden rounded">
          <img
            src={featuredImageUrl}
            alt={title}
            className="h-full w-full object-cover object-[50%_20%] transition-transform duration-150 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      )}
      <span
        className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-white"
        style={{ backgroundColor: sectionColor }}
      >
        {sectionName}
      </span>
      {authorName && (
        <span className="ml-2 text-xs text-gray-400">By: {authorName}</span>
      )}
      <h3 className="mt-1.5 text-base font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-500 line-clamp-2">{excerpt}</p>
      <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
        <span>{timeAgo(date)}</span>
        {viewCount !== undefined && (
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {viewCount}
          </span>
        )}
      </div>
    </Link>
  )
}
