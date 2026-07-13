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

export const api = {
  sections: {
    list: () => request<{ sections: any[] }>('/api/sections'),
    get: (slug: string) => request<{ section: any }>(`/api/sections/${slug}`),
  },
  articles: {
    list: (limit = 20, offset = 0) =>
      request<{ articles: any[] }>(`/api/articles?limit=${limit}&offset=${offset}`),
    bySection: (slug: string, limit = 10) =>
      request<{ articles: any[] }>(`/api/articles/section/${slug}?limit=${limit}`),
    get: (slug: string) => request<{ article: any }>(`/api/articles/${slug}`),
    search: (q: string) =>
      request<{ articles: any[] }>(`/api/articles/search?q=${encodeURIComponent(q)}`),
  },
  views: {
    record: (articleId: string) =>
      request<{ counted: boolean }>('/api/views', {
        method: 'POST',
        body: JSON.stringify({ article_id: articleId }),
      }),
    count: (articleId: string) =>
      request<{ count: number }>(`/api/views/count/${articleId}`),
  },
  rss: {
    breaking: (limit = 10) =>
      request<{ items: any[] }>(`/api/rss/breaking?limit=${limit}`),
    curated: () => request<{ featured: any[]; breakingArticles: any[] }>('/api/rss/curated/feed'),
  },

}
