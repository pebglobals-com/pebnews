import { Link } from 'react-router-dom'

interface SectionBadgeProps {
  name: string
  color: string
  slug: string
}

export default function SectionBadge({ name, color, slug }: SectionBadgeProps) {
  return (
    <Link
      to={`/section/${slug}`}
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: color }}
    >
      {name}
    </Link>
  )
}
