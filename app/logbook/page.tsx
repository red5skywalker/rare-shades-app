import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RARITY_CONFIG } from '@/lib/colors'
import type { RarityCategory } from '@/lib/colors'

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

export default async function LogbookPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sightings, error } = await supabase
    .from('sighting')
    .select('*')
    .eq('user_id', user.id)
    .order('spotted_on', { ascending: false })

  if (error) {
    return (
      <div>
        <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>Error loading sightings: {error.message}</p>
      </div>
    )
  }

  const items = (sightings ?? []) as Sighting[]
  const uniqueColors = new Set(items.map(s => s.color_slug)).size
  const topRarity = (() => {
    const order: RarityCategory[] = ['Legendary', 'Ultra Rare', 'Rare', 'Uncommon', 'Common']
    for (const r of order) {
      if (items.some(s => s.rarity === r)) return r
    }
    return null
  })()

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          My Logbook
        </h1>

        {items.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem' }}>
            <Stat label="Sightings" value={items.length} />
            <Stat label="Colors" value={uniqueColors} />
            {topRarity && (
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4 }}>
                  Best Rarity
                </div>
                <span className="rarity-badge" style={{
                  color: RARITY_CONFIG[topRarity as RarityCategory]?.color ?? '#999',
                  background: RARITY_CONFIG[topRarity as RarityCategory]?.bg ?? 'transparent',
                }}>
                  {topRarity}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--surface)',
          border: '1px dashed var(--border)',
          borderRadius: 12,
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>No sightings yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Time to hit the road. Log your first Porsche color spotting.
          </p>
          <Link href="/logbook/new" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.625rem 1.5rem' }}>
            Log First Spotting
          </Link>
        </div>
      )}

      {/* Sighting list */}
      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(s => (
            <SightingCard key={s.id} sighting={s} />
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </div>
    </div>
  )
}

function SightingCard({ sighting: s }: { sighting: Sighting }) {
  const rarity = s.rarity as RarityCategory
  const rc = RARITY_CONFIG[rarity] ?? RARITY_CONFIG.Uncommon
  const date = new Date(s.spotted_on + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Link href={`/logbook/${s.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '1rem 1.25rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
        transition: 'border-color 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        {/* Color swatch */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: s.color_hex, border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{s.color_name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {s.model}{s.model_year ? ` · ${s.model_year}` : ''}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
              <span className="rarity-badge" style={{ color: rc.color, background: rc.bg }}>
                {rarity}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}>
                {date}
              </span>
            </div>
          </div>

          {/* Location */}
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
            📍 {s.location_label}
          </div>

          {/* Notes */}
          {s.notes && (
            <div style={{
              fontSize: '0.8125rem',
              color: 'var(--text-dim)',
              marginTop: '0.5rem',
              fontStyle: 'italic',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              &ldquo;{s.notes}&rdquo;
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
