import type { CSSProperties } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { COLORS, colorImagePath, getColorBySlug } from '@/lib/colors'
import { buildDisplayIdentity, formatDate } from '@/lib/app-data'
import { fetchCollectorData } from '@/lib/collector'
import { ColorCard, EmptyState, StatCard, TimelineList } from '@/app/(main)/components/MainUi'

export default async function CollectionPage() {
  const collector = await fetchCollectorData()

  if (!collector) {
    redirect('/login')
  }

  const { username } = buildDisplayIdentity(collector.user, collector.profile)
  const { stats, sightings } = collector
  const heroColor = stats.rarestColor ?? getColorBySlug('guards-red')!

  return (
    <>
      <section
        className="hero"
        style={{
          '--hero-paint': `linear-gradient(135deg,${heroColor.hex[0]},${heroColor.hex[1]})`,
          '--accent-paint': heroColor.hex[0],
        } as CSSProperties}
      >
        <div className="hero-inner">
          <p className="eyebrow">Personal archive</p>
          <h1>Collection</h1>
          <p>
            {username} has discovered {stats.uniqueColorCount} colors, with {COLORS.length - stats.uniqueColorCount} left to find and a{' '}
            {stats.collectionPercent}% completion rate.
          </p>
          <div className="hero-actions">
            <Link href="/logbook/new" className="primary-button" style={{ textDecoration: 'none' }}>
              Add sighting
            </Link>
            <Link href="/colors" className="ghost-button" style={{ textDecoration: 'none' }}>
              Browse archive
            </Link>
          </div>
        </div>
        <div className="car-stage" aria-hidden="true">
          <img src={colorImagePath(heroColor) ?? '/hero-car.png'} alt="" />
        </div>
      </section>

      <div className="kpi-strip">
        <StatCard label="Colors spotted" value={stats.uniqueColorCount} detail={`${stats.collectionPercent}% complete`} accent="rgba(213,0,28,.25)" />
        <StatCard label="Rarity score" value={stats.rarityScore} detail="Unique color points" accent="rgba(247,197,49,.25)" />
        <StatCard label="Sightings logged" value={stats.sightingCount} detail="Journal entries" accent="rgba(70,163,255,.22)" />
        <StatCard label="Current level" value={stats.level} detail={`${stats.xp} XP total`} accent="rgba(31,208,143,.2)" />
      </div>

      <div className="content-grid grid-2">
        <section className="panel">
          <div className="section-head">
            <div>
              <h2>Color Deck</h2>
              <p>A concise view of the shades already in your archive.</p>
            </div>
          </div>
          <div className="color-grid">
            {stats.uniqueColors.length > 0 ? (
              stats.uniqueColors.map((color) => <ColorCard key={color.slug} color={color} />)
            ) : (
              <EmptyState title="No colors collected" body="Add your first sighting to start building the deck." />
            )}
          </div>
        </section>
        <aside className="content-grid">
          <section className="panel">
            <h2>Timeline</h2>
            {sightings.length > 0 ? (
              <TimelineList
                items={sightings.map((sighting) => {
                  const color = getColorBySlug(sighting.color_slug)
                  return (
                    <div className="timeline-item" key={sighting.id}>
                      <span className="timeline-date">{formatDate(sighting.spotted_on)}</span>
                      <span>
                        <strong>{color?.name ?? sighting.color_name}</strong>
                        <br />
                        <span style={{ color: 'var(--muted)' }}>
                          {sighting.model} · {sighting.location_label}
                        </span>
                      </span>
                    </div>
                  )
                })}
              />
            ) : (
              <EmptyState title="No timeline yet" body="Sightings appear here as soon as you start logging them." />
            )}
          </section>
        </aside>
      </div>
    </>
  )
}
