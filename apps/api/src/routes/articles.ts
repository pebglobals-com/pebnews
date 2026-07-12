import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authenticate, requireRole } from '../middleware/auth'
import {
  getPublishedArticles,
  getArticlesBySection,
  getArticleBySlug,
  getArticlesByAuthor,
  createArticle,
  updateArticle,
} from '../db/queries/articles'
import type { JwtPayload, ArticleStatus } from '@pebnews/shared-types'

const articleSchema = z.object({
  title: z.string().min(1).max(300),
  section_id: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  body: z.string().min(1),
  featured_image_url: z.string().url().nullable().optional(),
  status: z.enum(['draft', 'scheduled', 'published']),
  published_at: z.string().nullable().optional(),
})

const updateSchema = articleSchema.partial()

const app = new Hono<{ Bindings: { DB: D1Database; JWT_SECRET: string; KV: KVNamespace } }>()

// Public: list published articles
app.get('/', async (c) => {
  const limit = Math.min(Number(c.req.query('limit')) || 20, 50)
  const offset = Number(c.req.query('offset')) || 0
  const articles = await getPublishedArticles(c.env.DB, limit, offset)
  return c.json({ articles })
})

// Public: get articles by section slug
app.get('/section/:slug', async (c) => {
  const { slug } = c.req.param()
  const limit = Math.min(Number(c.req.query('limit')) || 10, 50)
  const articles = await getArticlesBySection(c.env.DB, slug, limit)
  return c.json({ articles })
})

// Public: get single article by slug
app.get('/:slug', async (c) => {
  const { slug } = c.req.param()
  const article = await getArticleBySlug(c.env.DB, slug)
  if (!article) return c.json({ error: 'Article not found' }, 404)
  return c.json({ article })
})

// Editor: list own articles
app.get('/my/all', authenticate, requireRole('editor', 'admin'), async (c) => {
  const user: JwtPayload = c.get('user')
  const status = c.req.query('status') as ArticleStatus | undefined
  const articles = await getArticlesByAuthor(c.env.DB, user.user_id, status)
  return c.json({ articles })
})

// Editor: create article
app.post('/', authenticate, requireRole('editor', 'admin'), zValidator('json', articleSchema), async (c) => {
  const user: JwtPayload = c.get('user')
  const data = c.req.valid('json')
  const id = crypto.randomUUID()
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200)

  const article = await createArticle(c.env.DB, {
    id,
    title: data.title,
    slug: `${slug}-${Date.now()}`,
    section_id: data.section_id,
    author_id: user.user_id,
    excerpt: data.excerpt,
    body: data.body,
    featured_image_url: data.featured_image_url ?? null,
    status: data.status,
    published_at: data.published_at ?? (data.status === 'published' ? new Date().toISOString() : null),
  })

  // Purge KV cache if published
  if (data.status === 'published') {
    await c.env.KV.delete('homepage')
    await c.env.KV.delete(`section:${article.section_id}`)
  }

  return c.json({ article }, 201)
})

// Editor: update article
app.patch('/:id', authenticate, requireRole('editor', 'admin'), zValidator('json', updateSchema), async (c) => {
  const { id } = c.req.param()
  const data = c.req.valid('json')

  if (data.status === 'published' && !data.published_at) {
    data.published_at = new Date().toISOString()
  }

  await updateArticle(c.env.DB, id, data)

  // Purge KV cache if published
  if (data.status === 'published') {
    await c.env.KV.delete('homepage')
  }

  return c.json({ success: true })
})

export default app
