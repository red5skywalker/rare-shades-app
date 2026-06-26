'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { updateSighting } from '@/app/actions'
import { MODELS } from '@/lib/models'
import type { Sighting } from '@/lib/app-data'
import { getSightingPhotos } from '@/lib/app-data'
import ColorPicker from '@/app/(main)/components/ColorPicker'
import SearchableSelect from '@/app/(main)/components/SearchableSelect'
import MultiPhotoUpload from '@/app/(main)/components/MultiPhotoUpload'

export default function EditSightingForm({ sighting }: { sighting: Sighting }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const existingPhotos = getSightingPhotos(sighting)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)

    if (!formData.get('color_slug')) {
      setError('Please select a color.')
      return
    }

    const photo = formData.get('new_photo_0') as File | null
    if (photo && photo.size > 8 * 1024 * 1024) {
      setError('Photos must be under 8 MB each.')
      return
    }

    startTransition(async () => {
      const result = await updateSighting(sighting.id, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <section>
      <div className="section-head">
        <div>
          <p className="eyebrow">Edit entry</p>
          <h1 style={{ fontSize: 48 }}>Edit Sighting</h1>
          <p>Update the details of this sighting.</p>
        </div>
      </div>
      <div className="content-grid grid-2">
        <form className="panel" onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-grid">
            <div className="field full">
              <label>Porsche color</label>
              <ColorPicker initialSlug={sighting.color_slug} />
            </div>
            <div className="field">
              <label>Model</label>
              <SearchableSelect
                items={MODELS}
                name="model"
                placeholder="Search model, generation, trim…"
                initialValue={sighting.model}
              />
            </div>
            <div className="field">
              <label htmlFor="model_year">Year</label>
              <input
                id="model_year"
                name="model_year"
                inputMode="numeric"
                placeholder="Optional"
                defaultValue={sighting.model_year ?? ''}
              />
            </div>
            <div className="field">
              <label htmlFor="spotted_on">Date spotted</label>
              <input
                id="spotted_on"
                name="spotted_on"
                type="date"
                required
                defaultValue={sighting.spotted_on}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="field">
              <label htmlFor="location_label">Location</label>
              <input
                id="location_label"
                name="location_label"
                placeholder="City, region, event, or road"
                required
                defaultValue={sighting.location_label}
              />
            </div>
            <div className="field full">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="What made this spot memorable?"
                defaultValue={sighting.notes ?? ''}
              />
            </div>
            <div className="field full">
              <label>
                Photos{' '}
                <span style={{ fontWeight: 400, color: 'var(--muted)' }}>
                  (up to 3)
                </span>
              </label>
              <MultiPhotoUpload existingPhotos={existingPhotos.filter(p => p.id !== 'legacy')} maxPhotos={3} />
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: 16 }}>
            <button className="primary-button" type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save changes'}
            </button>
            <Link href={`/logbook/${sighting.id}`} className="ghost-button" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
        <aside className="panel">
          <h2>Editing tips</h2>
          <div className="content-grid">
            <div className="leader-row">
              <span className="rank">01</span>
              <span>
                <strong>Color &amp; model</strong>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 13 }}>
                  Changing the color updates your rarity score and collection stats.
                </span>
              </span>
            </div>
            <div className="leader-row">
              <span className="rank">02</span>
              <span>
                <strong>Add a photo</strong>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 13 }}>
                  Upload your own shot of the car to replace the color swatch on this sighting.
                </span>
              </span>
            </div>
            <div className="leader-row">
              <span className="rank">03</span>
              <span>
                <strong>Notes</strong>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 13 }}>
                  Add context — the event, the road, what made it special.
                </span>
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
