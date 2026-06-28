import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildDisplayIdentity, formatDate } from '@/lib/app-data'
import { fetchCollectorData } from '@/lib/collector'
import { EmptyState, TimelineList } from '@/app/(main)/components/MainUi'
import ProfileEditForm from './ProfileEditForm'

export const metadata: Metadata = { title: 'Profile — Rare Shades' }

export default async function ProfilePage() {
  const collector = await fetchCollectorData()

  if (!collector) {
    redirect('/login')
  }

  const { username, avatarInitials } = buildDisplayIdentity(collector.user, collector.profile)
  const { sightings, stats, profile } = collector
  const joined = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'

  return (
    <section>
      <div className="profile-banner">
        <div className="profile-cover" />
        <div className="profile-details">
          <span className="avatar profile-avatar">{avatarInitials}</span>
          <div>
            <p className="eyebrow">Joined {joined}</p>
            <h1 style={{ fontSize: 48, marginBottom: 6 }}>{username}</h1>
            <p>{profile?.bio || 'Collector profile ready for your next rare Porsche paint discovery.'}</p>
            <div className="meta-row">
              <span className="points">{stats.rarityScore} pts</span>
              <span>Level {stats.level}</span>
              <span>{stats.uniqueColorCount} colors</span>
              <span>{stats.sightingCount} sightings</span>
            </div>
          </div>
        </div>
      </div>
      <div className="content-grid grid-2" style={{ marginTop: 20 }}>
        <section className="panel">
          <h2>Recent Sightings Timeline</h2>
          {sightings.length > 0 ? (
            <TimelineList
              items={sightings.map((sighting) => (
                <div className="timeline-item" key={sighting.id}>
                  <span className="timeline-date">{formatDate(sighting.spotted_on)}</span>
                  <span>
                    <strong>{sighting.color_name}</strong>
                    <br />
                    <span style={{ color: 'var(--muted)' }}>
                      {sighting.model}
                      {sighting.model_year ? ` · ${sighting.model_year}` : ''} · {sighting.location_label}
                    </span>
                  </span>
                </div>
              ))}
            />
          ) : (
            <EmptyState title="No sightings yet" body="Your public-facing profile comes to life as you add entries." />
          )}
        </section>
        <ProfileEditForm profile={profile} username={username} avatarInitials={avatarInitials} />
      </div>
    </section>
  )
}
