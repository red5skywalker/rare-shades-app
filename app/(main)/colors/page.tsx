import type { Metadata } from 'next'
import { Suspense } from 'react'
import { COLORS } from '@/lib/colors'
import ColorFilters from '@/app/(main)/components/ColorFilters'
import { ColorCard, EmptyState } from '@/app/(main)/components/MainUi'

export const metadata: Metadata = { title: 'Archive — Rare Shades' }

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ColorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; family?: string | string[]; rarity?: string | string[] }>
}) {
  const params = await searchParams
  const query = firstValue(params.q)?.toLowerCase().trim() ?? ''
  const family = firstValue(params.family) ?? 'All'
  const rarity = firstValue(params.rarity) ?? 'All'

  const filteredColors = COLORS.filter((color) => {
    const matchesQuery = !query || [
      color.name,
      color.code ?? '',
      color.family,
      color.availability ?? '',
      color.historical ?? '',
      (color.models ?? []).join(' '),
      (color.generations ?? []).join(' '),
    ].some((value) => value.toLowerCase().includes(query))

    if (!matchesQuery) return false
    if (family !== 'All' && color.family !== family) return false
    if (rarity !== 'All' && color.rarityCategory !== rarity) return false
    return true
  })

  const families = ['All', ...new Set(COLORS.map((color) => color.family))].sort((a, b) => (a === 'All' ? -1 : a.localeCompare(b)))
  const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Legendary']

  return (
    <section>
      <div className="section-head archive-head">
        <div>
          <p className="eyebrow">Paint catalogue</p>
          <h1 style={{ fontSize: 48 }}>Color Archive</h1>
          <p>
            {filteredColors.length} of {COLORS.length} colors shown. Filter by paint name, code, model, year, rarity,
            or family.
          </p>
        </div>
      </div>
      <div className="archive-layout">
        <Suspense fallback={<div className="filter-panel" aria-hidden="true" />}>
          <ColorFilters families={families} rarities={rarities} />
        </Suspense>
        <div className="archive-results">
          <div className="color-grid">
            {filteredColors.length > 0 ? (
              filteredColors.map((color) => <ColorCard key={color.slug} color={color} />)
            ) : (
              <EmptyState title="No matching colors" body="Try a broader search or clear the current filters." />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
