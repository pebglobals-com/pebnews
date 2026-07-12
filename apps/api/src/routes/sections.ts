import { Hono } from 'hono'
import { getAllSections, getSectionBySlug } from '../db/queries/sections'

const app = new Hono<{ Bindings: { DB: D1Database } }>()

app.get('/', async (c) => {
  const sections = await getAllSections(c.env.DB)
  return c.json({ sections })
})

app.get('/:slug', async (c) => {
  const { slug } = c.req.param()
  const section = await getSectionBySlug(c.env.DB, slug)
  if (!section) return c.json({ error: 'Section not found' }, 404)
  return c.json({ section })
})

export default app
