import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const viewSchema = z.object({
  article_id: z.string().min(1),
})

const app = new Hono<{ Bindings: { DB: D1Database; KV: KVNamespace } }>()

app.post('/', zValidator('json', viewSchema), async (c) => {
  const { article_id } = c.req.valid('json')
  const db = c.env.DB
  const kv = c.env.KV

  // Get client IP from Cloudflare header
  const ip = c.req.header('CF-Connecting-IP') || 'unknown'
  const viewerHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + article_id))
  const hashHex = Array.from(new Uint8Array(viewerHash)).map(b => b.toString(16).padStart(2, '0')).join('')

  // KV dedup key expires after 30 minutes
  const kvKey = `view:${article_id}:${hashHex}`
  const exists = await kv.get(kvKey)
  if (exists) {
    return c.json({ counted: false })
  }

  await kv.put(kvKey, '1', { expirationTtl: 1800 }) // 30 min

  const id = crypto.randomUUID()
  await db
    .prepare('INSERT INTO article_views (id, article_id, viewer_hash) VALUES (?, ?, ?)')
    .bind(id, article_id, hashHex)
    .run()

  return c.json({ counted: true })
})

app.get('/count/:articleId', async (c) => {
  const { articleId } = c.req.param()
  const row = await c.env.DB
    .prepare('SELECT COUNT(*) AS count FROM article_views WHERE article_id = ?')
    .bind(articleId)
    .first<{ count: number }>()
  return c.json({ count: row?.count ?? 0 })
})

export default app
