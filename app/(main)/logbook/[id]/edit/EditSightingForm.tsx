'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { updateSighting } from '@/app/actions'
import { MODELS } from '@/lib/models'
import type { Sighting } from '@/lib/app-data'
import ColorPicker from '@/app/(main)/components/ColorPicker'
import SearchableSelect from '@/app/(main)/components/SearchableSelect'
import PhotoPositionPicker from '@/app/(main)/components/PhotoPositionPicker'

export default function EditSightingForm({ sighting }: { sighting: Sighting }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    formData.set('remove_photo', removePhoto ? 'true' : 'false')

    if (!formData.get('color_slug')) {
      setError('Please select a color.')
      return
    }

    const photo = formData.get('photo') as File | null
    if (photo && photo.size > 8 * 1024 * 1024) {
      setError('Photo must be under 8 MB. Try a smaller or compressed image.')
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
              <label htmlFor="photo">
                Photo{' '}
                <span style={{ fontWeight: 400, color: 'var(--muted)' }}>
                  {sighting.photo_url ? '(upload to replace current)' : '(optional)'}
                </span>
              </label>
              {sighting.photo_url && !removePhoto && !photoPreviewUrl && (
                <div style={{ marginBottom: 10 }}>
                  <PhotoPositionPicker
                    src={sighting.photo_url}
                    initialPosition={sighting.photo_position ?? '50% 50%'}
                  />
                  <button
                    type="button"
                    className="ghost-button"
                    style={{ marginTop: 8, color: 'var(--red)', fontSize: 13 }}
                    onClick={() => setRemovePhoto(true)}
                  >
                    Remove photo
                  </button>
                </div>
              )}
              {removePhoto && (
                <p style={{ fontSize: 13, color: 'var(--red)', marginBottom: 8 }}>
                  Photo will be removed on save.{' '}
                  <button
                    type="button"
                    className="ghost-button"
                    style={{ fontSize: 13 }}
                    onClick={() => setRemovePhoto(false)}
                  >
                    Undo
                  </button>
                </p>
              )}
              {!removePhoto && (
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    setPhotoPreviewUrl(file ? URL.createObjectURL(file) : null)
                  }}
                />
              )}
              {photoPreviewUrl && !removePhoto && (
                <PhotoPositionPicker src={photoPreviewUrl} />
              )}
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
