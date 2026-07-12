import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function ReaderSignup() {
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
      const res = await api.auth.readerSignup(name, email, password)
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-surface-900 text-center">Create Account</h1>
      <p className="mt-2 text-center text-sm text-surface-500">
        Join PEB News for free
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-surface-700">
            Name
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
            Email
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
            minLength={6}
            className="input-field mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <p className="text-center text-sm text-surface-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
