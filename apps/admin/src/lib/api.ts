const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const adminApi = {
  auth: {
    editorSignup: (name: string, email: string, password: string) =>
      request<{ token: string; user: any }>('/api/auth/editor/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    login: (email: string, password: string) =>
      request<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<{ id: string; name: string; email: string; role: string }>('/api/auth/me'),
  },
  articles: {
    my: (status?: string) =>
      request<{ articles: any[] }>(`/api/articles/my/all${status ? `?status=${status}` : ''}`),
    create: (data: any) =>
      request<{ article: any }>('/api/articles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<{ success: boolean }>(`/api/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    get: (slug: string) =>
      request<{ article: any }>(`/api/articles/${slug}`),
  },
  sections: {
    list: () => request<{ sections: any[] }>('/api/sections'),
  },
  rss: {
    sources: () => request<{ sources: any[] }>('/api/rss/sources'),
    add: (name: string, feed_url: string) =>
      request<{ source: any }>('/api/rss/sources', {
        method: 'POST',
        body: JSON.stringify({ name, feed_url }),
      }),
    toggle: (id: string) =>
      request<{ active: number }>(`/api/rss/sources/${id}/toggle`, { method: 'PATCH' }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/rss/sources/${id}`, { method: 'DELETE' }),
  },
}
