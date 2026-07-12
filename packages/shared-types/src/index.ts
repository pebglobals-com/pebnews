export type UserRole = 'reader' | 'editor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  role: UserRole
  created_at: string
}

export interface Section {
  id: string
  name: string
  slug: string
  color_hex: string
}

export type ArticleStatus = 'draft' | 'scheduled' | 'published'

export interface Article {
  id: string
  title: string
  slug: string
  section_id: string
  author_id: string
  excerpt: string
  body: string
  featured_image_url: string | null
  status: ArticleStatus
  published_at: string | null
  created_at: string
  updated_at: string
  is_breaking?: number
  origin_source_name?: string | null
  origin_source_link?: string | null
}

export interface ArticleWithMeta extends Article {
  section_name?: string
  section_slug?: string
  section_color_hex?: string
  author_name?: string
  view_count?: number
}

export interface RssSource {
  id: string
  name: string
  feed_url: string
  active: number
}

export interface BreakingNewsItem {
  id: string
  source_name: string
  headline: string
  link: string
  pub_date: string | null
  fetched_at: string
  source_domain?: string
  thumbnail_url?: string
  featured?: number
  featured_at?: string | null
  featured_by?: string | null
}

export interface CuratedFeed {
  featured: BreakingNewsItem[]
  breakingArticles: ArticleWithMeta[]
}

export interface ArticleView {
  id: string
  article_id: string
  viewer_hash: string
  viewed_at: string
}

export interface JwtPayload {
  user_id: string
  role: UserRole
  email: string
}
