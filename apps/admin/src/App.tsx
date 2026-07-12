import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import EditorLogin from './pages/EditorLogin'
import EditorSignup from './pages/EditorSignup'
import Dashboard from './pages/Dashboard'
import NewArticle from './pages/NewArticle'
import EditArticle from './pages/EditArticle'
import ArticleList from './pages/ArticleList'
import RssSources from './pages/RssSources'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (!token || role !== 'editor') {
    return <Navigate to="/editor/login" replace />
  }
  return <>{children}</>
}

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) return null

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
        <Route path="/editor" element={<Navigate to="/editor/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/editor/login" replace />} />
      </Routes>
    </div>
  )
}
