import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authenticate, requireRole } from '../middleware/auth'
import type { JwtPayload } from '@pebnews/shared-types'

const sourceSchema = z.object({
  name: z.string().min(1).max(100),
  feed_url: z.string().url(),
})

const app = new Hono<{ Bindings: { DB: D1Database; JWT_SECRET: string } }>()

// Editor: list RSS sources
app.get('/sources', authenticate, requireRole('editor', 'admin'), async (c) => {
  const sources = await c.env.DB
    .prepare('SELECT id, name, feed_url, active FROM rss_sources ORDER BY name ASC')
    .all()
  return c.json({ sources: sources.results })
})

// Editor: add RSS source
app.post('/sources', authenticate, requireRole('editor', 'admin'), zValidator('json', sourceSchema), async (c) => {
  const { name, feed_url } = c.req.valid('json')
  const id = crypto.randomUUID()
  await c.env.DB
    .prepare('INSERT INTO rss_sources (id, name, feed_url) VALUES (?, ?, ?)')
    .bind(id, name, feed_url)
    .run()
  return c.json({ source: { id, name, feed_url, active: 1 } }, 201)
})

// Editor: toggle RSS source active status
app.patch('/sources/:id/toggle', authenticate, requireRole('editor', 'admin'), async (c) => {
  const { id } = c.req.param()
  const source = await c.env.DB
    .prepare('SELECT active FROM rss_sources WHERE id = ?')
    .bind(id)
    .first<{ active: number }>()
  if (!source) return c.json({ error: 'Source not found' }, 404)
  const newActive = source.active ? 0 : 1
  await c.env.DB
    .prepare('UPDATE rss_sources SET active = ? WHERE id = ?')
    .bind(newActive, id)
    .run()
  return c.json({ active: newActive })
})

// Editor: delete RSS source
app.delete('/sources/:id', authenticate, requireRole('editor', 'admin'), async (c) => {
  const { id } = c.req.param()
  await c.env.DB.prepare('DELETE FROM rss_sources WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

// Public: get breaking news from cache
app.get('/breaking', async (c) => {
  const limit = Math.min(Number(c.req.query('limit')) || 10, 30)
  const items = await c.env.DB
    .prepare('SELECT * FROM breaking_news_cache ORDER BY fetched_at DESC LIMIT ?')
    .bind(limit)
    .all()
  return c.json({ items: items.results })
})

export default app
