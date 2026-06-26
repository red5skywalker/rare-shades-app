'use client'

import { useRef, useState } from 'react'
import type { SightingPhoto } from '@/lib/app-data'

interface PhotoCarouselProps {
  photos: SightingPhoto[]
  altPrefix?: string
}

export default function PhotoCarousel({ photos, altPrefix = 'Sighting photo' }: PhotoCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  if (photos.length === 0) return null

  if (photos.length === 1) {
    const p = photos[0]
    return (
      <img
        src={p.photo_url}
        alt={altPrefix}
        style={{
          objectPosition: p.photo_position ?? '50% 50%',
          transform: `scale(${p.photo_scale ?? 1})`,
          transformOrigin: p.photo_position ?? '50% 50%',
        }}
      />
    )
  }

  function handleScroll() {
    const el = trackRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIdx(idx)
  }

  function goTo(idx: number) {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' })
    setActiveIdx(idx)
  }

  return (
    <div className="photo-carousel">
      <div
        ref={trackRef}
        className="photo-carousel-track"
        onScroll={handleScroll}
      >
        {photos.map((p, i) => (
          <div key={p.id} className="photo-carousel-slide">
            <img
              src={p.photo_url}
              alt={`${altPrefix} ${i + 1}`}
              style={{
                objectPosition: p.photo_position ?? '50% 50%',
                transform: `scale(${p.photo_scale ?? 1})`,
                transformOrigin: p.photo_position ?? '50% 50%',
              }}
            />
          </div>
        ))}
      </div>

      <button
        className="photo-carousel-arrow photo-carousel-arrow--prev"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(Math.max(0, activeIdx - 1)) }}
        aria-label="Previous photo"
        hidden={activeIdx === 0}
      >
        ‹
      </button>
      <button
        className="photo-carousel-arrow photo-carousel-arrow--next"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(Math.min(photos.length - 1, activeIdx + 1)) }}
        aria-label="Next photo"
        hidden={activeIdx === photos.length - 1}
      >
        ›
      </button>

      <div className="photo-carousel-dots" aria-hidden="true">
        {photos.map((_, i) => (
          <button
            key={i}
            className={`photo-carousel-dot${i === activeIdx ? ' active' : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i) }}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
