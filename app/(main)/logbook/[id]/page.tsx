import type { CSSProperties } from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { deleteSighting } from '@/app/actions'
import { colorImagePath, getColorBySlug } from '@/lib/colors'
import { formatDate, rarityClass, getSightingPhotos } from '@/lib/app-data'
import { fetchCollectorData } from '@/lib/collector'
import PhotoCarousel from '@/app/(main)/components/PhotoCarousel'

export default async function SightingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const collector = await fetchCollectorData()

  if (!collector) {
    redirect('/login')
  }

  const sighting = collector.sightings.find((entry) => entry.id === id)
  if (!sighting) {
    notFound()
  }

  const color = getColorBySlug(sighting.color_slug)
  if (!color) {
    notFound()
  }

  async function removeSighting() {
    'use server'
    await deleteSighting(id)
  }

  const photos = getSightingPhotos(sighting)
  const heroPhoto = photos[0]?.photo_url ?? colorImagePath(color) ?? '/hero-car.png'

  return (
    <>
      <section
        className="hero"
        style={{
          minHeight: 420,
          '--hero-paint': `linear-gradient(135deg,${color.hex[0]},${color.hex[1]})`,
          '--accent-paint': color.hex[0],
        } as CSSProperties}
      >
        <div className="hero-inner" style={{ minHeight: 420 }}>
          <p className="eyebrow">{formatDate(sighting.spotted_on)} · {sighting.location_label}</p>
          <h1>{color.name}</h1>
          <p>
            {sighting.model}
            {sighting.model_year ? ` · ${sighting.model_year}` : ''} · {color.rarityCategory} · {color.rarityScore} pts
          </p>
          <div className="hero-actions">
            <Link href={`/logbook/${id}/edit`} className="primary-button" style={{ textDecoration: 'none' }}>
              Edit sighting
            </Link>
            <Link href="/logbook" className="ghost-button" style={{ textDecoration: 'none' }}>
              Back to logbook
            </Link>
          </div>
        </div>
        <div className="car-stage" aria-hidden="true">
          <img src={heroPhoto} alt="" />
        </div>
      </section>

      <div className="content-grid grid-2" style={{ marginTop: 22 }}>
        <section>
          <article className="sighting-card">
            <div
              className={`sighting-media${photos.length > 0 ? ' has-photo' : ''}`}
              style={{ '--paint-one': color.hex[0], '--paint-two': color.hex[1] } as CSSProperties}
            >
              <PhotoCarousel photos={photos} altPrefix={`${color.name} sighting`} />
            </div>
            <div className="card-body">
              <div className="meta-row">
                <span className={`rarity-pill ${rarityClass(color.rarityCategory)}`}>{color.rarityCategory}</span>
                <span>{color.code}</span>
                <span>{color.family}</span>
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
                <Link href={`/colors/${color.slug}`} className="ghost-button" style={{ textDecoration: 'none' }}>
                  Color details
                </Link>
              </div>
            </div>
          </article>
        </section>
        <aside className="content-grid">
          <section className="panel">
            <h2>Metadata</h2>
            <table className="table">
              <tbody>
                <tr>
                  <th>Paint code</th>
                  <td>{color.code}</td>
                </tr>
                <tr>
                  <th>Availability</th>
                  <td>{color.availability}</td>
                </tr>
                <tr>
                  <th>Generations</th>
                  <td>{color.generations?.join(', ') ?? '—'}</td>
                </tr>
                <tr>
                  <th>Models</th>
                  <td>{color.models?.join(', ') ?? '—'}</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section className="panel">
            <h2>Notes</h2>
            <p>{sighting.notes ?? 'No notes yet.'}</p>
            <form action={removeSighting}>
              <button type="submit" className="ghost-button" style={{ color: 'var(--red)' }}>
                Delete sighting
              </button>
            </form>
          </section>
        </aside>
      </div>
    </>
  )
}
