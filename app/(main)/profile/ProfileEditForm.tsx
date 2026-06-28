'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions'
import type { AppUserProfile } from '@/lib/app-data'

export default function ProfileEditForm({ profile, username, avatarInitials }: {
  profile: AppUserProfile | null
  username: string
  avatarInitials: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const result = await updateProfile(new FormData(e.currentTarget))
      if (result?.error) setError(result.error)
      else if (result?.success) setSuccess(result.success)
    })
  }

  return (
    <section className="panel">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              required
              defaultValue={profile?.username ?? username}
              placeholder="your_handle"
            />
          </div>
          <div className="field">
            <label htmlFor="avatar_initials">
              Avatar initials <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(2 chars)</span>
            </label>
            <input
              id="avatar_initials"
              name="avatar_initials"
              maxLength={2}
              defaultValue={profile?.avatar_initials ?? avatarInitials}
              placeholder="AB"
            />
          </div>
          <div className="field full">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="A line about your collecting style…"
              defaultValue={profile?.bio ?? ''}
            />
          </div>
        </div>
        <div className="form-actions" style={{ marginTop: 12 }}>
          <button type="submit" className="primary-button" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  )
}
