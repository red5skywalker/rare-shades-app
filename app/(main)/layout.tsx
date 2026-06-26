import type { CSSProperties, ReactNode } from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions'
import { buildDisplayIdentity } from '@/lib/app-data'
import { fetchCollectorData } from '@/lib/collector'
import NavRail from './components/NavRail'
import SearchBar from './components/SearchBar'
import MobileMenuButton from './components/MobileMenuButton'

function SearchFallback() {
  return (
    <input
      type="search"
      placeholder="Search paint, code, model, year"
      aria-label="Search paint, code, model, year"
      defaultValue=""
      readOnly
    />
  )
}

export default async function MainLayout({ children }: { children: ReactNode }) {
  const collector = await fetchCollectorData()

  if (!collector) {
    redirect('/login')
  }

  const { username, avatarInitials } = buildDisplayIdentity(collector.user, collector.profile)
  const { level, rarityScore, progressPercent } = collector.stats

  return (
    <div className="app-shell">
      <aside className="rail">
        <Link href="/logbook" className="brand">
          <span className="brand-mark">RS</span>
          <span>
            <strong>Rare Shades</strong>
            <small>Paint archive</small>
          </span>
        </Link>
        <NavRail />
        <Link
          href="/logbook/new"
          className="nav-action"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44 }}
        >
          Add sighting
        </Link>
        <div className="mini-profile">
          <div className="mini-profile-row">
            <span className="avatar">{avatarInitials}</span>
            <span>
              <strong>{username}</strong>
              <span>Level {level} · {rarityScore} pts</span>
            </span>
          </div>
          <div className="progress-track" style={{ marginTop: 12 }}>
            <div className="progress-fill" style={{ '--progress': `${progressPercent}%` } as CSSProperties} />
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <MobileMenuButton />
          <div className="search-wrap">
            <Suspense fallback={<SearchFallback />}>
              <SearchBar />
            </Suspense>
          </div>
          <div className="topbar-actions">
            <form action={logout}>
              <button type="submit" className="ghost-button">
                Sign out
              </button>
            </form>
          </div>
        </header>
        <section className="view">{children}</section>
      </main>
    </div>
  )
}
