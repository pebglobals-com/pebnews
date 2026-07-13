import type { Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import type { JwtPayload } from '@pebnews/shared-types'

export async function authenticate(c: Context, next: Next) {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401)
  }

  const token = header.slice(7)
  try {
    const secret = (c.env as any).JWT_SECRET
    if (!secret) {
      console.error('JWT_SECRET is not set in environment')
      return c.json({ error: 'Server configuration error' }, 500)
    }
    const payload = await verify(token, secret) as unknown as JwtPayload
    c.set('user', payload)
    return next()
  } catch (e: any) {
    console.error('JWT verify failed:', e?.message || e)
    return c.json({ error: 'Invalid or expired token', detail: e?.message }, 401)
  }
}

export function requireRole(...roles: string[]) {
  return function (c: Context, next: Next) {
    const user: JwtPayload | undefined = c.get('user')
    if (!user || !roles.includes(user.role)) {
      return c.json({ error: 'Insufficient permissions' }, 403)
    }
    return next()
  }
}
