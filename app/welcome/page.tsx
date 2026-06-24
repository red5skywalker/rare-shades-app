import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Logo */}
        <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3rem' }}>
          Rare Shades
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.75rem' }}>
          Your logbook<br />is ready.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '3rem' }}>
          Rare Shades helps you track every interesting Porsche paint color you spot in the wild. Here&apos;s how to get started.
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { n: '01', title: 'Spot a Porsche', body: 'Notice a Porsche with an interesting or unusual paint color? That\'s your cue.' },
            { n: '02', title: 'Tap + New Spotting', body: 'Hit the button in the top nav. It takes under a minute to log a sighting.' },
            { n: '03', title: 'Pick the color', body: 'Browse 35+ authentic Porsche paint codes from Common to Legendary. Tap the swatch that matches.' },
            { n: '04', title: 'Add the details', body: 'Model, year, location, and any notes. Date defaults to today. Save and it\'s in your logbook forever.' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0,
                width: 36, height: 36,
                borderRadius: 8,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--accent)',
                letterSpacing: '0.05em',
              }}>
                {step.n}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{step.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Rarity guide */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Rarity Scale
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { label: 'Common', color: '#9ca3af' },
              { label: 'Uncommon', color: '#60a5fa' },
              { label: 'Rare', color: '#10b981' },
              { label: 'Ultra Rare', color: '#a78bfa' },
              { label: 'Legendary', color: '#f59e0b' },
            ].map(r => (
              <span key={r.label} style={{
                fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: r.color,
                background: r.color + '22',
                padding: '0.2rem 0.6rem',
                borderRadius: 4,
              }}>
                {r.label}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link href="/logbook/new" className="btn-primary" style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '0.9375rem', letterSpacing: '0.02em' }}>
          Log Your First Spotting →
        </Link>
        <Link href="/logbook" style={{ display: 'block', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', padding: '0.5rem' }}>
          Go to my logbook
        </Link>
      </div>
    </div>
  )
}
