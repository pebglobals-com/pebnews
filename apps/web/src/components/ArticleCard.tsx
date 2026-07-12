import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import SectionBadge from './SectionBadge'

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
  title, slug, excerpt, sectionName, sectionSlug, sectionColor,
  featuredImageUrl, publishedAt, viewCount, authorName,
}: ArticleCardProps) {
  const date = publishedAt || new Date().toISOString()
  const d = new Date(date)
  const articlePath = `/article/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${slug}`

  return (
    <Link to={articlePath} className="group block rounded-xl border border-surface-200 bg-white p-4 transition-shadow duration-150 hover:shadow-md">
      {featuredImageUrl && (
        <div className="mb-3 overflow-hidden rounded-lg">
          <img
            src={featuredImageUrl}
            alt={title}
            className="h-48 w-full object-cover transition-transform duration-150 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      )}
      <SectionBadge name={sectionName} color={sectionColor} slug={sectionSlug} />
      <h3 className="mt-2 text-lg font-semibold leading-snug text-surface-900 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-surface-500 line-clamp-2">{excerpt}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-surface-400">
        {authorName && <span>{authorName}</span>}
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
