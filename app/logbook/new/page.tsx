'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { COLORS, MODELS, RARITY_CONFIG, searchColors } from '@/lib/colors'
import type { PorscheColor, RarityCategory } from '@/lib/colors'
import { createSighting } from '@/app/actions'

export default function NewSpottingPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<PorscheColor | null>(null)
  const [query, setQuery] = useState('')
  const [step, setStep] = useState<'color' | 'details'>('color')

  const visibleColors = query.trim() ? searchColors(query) : COLORS

  function handleColorSelect(color: PorscheColor) {
    setSelectedColor(color)
    setStep('details')
    setQuery('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedColor) return
    setError(null)

    const fd = new FormData(e.currentTarget)
    fd.set('color_slug', selectedColor.slug)

    startTransition(async () => {
      const result = await createSighting(fd)
      if (result?.error) setError(result.error)
    })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>
          Log a Spotting
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {step === 'color' ? 'Select the Porsche color you spotted.' : 'Add the details of your sighting.'}
        </p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
        {['color', 'details'].map((s, i) => (
          <button
            key={s}
            onClick={() => { if (i === 0 || selectedColor) setStep(s as 'color' | 'details') }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.75rem', fontWeight: 600,
              padding: '0.375rem 0.75rem', borderRadius: 6,
              border: '1px solid ' + (step === s ? 'var(--accent)' : 'var(--border)'),
              background: step === s ? 'var(--accent-muted)' : 'transparent',
              color: step === s ? 'var(--accent)' : 'var(--text-dim)',
              cursor: i === 0 || selectedColor ? 'pointer' : 'default',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}
          >
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: step === s ? 'var(--accent)' : 'var(--border)',
              color: step === s ? '#000' : 'var(--text-dim)',
              fontSize: '0.625rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{i + 1}</span>
            {s === 'color' ? 'Color' : 'Details'}
          </button>
        ))}
      </div>

      {/* ── Step 1: Color picker ── */}
      {step === 'color' && (
        <div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, code, or family…"
            autoFocus
            style={{
              width: '100%',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text)',
              fontSize: '0.9375rem',
              padding: '0.625rem 0.875rem',
              outline: 'none',
              marginBottom: '1rem',
              fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.625rem' }}>
            {visibleColors.map(c => {
              const rc = RARITY_CONFIG[c.rarityCategory]
              return (
                <button
                  key={c.slug}
                  onClick={() => handleColorSelect(c)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '0.875rem 0.75rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.12s, transform 0.1s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = c.hex[0]
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'none'
                  }}
                >
                  {/* Swatch */}
                  <div style={{
                    height: 28, borderRadius: 5, marginBottom: '0.625rem',
                    background: `linear-gradient(135deg, ${c.hex[0]}, ${c.hex[1]})`,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }} />
                  {/* Name */}
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.25rem', color: 'var(--text)' }}>
                    {c.name}
                  </div>
                  {/* Code */}
                  <div style={{ fontSize: '0.625rem', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                    {c.code}
                  </div>
                  {/* Rarity */}
                  <span style={{
                    fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: rc.color, background: rc.bg,
                    padding: '0.15rem 0.35rem', borderRadius: 3,
                  }}>
                    {c.rarityCategory}
                  </span>
                </button>
              )
            })}
          </div>

          {visibleColors.length === 0 && (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
              No colors match &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* ── Step 2: Details form ── */}
      {step === 'details' && selectedColor && (
        <div>
          {/* Selected color summary */}
          <div style={{
            display: 'flex', gap: '1rem', alignItems: 'center',
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
            padding: '1rem', marginBottom: '1.75rem',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 8, flexShrink: 0,
              background: `linear-gradient(135deg, ${selectedColor.hex[0]}, ${selectedColor.hex[1]})`,
              border: '1px solid rgba(255,255,255,0.08)',
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{selectedColor.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.05em' }}>
                {selectedColor.code} · {selectedColor.family}
              </div>
            </div>
            <span className="rarity-badge" style={{
              color: RARITY_CONFIG[selectedColor.rarityCategory].color,
              background: RARITY_CONFIG[selectedColor.rarityCategory].bg,
            }}>
              {selectedColor.rarityCategory}
            </span>
            <button
              onClick={() => setStep('color')}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.8125rem', padding: '0.25rem 0.5rem' }}
            >
              Change
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="model">Model</label>
                <select id="model" name="model" required defaultValue="">
                  <option value="" disabled>Select model…</option>
                  {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="field">
                <label htmlFor="model_year">Year</label>
                <input
                  id="model_year"
                  name="model_year"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  placeholder="e.g. 2022"
                />
              </div>

              <div className="field">
                <label htmlFor="spotted_on">Date Spotted</label>
                <input
                  id="spotted_on"
                  name="spotted_on"
                  type="date"
                  required
                  defaultValue={today}
                  max={today}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="location_label">Location</label>
              <input
                id="location_label"
                name="location_label"
                type="text"
                required
                placeholder="e.g. Beverly Hills, CA"
              />
            </div>

            <div className="field" style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="notes">Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Anything memorable about the spot…"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn-primary" disabled={isPending} style={{ flex: 1 }}>
                {isPending ? 'Saving…' : 'Save Spotting'}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => router.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
