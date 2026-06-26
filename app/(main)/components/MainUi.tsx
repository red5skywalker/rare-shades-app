import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { colorImagePath, type PorscheColor } from '@/lib/colors'
import { formatDate, rarityClass, type Sighting } from '@/lib/app-data'

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
          <span className={`rarity-pill ${rarityClass(color.rarityCategory)}`}>{color.rarityCategory}</span>
        </div>
        <div className="card-body">
          <div className="meta-row">
            <span className="family-pill">{color.family}</span>
            <span>{color.code}</span>
            <span>{color.availability}</span>
          </div>
          <h3 style={{ marginTop: 10 }}>{color.name}</h3>
          <p>{color.historical}</p>
          <div className="card-footer">
            <span className="points">{color.rarityScore} pts</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function SightingCard({ sighting, color }: { sighting: Sighting; color: PorscheColor }) {
  return (
    <Link href={`/logbook/${sighting.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="sighting-card">
        <div
          className={`sighting-media${sighting.photo_url ? ' has-photo' : ''}`}
          style={{ '--paint-one': color.hex[0], '--paint-two': color.hex[1] } as CSSProperties}
        >
          {sighting.photo_url && (
            <img
              src={sighting.photo_url}
              alt={`${color.name} sighting`}
              style={{ objectPosition: sighting.photo_position ?? '50% 50%' }}
            />
          )}
        </div>
        <div className="card-body">
          <div className="meta-row">
            <span className={`rarity-pill ${rarityClass(color.rarityCategory)}`}>{color.rarityCategory}</span>
          </div>
          <h3 style={{ marginTop: 10 }}>{color.name}</h3>
          <p>{sighting.notes ?? 'No notes yet.'}</p>
          <div className="meta-row">
            <span>{sighting.model}</span>
            <span>{sighting.model_year ?? ''}</span>
            <span>{sighting.location_label}</span>
            <span>{formatDate(sighting.spotted_on)}</span>
          </div>
          <div className="card-footer" style={{ marginTop: 14 }}>
            <span className="points">{color.rarityScore} pts</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function TimelineList({ items }: { items: ReactNode[] }) {
  return <div className="timeline">{items}</div>
}
