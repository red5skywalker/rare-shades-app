'use client'

import { useRef, useState } from 'react'
import type { SightingPhoto } from '@/lib/app-data'
import PhotoPositionPicker from './PhotoPositionPicker'

interface NewSlot {
  key: number
  previewUrl: string | null
}

interface MultiPhotoUploadProps {
  existingPhotos?: SightingPhoto[]
  maxPhotos?: number
}

export default function MultiPhotoUpload({
  existingPhotos = [],
  maxPhotos = 3,
}: MultiPhotoUploadProps) {
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [newSlots, setNewSlots] = useState<NewSlot[]>([])
  const nextKey = useRef(0)

  const keptExisting = existingPhotos.filter((p) => !deletedIds.includes(p.id))
  const totalPhotos = keptExisting.length + newSlots.length
  const canAdd = totalPhotos < maxPhotos

  function addSlot() {
    setNewSlots((prev) => [...prev, { key: nextKey.current++, previewUrl: null }])
  }

  function removeNewSlot(key: number) {
    setNewSlots((prev) => prev.filter((s) => s.key !== key))
  }

  function updatePreview(key: number, url: string | null) {
    setNewSlots((prev) => prev.map((s) => (s.key === key ? { ...s, previewUrl: url } : s)))
  }

  function deleteExisting(id: string) {
    setDeletedIds((prev) => [...prev, id])
  }

  function undoDelete(id: string) {
    setDeletedIds((prev) => prev.filter((x) => x !== id))
  }

  return (
    <div className="multi-photo-upload">
      {/* Hidden field carrying IDs to delete */}
      <input type="hidden" name="delete_photo_ids" value={deletedIds.join(',')} />

      {/* Existing photos */}
      {existingPhotos.map((photo, idx) => {
        const isDeleted = deletedIds.includes(photo.id)
        return (
          <div key={photo.id} className={`photo-slot${isDeleted ? ' photo-slot--deleted' : ''}`}>
            <div className="photo-slot-label">
              Photo {idx + 1}
              {isDeleted ? (
                <button
                  type="button"
                  className="ghost-button"
                  style={{ fontSize: 12, marginLeft: 8 }}
                  onClick={() => undoDelete(photo.id)}
                >
                  Undo remove
                </button>
              ) : (
                <button
                  type="button"
                  className="ghost-button"
                  style={{ fontSize: 12, marginLeft: 8, color: 'var(--red)' }}
                  onClick={() => deleteExisting(photo.id)}
                >
                  Remove
                </button>
              )}
            </div>
            {!isDeleted && (
              <PhotoPositionPicker
                src={photo.photo_url}
                initialPosition={photo.photo_position}
                initialScale={photo.photo_scale}
                name={`existing_${photo.id}_position`}
                scaleName={`existing_${photo.id}_scale`}
              />
            )}
          </div>
        )
      })}

      {/* New photo slots */}
      {newSlots.map((slot, i) => (
        <div key={slot.key} className="photo-slot photo-slot--new">
          <div className="photo-slot-label">
            New photo {keptExisting.length + i + 1}
            <button
              type="button"
              className="ghost-button"
              style={{ fontSize: 12, marginLeft: 8, color: 'var(--red)' }}
              onClick={() => removeNewSlot(slot.key)}
            >
              Remove
            </button>
          </div>
          <input
            type="file"
            name={`new_photo_${i}`}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              updatePreview(slot.key, file ? URL.createObjectURL(file) : null)
            }}
          />
          {slot.previewUrl && (
            <PhotoPositionPicker
              src={slot.previewUrl}
              name={`new_photo_${i}_position`}
              scaleName={`new_photo_${i}_scale`}
            />
          )}
        </div>
      ))}

      {/* Add photo button */}
      {canAdd && (
        <button
          type="button"
          className="ghost-button"
          style={{ marginTop: 8, fontSize: 14 }}
          onClick={addSlot}
        >
          + Add photo{totalPhotos === 0 ? '' : ` (${maxPhotos - totalPhotos} remaining)`}
        </button>
      )}
    </div>
  )
}
