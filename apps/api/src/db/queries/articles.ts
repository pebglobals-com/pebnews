import type { Article, ArticleWithMeta, ArticleStatus } from '@pebnews/shared-types'

function articleRow(row: any): ArticleWithMeta {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    section_id: row.section_id,
    author_id: row.author_id,
    excerpt: row.excerpt,
    body: row.body,
    featured_image_url: row.featured_image_url,
    status: row.status,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    section_name: row.section_name,
    section_slug: row.section_slug,
    section_color_hex: row.section_color_hex,
    author_name: row.author_name,
    view_count: row.view_count ?? 0,
  }
}

const ARTICLE_WITH_META = `
  SELECT a.*, s.name AS section_name, s.slug AS section_slug,
         s.color_hex AS section_color_hex, u.name AS author_name
  FROM articles a
  JOIN sections s ON s.id = a.section_id
  JOIN users u ON u.id = a.author_id
`

export async function getPublishedArticles(db: D1Database, limit = 20, offset = 0): Promise<ArticleWithMeta[]> {
  const rows = await db
    .prepare(`${ARTICLE_WITH_META} WHERE a.status = 'published' ORDER BY a.published_at DESC LIMIT ? OFFSET ?`)
    .bind(limit, offset)
    .all()
  return rows.results.map(articleRow)
}

export async function getArticlesBySection(db: D1Database, sectionSlug: string, limit = 10): Promise<ArticleWithMeta[]> {
  const rows = await db
    .prepare(`${ARTICLE_WITH_META} WHERE a.status = 'published' AND s.slug = ? ORDER BY a.published_at DESC LIMIT ?`)
    .bind(sectionSlug, limit)
    .all()
  return rows.results.map(articleRow)
}

export async function getArticleBySlug(db: D1Database, slug: string): Promise<ArticleWithMeta | null> {
  const row = await db
    .prepare(`${ARTICLE_WITH_META} WHERE a.slug = ? LIMIT 1`)
    .bind(slug)
    .first()
  return row ? articleRow(row) : null
}

export async function getArticlesByAuthor(db: D1Database, authorId: string, status?: ArticleStatus): Promise<ArticleWithMeta[]> {
  let sql = `${ARTICLE_WITH_META} WHERE a.author_id = ?`
  const params: any[] = [authorId]
  if (status) {
    sql += ' AND a.status = ?'
    params.push(status)
  }
  sql += ' ORDER BY a.updated_at DESC'
  const rows = await db.prepare(sql).bind(...params).all()
  return rows.results.map(articleRow)
}

export async function createArticle(
  db: D1Database,
  article: Omit<Article, 'created_at' | 'updated_at'>
): Promise<Article> {
  await db
    .prepare(
      `INSERT INTO articles (id, title, slug, section_id, author_id, excerpt, body, featured_image_url, status, published_at, is_breaking, origin_source_name, origin_source_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      article.id, article.title, article.slug, article.section_id,
      article.author_id, article.excerpt, article.body,
      article.featured_image_url, article.status, article.published_at,
      (article as any).is_breaking ?? 0,
      (article as any).origin_source_name ?? null,
      (article as any).origin_source_link ?? null
    )
    .run()
  return article as Article
}

export async function updateArticle(
  db: D1Database,
  id: string,
  fields: Partial<Pick<Article, 'title' | 'body' | 'excerpt' | 'featured_image_url' | 'status' | 'published_at' | 'section_id'>>
): Promise<void> {
  const sets: string[] = []
  const values: any[] = []
  for (const [key, val] of Object.entries(fields)) {
    if (val !== undefined) {
      sets.push(`${key} = ?`)
      values.push(val)
    }
  }
  if (sets.length === 0) return
  sets.push("updated_at = datetime('now')")
  values.push(id)
  await db.prepare(`UPDATE articles SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run()
}

export async function getHomepageData(db: D1Database): Promise<Record<string, ArticleWithMeta[]>> {
  const sections = await db
    .prepare('SELECT id, name, slug, color_hex FROM sections ORDER BY name ASC')
    .all<{ id: string; name: string; slug: string; color_hex: string }>()

  const result: Record<string, ArticleWithMeta[]> = {}
  for (const section of sections.results) {
    const articles = await getArticlesBySection(db, section.slug, 3)
    result[section.slug] = articles
  }
  return result
}

export async function getLatestBreaking(db: D1Database, limit = 10) {
  return db
    .prepare('SELECT * FROM breaking_news_cache ORDER BY fetched_at DESC LIMIT ?')
    .bind(limit)
    .all()
    .then(r => r.results)
}
