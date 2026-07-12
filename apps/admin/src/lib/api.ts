const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

function getToken(): string | null {
  return localStorage.getItem('token')
}

function redirectToLogin(saved?: string) {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  if (saved) localStorage.setItem('draft_backup', saved)
  window.location.href = '/editor/login'
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    // 401 — token invalid or expired
    if (res.status === 401) {
      redirectToLogin(
        JSON.stringify({ path: window.location.pathname + window.location.search })
      )
      // throw to stop execution — redirect will happen
      throw new Error('Session expired. Redirecting to login...')
    }
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
  upload: {
    image: async (file: File): Promise<{ url: string; key: string }> => {
      return adminApi.upload.file(file)
    },
    video: async (file: File): Promise<{ url: string; key: string }> => {
      return adminApi.upload.file(file)
    },
    file: async (file: File): Promise<{ url: string; key: string }> => {
      const token = getToken()
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
      if (res.status === 401) {
        redirectToLogin()
        throw new Error('Session expired')
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(err.error || 'Upload failed')
      }
      return res.json()
    },
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
    curated: () => request<{ items: any[] }>('/api/rss/curated'),
    feature: (id: string) =>
      request<{ success: boolean; featured: number }>(`/api/rss/curated/${id}/feature`, { method: 'POST' }),
    unfeature: (id: string) =>
      request<{ success: boolean; featured: number }>(`/api/rss/curated/${id}/unfeature`, { method: 'POST' }),
  },
}
