'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const result = await signup(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    setLoading(false)
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

        <h3 style={{ marginBottom: 4 }}>Start your logbook</h3>
        <p style={{ marginBottom: '1.5rem' }}>Create a free account to log Porsche color sightings</p>

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

        {success && (
          <div style={{
            background: 'rgba(24,116,80,0.08)',
            border: '1px solid rgba(24,116,80,0.3)',
            color: 'var(--green)',
            fontSize: 14,
            padding: '10px 14px',
            borderRadius: 'var(--radius)',
            marginBottom: '1rem',
          }}>
            {success}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: 20 }}>
              <button type="submit" className="primary-button" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <p style={{ marginTop: '1.5rem', marginBottom: 0, textAlign: 'center', fontSize: 14 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--ink)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
