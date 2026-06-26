import type { CSSProperties } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { COLORS, colorImagePath, getColorBySlug } from '@/lib/colors'
import { buildDisplayIdentity } from '@/lib/app-data'
import { fetchCollectorData } from '@/lib/collector'
import { EmptyState, SightingCard, StatCard } from '@/app/(main)/components/MainUi'

export default async function LogbookPage() {
  const collector = await fetchCollectorData()

  if (!collector) {
    redirect('/login')
  }

  const { username } = buildDisplayIdentity(collector.user, collector.profile)
  const { sightings, stats } = collector
  const rarest = stats.rarestColor ?? getColorBySlug('riviera-blue')!
  const collected = new Set(sightings.map((sighting) => sighting.color_slug))
  const trendingColors = COLORS
    .filter((color) => !collected.has(color.slug))
    .sort((a, b) => b.rarityScore - a.rarityScore)
    .slice(0, 4)
  const recentSightings = sightings.slice(0, 6)

  return (
    <>
      <section
        className="hero"
        style={{
          '--hero-paint': `linear-gradient(135deg,${rarest.hex[0]},${rarest.hex[1]})`,
          '--accent-paint': rarest.hex[0],
        } as CSSProperties}
      >
        <div className="hero-inner">
          <p className="eyebrow">Your collection · {stats.uniqueColorCount} colors found</p>
          <h1>{username}</h1>
          <p>
            Your archive is {stats.collectionPercent}% complete. The rarest shade is {rarest.name}, worth{' '}
            {rarest.rarityScore} points.
          </p>
          <div className="hero-actions">
            <Link href="/logbook/new" className="primary-button" style={{ textDecoration: 'none' }}>
              Add today&apos;s spot
            </Link>
            <Link href="/collection" className="ghost-button" style={{ textDecoration: 'none' }}>
              View collection
            </Link>
          </div>
        </div>
        <div className="car-stage" aria-hidden="true">
          <img src={colorImagePath(rarest) ?? '/hero-car.png'} alt="" />
        </div>
      </section>

      <div className="kpi-strip">
        <StatCard
          label="Colors spotted"
          value={stats.uniqueColorCount}
          detail={`${stats.collectionPercent}% of archive`}
          accent="rgba(213,0,28,.25)"
        />
        <StatCard
          label="Rarity score"
          value={stats.rarityScore}
          detail="Cumulative points"
          accent="rgba(247,197,49,.25)"
        />
        <StatCard
          label="Total sightings"
          value={stats.sightingCount}
          detail="All time entries"
          accent="rgba(70,163,255,.22)"
        />
        <StatCard
          label="Rarest color"
          value={stats.rarestColor?.name ?? 'None yet'}
          detail={stats.rarestColor ? `${stats.rarestColor.rarityCategory} · ${stats.rarestColor.rarityScore} pts` : 'Start spotting'}
          accent="rgba(31,208,143,.2)"
        />
      </div>

      <div className="content-grid grid-2">
        <section className="panel">
          <div className="section-head">
            <div>
              <h2>Recent Sightings</h2>
              <p>The last six entries from your spotting journal.</p>
            </div>
            <Link href="/logbook/new" className="ghost-button" style={{ textDecoration: 'none' }}>
              Add sighting
            </Link>
          </div>
          <div className="sighting-grid">
            {recentSightings.length > 0 ? (
              recentSightings.map((sighting) => {
                const color = getColorBySlug(sighting.color_slug)
                return color ? <SightingCard key={sighting.id} sighting={sighting} color={color} /> : null
              })
            ) : (
              <EmptyState title="No sightings yet" body="Start logging Porsche paint finds to build your archive." />
            )}
          </div>
        </section>
        <aside className="content-grid">
          <section className="panel">
            <div className="section-head">
              <div>
                <h2>Trending Colors</h2>
                <p>The rarest shades still missing from your collection.</p>
              </div>
            </div>
            <div className="content-grid">
              {trendingColors.map((color) => (
                <Link
                  key={color.slug}
                  href={`/colors/${color.slug}`}
                  className="nav-link"
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <span>
                    <strong>{color.name}</strong>
                    <span style={{ display: 'block', color: 'var(--muted)', fontSize: 12 }}>
                      {color.code} · {color.family}
                    </span>
                  </span>
                  <span className={`rarity-pill rarity-${color.rarityCategory.toLowerCase().replace(/ /g, '-')}`}>
                    {color.rarityCategory}
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <section className="panel">
            <h2>Collector Progress</h2>
            <p>
              Level {stats.level} with {stats.xp} XP and a {stats.streakDays}-day spotting streak.
            </p>
            <div className="progress-track">
              <div className="progress-fill" style={{ '--progress': `${stats.progressPercent}%` } as CSSProperties} />
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}
