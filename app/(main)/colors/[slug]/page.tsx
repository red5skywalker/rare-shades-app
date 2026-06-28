import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { colorImagePath, getColorBySlug } from '@/lib/colors'
import { fetchCollectorData } from '@/lib/collector'
import { EmptyState, SightingCard } from '@/app/(main)/components/MainUi'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const color = getColorBySlug(slug)
  return { title: color ? `${color.name} — Rare Shades` : 'Color — Rare Shades' }
}

export default async function ColorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const color = getColorBySlug(slug)

  if (!color) {
    notFound()
  }

  const collector = await fetchCollectorData()

  if (!collector) {
    redirect('/login')
  }

  const matchingSightings = collector.sightings.filter((sighting) => sighting.color_slug === color.slug)
  const imagePath = colorImagePath(color)

  return (
    <>
      <section
        className="hero"
        style={{
          minHeight: 480,
          '--hero-paint': `linear-gradient(135deg,${color.hex[0]},${color.hex[1]})`,
          '--accent-paint': color.hex[0],
        } as CSSProperties}
      >
        <div className="hero-inner" style={{ minHeight: 480 }}>
          <p className="eyebrow">
            {color.rarityCategory} · {color.rarityScore} rarity points
          </p>
          <h1>{color.name}</h1>
          <p>{color.historical}</p>
          <div className="hero-actions">
            <Link href={`/logbook/new?color=${color.slug}`} className="primary-button" style={{ textDecoration: 'none' }}>
              Log this color
            </Link>
            <Link href="/colors" className="ghost-button" style={{ textDecoration: 'none' }}>
              Back to archive
            </Link>
          </div>
        </div>
        <div className="car-stage" aria-hidden="true">
          <img src={imagePath ?? '/hero-car.png'} alt="" />
        </div>
      </section>

      <div className="content-grid grid-2" style={{ marginTop: 22 }}>
        <section className="color-photo-panel" style={{ '--paint-one': color.hex[0], '--paint-two': color.hex[1] } as CSSProperties}>
          {imagePath ? (
            <img className="detail-color-image" src={imagePath} alt={`${color.name} Porsche`} />
          ) : (
            <div className="detail-color-fallback">
              <span>{color.name}</span>
            </div>
          )}
        </section>
        <section className="panel">
          <h2>Metadata</h2>
          <table className="table">
            <tbody>
              <tr>
                <th>Paint code</th>
                <td>{color.code}</td>
              </tr>
              <tr>
                <th>Family</th>
                <td>{color.family}</td>
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
        <section className="panel detail-sightings">
          <h2>Your Sightings of {color.name}</h2>
          <div className="sighting-grid">
            {matchingSightings.length > 0 ? (
              matchingSightings.map((sighting) => <SightingCard key={sighting.id} sighting={sighting} color={color} />)
            ) : (
              <EmptyState title="Not collected yet" body="Add a sighting when you encounter this color in the wild." />
            )}
          </div>
        </section>
      </div>
    </>
  )
}
