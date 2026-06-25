'use client'

import { useState, useRef, useEffect } from 'react'
import { COLORS, type PorscheColor } from '@/lib/colors'

interface ColorPickerProps {
  initialSlug?: string
  name?: string
}

export default function ColorPicker({ initialSlug, name = 'color_slug' }: ColorPickerProps) {
  const initial = initialSlug ? COLORS.find((c) => c.slug === initialSlug) ?? null : null
  const [query, setQuery] = useState(initial ? `${initial.name}${initial.code ? ` — ${initial.code}` : ''}` : '')
  const [slug, setSlug] = useState(initialSlug ?? '')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const results: PorscheColor[] = query.trim()
    ? COLORS.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          (c.code ?? '').toLowerCase().includes(query.toLowerCase()) ||
          c.family.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : COLORS.slice(0, 12)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(color: PorscheColor) {
    setSlug(color.slug)
    setQuery(`${color.name}${color.code ? ` — ${color.code}` : ''}`)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[highlighted]) select(results[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="color-picker" ref={containerRef}>
      <input
        type="text"
        placeholder="Search by name or paint code…"
        value={query}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        onChange={(e) => {
          setQuery(e.target.value)
          setSlug('')
          setHighlighted(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <input type="hidden" name={name} value={slug} />
      {open && (
        <ul className="color-picker-dropdown" role="listbox">
          {results.length === 0 ? (
            <li className="color-picker-empty">No colors match &ldquo;{query}&rdquo;</li>
          ) : (
            results.map((color, i) => (
              <li
                key={color.slug}
                className={`color-picker-option${i === highlighted ? ' highlighted' : ''}`}
                role="option"
                aria-selected={color.slug === slug}
                onMouseDown={() => select(color)}
                onMouseEnter={() => setHighlighted(i)}
              >
                <span className="color-picker-swatch" style={{ background: color.hex[0] }} />
                <span className="color-picker-label">
                  <strong>{color.name}</strong>
                  <span>{color.code ? `${color.code} · ` : ''}{color.rarityCategory}</span>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
