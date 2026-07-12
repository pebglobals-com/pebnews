import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { createUser, getUserByEmail, getUserById } from '../db/queries/users'
import { domainCheck } from '../middleware/domainCheck'
import { authenticate } from '../middleware/auth'
import type { JwtPayload, User } from '@pebnews/shared-types'

function makeToken(payload: JwtPayload, secret: string): Promise<string> {
  return sign({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 }, secret) // 24h
}

const readerSignupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
})

const editorSignupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const app = new Hono<{ Bindings: { DB: D1Database; JWT_SECRET: string } }>()

// Reader signup — no domain restriction
app.post('/reader/signup', zValidator('json', readerSignupSchema), async (c) => {
  const { name, email, password } = c.req.valid('json')
  const db = c.env.DB

  const existing = await getUserByEmail(db, email)
  if (existing) {
    return c.json({ error: 'Email already registered' }, 409)
  }

  const bcrypt = await import('bcryptjs')
  const password_hash = await bcrypt.hash(password, 10)
  const id = crypto.randomUUID()

  await createUser(db, { id, name, email, password_hash, role: 'reader' })

  const token = await makeToken({ user_id: id, role: 'reader', email } satisfies JwtPayload, c.env.JWT_SECRET)
  return c.json({ token, user: { id, name, email, role: 'reader' } })
})

// Editorial signup — domain restricted
app.post('/editor/signup', zValidator('json', editorSignupSchema), domainCheck, async (c) => {
  const { name, email, password } = c.req.valid('json')
  const db = c.env.DB

  const existing = await getUserByEmail(db, email)
  if (existing) {
    return c.json({ error: 'Email already registered' }, 409)
  }

  const bcrypt = await import('bcryptjs')
  const password_hash = await bcrypt.hash(password, 10)
  const id = crypto.randomUUID()

  await createUser(db, { id, name, email, password_hash, role: 'editor' })

  const token = await makeToken({ user_id: id, role: 'editor', email } satisfies JwtPayload, c.env.JWT_SECRET)
  return c.json({ token, user: { id, name, email, role: 'editor' } })
})

// Login (works for both reader and editor)
app.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json')
  const db = c.env.DB

  const user = await getUserByEmail(db, email)
  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const bcrypt = await import('bcryptjs')
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const token = await makeToken({ user_id: user.id, role: user.role, email: user.email } satisfies JwtPayload, c.env.JWT_SECRET)
  return c.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

// Get current user info
app.get('/me', authenticate, async (c) => {
  const user: JwtPayload = c.get('user')
  const db = c.env.DB
  const full = await getUserById(db, user.user_id)
  if (!full) return c.json({ error: 'User not found' }, 404)
  return c.json({ id: full.id, name: full.name, email: full.email, role: full.role })
})

export default app
