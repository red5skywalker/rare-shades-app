'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await login(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-soft)',
      }}>
        {/* Brand */}
        <div style={{ marginBottom: '2rem' }}>
          <p className="eyebrow" style={{ margin: 0 }}>Paint archive</p>
          <h2 style={{ margin: '4px 0 0', fontSize: 28 }}>Rare Shades</h2>
        </div>

        <h3 style={{ marginBottom: 4 }}>Welcome back</h3>
        <p style={{ marginBottom: '1.5rem' }}>Sign in to your spotting logbook</p>

        {error && (
          <div style={{
            background: 'rgba(213,0,28,0.08)',
            border: '1px solid rgba(213,0,28,0.25)',
            color: 'var(--red)',
            fontSize: 14,
            padding: '10px 14px',
            borderRadius: 'var(--radius)',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: 20 }}>
            <button type="submit" className="primary-button" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </form>

        <p style={{ marginTop: '1.5rem', marginBottom: 0, textAlign: 'center', fontSize: 14 }}>
          No account yet?{' '}
          <Link href="/signup" style={{ color: 'var(--ink)', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
        <p style={{ marginTop: '0.75rem', marginBottom: 0, textAlign: 'center', fontSize: 14 }}>
          <Link href="/forgot-password" style={{ color: 'var(--muted)' }}>
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  )
}
