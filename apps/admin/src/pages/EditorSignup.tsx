import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi } from '../lib/api'

export default function EditorSignup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await adminApi.auth.editorSignup(name, email, password)
      localStorage.setItem('token', res.token)
      localStorage.setItem('role', res.user.role)
      navigate('/editor/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="card">
        <h1 className="text-xl font-bold text-surface-900 text-center">Editor Registration</h1>
        <p className="mt-1 text-center text-sm text-surface-500">
          Register with your work email address
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-surface-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="input-field mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-700">
              Work Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input-field mt-1"
              placeholder="you@talent-loop.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-1 text-xs text-surface-400">
              Must use your organization&rsquo;s email domain
            </p>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-surface-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="input-field mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="text-center text-sm text-surface-500">
            Already registered?{' '}
            <Link to="/editor/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
