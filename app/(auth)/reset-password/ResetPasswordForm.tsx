'use client'

import { useState } from 'react'
import { updatePassword } from '@/app/actions'

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError(null)
    const result = await updatePassword(formData)
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
        <div style={{ marginBottom: '2rem' }}>
          <p className="eyebrow" style={{ margin: 0 }}>Paint archive</p>
          <h2 style={{ margin: '4px 0 0', fontSize: 28 }}>Rare Shades</h2>
        </div>

        <h3 style={{ marginBottom: 4 }}>Choose a new password</h3>
        <p style={{ marginBottom: '1.5rem' }}>Pick something strong and memorable.</p>

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
              <label htmlFor="password">New password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
            </div>
            <div className="field">
              <label htmlFor="confirm">Confirm password</label>
              <input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} placeholder="Repeat your password" />
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: 20 }}>
            <button type="submit" className="primary-button" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Saving…' : 'Set new password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
