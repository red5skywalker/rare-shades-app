'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { createSighting } from '@/app/actions'
import { MODELS } from '@/lib/models'
import ColorPicker from '@/app/(main)/components/ColorPicker'
import SearchableSelect from '@/app/(main)/components/SearchableSelect'
import MultiPhotoUpload from '@/app/(main)/components/MultiPhotoUpload'

export default function NewSightingForm({ initialColorSlug }: { initialColorSlug?: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)

    if (!formData.get('color_slug')) {
      setError('Please select a color.')
      return
    }
    if (!formData.get('model')) {
      setError('Please enter a model.')
      return
    }

    const photo = formData.get('new_photo_0') as File | null
    if (photo && photo.size > 8 * 1024 * 1024) {
      setError('Photos must be under 8 MB each.')
      return
    }

    startTransition(async () => {
      const result = await createSighting(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <section>
      <div className="section-head">
        <div>
          <p className="eyebrow">Journal entry</p>
          <h1 style={{ fontSize: 48 }}>Log a Sighting</h1>
          <p>Every entry adds to your collection, rarity score, timeline, and challenge progress.</p>
        </div>
      </div>
      <div className="content-grid grid-2">
        <form className="panel" onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-grid">
            <div className="field full">
              <label>Porsche color</label>
              <ColorPicker initialSlug={initialColorSlug} />
            </div>
            <div className="field">
              <label>Model</label>
              <SearchableSelect
                items={MODELS}
                name="model"
                placeholder="Search model, generation, trim…"
              />
            </div>
            <div className="field">
              <label htmlFor="model_year">Year</label>
              <input id="model_year" name="model_year" inputMode="numeric" placeholder="Optional" />
            </div>
            <div className="field">
              <label htmlFor="spotted_on">Date spotted</label>
              <input id="spotted_on" name="spotted_on" type="date" required defaultValue={today} max={today} />
            </div>
            <div className="field">
              <label htmlFor="location_label">Location</label>
              <input id="location_label" name="location_label" placeholder="City, region, event, or road" required />
            </div>
            <div className="field full">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" name="notes" placeholder="What made this spot memorable?" />
            </div>
            <div className="field full">
              <label>
                Your photos <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(up to 3, optional)</span>
              </label>
              <MultiPhotoUpload maxPhotos={3} />
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: 16 }}>
            <button className="primary-button" type="submit" disabled={isPending}>
              {isPending ? 'Saving sighting...' : 'Save sighting'}
            </button>
            <Link href="/collection" className="ghost-button" style={{ textDecoration: 'none' }}>
              View collection
            </Link>
          </div>
        </form>
        <aside className="panel">
          <h2>What this unlocks</h2>
          <div className="content-grid">
            <div className="leader-row">
              <span className="rank">01</span>
              <span>
                <strong>Archive progress</strong>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 13 }}>
                  Each new color advances your collection completion rate.
                </span>
              </span>
              <span className="points">+1</span>
            </div>
            <div className="leader-row">
              <span className="rank">02</span>
              <span>
                <strong>Rarity score</strong>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 13 }}>
                  Rare, ultra-rare, and legendary paints stack points quickly.
                </span>
              </span>
              <span className="points">XP</span>
            </div>
            <div className="leader-row">
              <span className="rank">03</span>
              <span>
                <strong>Collector timeline</strong>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 13 }}>
                  Your sighting history becomes a visual archive of every discovery.
                </span>
              </span>
              <span className="points">Live</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
