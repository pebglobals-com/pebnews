import { useState, useEffect, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi } from '../lib/api'

export default function EditorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [restoreMsg, setRestoreMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const backup = localStorage.getItem('draft_backup')
    if (backup) {
      try {
        const parsed = JSON.parse(backup)
        if (parsed.path) {
          setRestoreMsg('Your session expired. Login to return to where you left off.')
        }
      } catch { /* ignore */ }
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await adminApi.auth.login(email, password)
      if (res.user.role !== 'editor' && res.user.role !== 'admin') {
        setError('This portal is for editorial staff only')
        setLoading(false)
        return
      }
      localStorage.setItem('token', res.token)
      localStorage.setItem('role', res.user.role)
      localStorage.setItem('user_name', res.user.name)

      const backup = localStorage.getItem('draft_backup')
      localStorage.removeItem('draft_backup')

      if (backup) {
        try {
          const parsed = JSON.parse(backup)
          if (parsed.path && parsed.path !== '/editor/dashboard') {
            navigate(parsed.path)
            return
          }
        } catch { /* ignore */ }
      }

      navigate('/editor/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="card">
        <h1 className="text-xl font-bold text-surface-900 text-center">Editorial Login</h1>
        <p className="mt-1 text-center text-sm text-surface-500">
          Sign in with your work email
        </p>
        {restoreMsg && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            {restoreMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-700">
              Work Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input-field mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-surface-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="input-field mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-sm text-surface-500">
            Need an account?{' '}
            <Link to="/editor/signup" className="text-primary-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
