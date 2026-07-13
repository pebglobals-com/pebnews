import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import EditorLogin from './pages/EditorLogin'
import EditorSignup from './pages/EditorSignup'
import Dashboard from './pages/Dashboard'
import NewArticle from './pages/NewArticle'
import EditArticle from './pages/EditArticle'
import ArticleList from './pages/ArticleList'
import RssSources from './pages/RssSources'
import RssCuratedFeed from './pages/RssCuratedFeed'
import { adminApi } from './lib/api'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('invalid')
      navigate('/editor/login', { replace: true })
      return
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      )
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setStatus('invalid')
        navigate('/editor/login', { replace: true })
        return
      }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      setStatus('invalid')
      navigate('/editor/login', { replace: true })
      return
    }

    setStatus('valid')

    adminApi.auth.me().catch(() => {})
  }, [navigate])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (status === 'invalid') return null

  return <>{children}</>
}

export default function App() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Routes>
        <Route path="/editor/login" element={<EditorLogin />} />
        <Route path="/editor/signup" element={<EditorSignup />} />
        <Route
          path="/editor/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/articles/new"
          element={
            <ProtectedRoute>
              <NewArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/articles/:id/edit"
          element={
            <ProtectedRoute>
              <EditArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/articles"
          element={
            <ProtectedRoute>
              <ArticleList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/rss-sources"
          element={
            <ProtectedRoute>
              <RssSources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/rss/curated"
          element={
            <ProtectedRoute>
              <RssCuratedFeed />
            </ProtectedRoute>
          }
        />
        <Route path="/editor" element={<Navigate to="/editor/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/editor/login" replace />} />
      </Routes>
    </div>
  )
}
