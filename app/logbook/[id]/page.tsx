import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RARITY_CONFIG, getColorBySlug } from '@/lib/colors'
import type { RarityCategory } from '@/lib/colors'
import { deleteSighting } from '@/app/actions'

interface Sighting {
  id: string
  color_slug: string
  color_name: string
  color_family: string
  color_hex: string
  rarity: string
  model: string
  model_year: number | null
  spotted_on: string
  location_label: string
  notes: string | null
  created_at: string
}

export default async function SightingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('sighting')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) notFound()

  const s = data as Sighting
  const rarity = s.rarity as RarityCategory
  const rc = RARITY_CONFIG[rarity] ?? RARITY_CONFIG.Uncommon
  const colorInfo = getColorBySlug(s.color_slug)

  const date = new Date(s.spotted_on + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
  const loggedAt = new Date(s.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  async function handleDelete() {
    'use server'
    await deleteSighting(id)
  }

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Back */}
      <Link href="/logbook" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.75rem' }}>
        ← Back to logbook
      </Link>

      {/* Color hero */}
      <div style={{
        background: `linear-gradient(135deg, ${s.color_hex}33, ${s.color_hex}11)`,
        border: `1px solid ${s.color_hex}44`,
        borderRadius: 12,
        padding: '1.75rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'flex-start',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(135deg, ${s.color_hex}, ${colorInfo?.hex[1] ?? s.color_hex})`,
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: `0 8px 24px ${s.color_hex}40`,
        }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
            {s.color_name}
          </h1>
          {colorInfo && (
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>
              {colorInfo.code} · {s.color_family}
            </div>
          )}
          <span className="rarity-badge" style={{ color: rc.color, background: rc.bg }}>
            {rarity}
          </span>
        </div>
      </div>

      {/* Detail grid */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: '1.5rem',
      }}>
        <DetailRow label="Vehicle" value={`${s.model}${s.model_year ? ` (${s.model_year})` : ''}`} />
        <DetailRow label="Spotted" value={date} />
        <DetailRow label="Location" value={s.location_label} last={!s.notes} />
        {s.notes && (
          <DetailRow label="Notes" value={s.notes} last italic />
        )}
      </div>

      {/* Historical note */}
      {colorInfo?.historical && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.625rem' }}>
            About this color
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
            {colorInfo.historical}
          </p>
          {colorInfo.availability && (
            <div style={{ marginTop: '0.875rem', fontSize: '0.75rem', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              Available: {colorInfo.availability}
            </div>
          )}
        </div>
      )}

      {/* Meta */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '2rem', fontFamily: 'var(--font-geist-mono)' }}>
        Logged on {loggedAt}
      </div>

      {/* Delete */}
      <form action={handleDelete}>
        <button type="submit" className="btn-danger">
          Delete this spotting
        </button>
      </form>
    </div>
  )
}

function DetailRow({ label, value, last, italic }: {
  label: string
  value: string
  last?: boolean
  italic?: boolean
}) {
  return (
    <div style={{
      display: 'flex',
      padding: '0.875rem 1.25rem',
      borderBottom: last ? 'none' : '1px solid var(--border-muted)',
      gap: '1rem',
    }}>
      <div style={{ width: 90, flexShrink: 0, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', paddingTop: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: '0.9375rem', color: 'var(--text)', fontStyle: italic ? 'italic' : 'normal', lineHeight: 1.6 }}>
        {value}
      </div>
    </div>
  )
}
