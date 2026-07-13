import { Hono } from 'hono'
import { authenticate, requireRole } from '../middleware/auth'

const app = new Hono<{ Bindings: { R2: R2Bucket; JWT_SECRET: string } }>()

app.post('/', authenticate, requireRole('editor', 'admin'), async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File | null
    if (!file) return c.json({ error: 'No file provided' }, 400)

    const ext = file.name.split('.').pop() || 'jpg'
    const key = `uploads/${crypto.randomUUID()}.${ext}`

    const buffer = await file.arrayBuffer()
    await c.env.R2.put(key, buffer, {
      httpMetadata: { contentType: file.type },
    })

    const publicUrl = `https://pub-d791492f7b1d413491ca62d7ac29e1d3.r2.dev/${key}`
    return c.json({ url: publicUrl, key })
  } catch (err: any) {
    console.error('Upload failed:', err)
    return c.json({ error: err?.message || 'Upload failed' }, 500)
  }
})

export default app
