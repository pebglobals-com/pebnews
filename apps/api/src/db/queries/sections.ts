import type { Section } from '@pebnews/shared-types'

export function getAllSections(db: D1Database): Promise<Section[]> {
  return db
    .prepare('SELECT id, name, slug, color_hex FROM sections ORDER BY name ASC')
    .all<Section>()
    .then(r => r.results)
}

export function getSectionBySlug(db: D1Database, slug: string): Promise<Section | null> {
  return db
    .prepare('SELECT id, name, slug, color_hex FROM sections WHERE slug = ?')
    .bind(slug)
    .first<Section>()
}
