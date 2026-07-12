import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/auth'
import articleRoutes from './routes/articles'
import sectionRoutes from './routes/sections'
import viewRoutes from './routes/views'
import rssRoutes from './routes/rss'
import uploadRoutes from './routes/upload'
import { fetchAllFeeds } from './jobs/fetchRssFeeds'

const app = new Hono<{ Bindings: { DB: D1Database; KV: KVNamespace; R2: R2Bucket; JWT_SECRET: string } }>()

app.use('/*', cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://pebnews-web.pages.dev',
    'https://pebnews-admin.pages.dev',
    'https://pebnews-admin.talent-loop.org',
  ],
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

app.route('/api/auth', authRoutes)
app.route('/api/articles', articleRoutes)
app.route('/api/sections', sectionRoutes)
app.route('/api/views', viewRoutes)
app.route('/api/rss', rssRoutes)
app.route('/api/upload', uploadRoutes)

app.get('/api/health', (c) => c.json({ status: 'ok' }))

// Cron-triggered RSS ingestion
app.get('/__cron/fetch-rss', async (c) => {
  try {
    const count = await fetchAllFeeds(c.env.DB)
    return c.json({ fetched: count })
  } catch (err) {
    console.error('RSS fetch failed:', err)
    return c.json({ error: 'RSS fetch failed' }, 500)
  }
})

export default app
