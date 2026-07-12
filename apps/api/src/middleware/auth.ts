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
    const payload = await verify(token, (c.env as any).JWT_SECRET) as unknown as JwtPayload
    c.set('user', payload)
    return next()
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401)
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
