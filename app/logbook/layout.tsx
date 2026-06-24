import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions'

export default async function LogbookLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const email = user?.email ?? ''
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 1.25rem', height: 56, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Logo */}
          <Link href="/logbook" style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            color: 'var(--accent)',
            fontWeight: 700,
            textTransform: 'uppercase',
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            Rare Shades
          </Link>

          <div style={{ flex: 1 }} />

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Link href="/logbook" style={navLinkStyle}>
              Logbook
            </Link>
            <Link href="/logbook/new" style={{
              ...navLinkStyle,
              background: 'var(--accent)',
              color: '#000',
              fontWeight: 700,
              padding: '0.375rem 0.875rem',
            }}>
              + Spotting
            </Link>

            {/* Avatar / sign out */}
            <form action={logout} style={{ marginLeft: '0.5rem' }}>
              <button
                type="submit"
                title={`Sign out (${email})`}
                style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {initials}
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, maxWidth: 960, width: '100%', margin: '0 auto', padding: '2rem 1.25rem' }}>
        {children}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-muted)', padding: '1.5rem 1.25rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.1em' }}>
          RARE SHADES
        </span>
      </footer>
    </div>
  )
}

const navLinkStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textDecoration: 'none',
  padding: '0.375rem 0.75rem',
  borderRadius: 6,
  transition: 'color 0.15s',
  border: '1px solid transparent',
}
