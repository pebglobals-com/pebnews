import type { Context, Next } from 'hono'

export interface Env {
  ALLOWED_EDITOR_DOMAIN: string
}

export function domainCheck(c: Context, next: Next) {
  // IMPORTANT: ALLOWED_EDITOR_DOMAIN is set via Cloudflare Worker secret.
  // Before production launch, change this to the client's real domain
  // (e.g., pebnews.com) using `wrangler secret put ALLOWED_EDITOR_DOMAIN`.
  // The current value (talent-loop.org) is for testing only.

  const { email } = c.req.valid('json') as { email?: string }
  if (!email) {
    return c.json({ error: 'Email is required' }, 400)
  }

  const domain = email.split('@')[1]?.toLowerCase()
  const allowedDomain = (c.env as Env).ALLOWED_EDITOR_DOMAIN?.toLowerCase()

  if (!allowedDomain) {
    return c.json({ error: 'Editor registration is not configured' }, 500)
  }

  if (!domain || domain !== allowedDomain) {
    return c.json({
      error: `Only @${allowedDomain} email addresses can register for the editorial portal`
    }, 403)
  }

  return next()
}
