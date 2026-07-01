import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { colorImagePath, type PorscheColor } from '@/lib/colors'
import { formatDate, rarityClass, getSightingPhotos, type Sighting } from '@/lib/app-data'
import PhotoCarousel from './PhotoCarousel'

export function StatCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string
  value: string | number
  detail: string
  accent: string
}) {
  return (
    <article className="stat-card" style={{ '--stat-accent': accent } as CSSProperties}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{detail}</span>
    </article>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  )
}

export function ColorCard({ color }: { color: PorscheColor }) {
  const imagePath = colorImagePath(color)

  return (
    <Link href={`/colors/${color.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="color-card">
        <div
          className={`paint-photo ${color.imageFile ? 'has-photo' : ''}`}
          style={{ '--paint-one': color.hex[0], '--paint-two': color.hex[1] } as CSSProperties}
        >
          {imagePath && (
            <img
              className="paint-image"
              src={imagePath}
              alt={`${color.name} Porsche`}
              loading="lazy"
            />
          )}
        </div>
        <div className="card-body sighting-card-body">
          <span className={`sighting-eyebrow ${rarityClass(color.rarityCategory)}`}>{color.rarityCategory}</span>
          <h3 className="sighting-title">{color.name}</h3>
          {color.historical && <p className="sighting-notes">{color.historical}</p>}
          <div className="sighting-details">
            <span>{color.family}</span>
            <span>{color.code}</span>
            <span>{color.availability}</span>
          </div>
          <div className="card-footer sighting-footer">
            <span className="sighting-points">{color.rarityScore} pts</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function SightingCard({ sighting, color }: { sighting: Sighting; color: PorscheColor }) {
  const photos = getSightingPhotos(sighting)
  return (
    <Link href={`/logbook/${sighting.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="sighting-card">
        <div
          className={`sighting-media${photos.length > 0 ? ' has-photo' : ''}`}
          style={{ '--paint-one': color.hex[0], '--paint-two': color.hex[1] } as CSSProperties}
        >
          <PhotoCarousel photos={photos} altPrefix={`${color.name} sighting`} />
        </div>
        <div className="card-body sighting-card-body">
          <span className={`sighting-eyebrow ${rarityClass(color.rarityCategory)}`}>{color.rarityCategory}</span>
          <h3 className="sighting-title">{color.name}</h3>
          {sighting.notes && <p className="sighting-notes">{sighting.notes}</p>}
          <div className="sighting-details">
            {sighting.model_year && <span>{sighting.model_year} {sighting.model}</span>}
            {!sighting.model_year && sighting.model && <span>{sighting.model}</span>}
            <span>{sighting.location_label}</span>
            <span>{formatDate(sighting.spotted_on)}</span>
          </div>
          <div className="card-footer sighting-footer">
            <span className="sighting-points">{color.rarityScore} pts</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function TimelineList({ items }: { items: ReactNode[] }) {
  return <div className="timeline">{items}</div>
}
