import { cache } from 'react'
import type { User } from '@supabase/supabase-js'
import { COLORS, getColorBySlug, type PorscheColor } from '@/lib/colors'
import { createClient } from '@/lib/supabase/server'
import type { AppUserProfile, Sighting, CollectorStats, CollectorData } from '@/lib/app-data'

export function computeCollectorStats(sightings: Sighting[]): CollectorStats {
  const seen = new Set<string>()
  const uniqueColors = sightings
    .map((sighting) => getColorBySlug(sighting.color_slug))
    .filter((color): color is PorscheColor => Boolean(color))
    .filter((color) => {
      if (seen.has(color.slug)) return false
      seen.add(color.slug)
      return true
    })

  const rarityScore = uniqueColors.reduce((sum, color) => sum + color.rarityScore, 0)
  const sightingCount = sightings.length
  const xp = rarityScore + sightingCount * 25
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 110)) + 1)
  const currentLevelXp = Math.pow(level - 1, 2) * 110
  const nextLevelXp = Math.pow(level, 2) * 110
  const progressPercent = Math.min(100, Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100))
  const collectionPercent = Math.round((uniqueColors.length / COLORS.length) * 100)
  const rarestColor = uniqueColors.slice().sort((a, b) => b.rarityScore - a.rarityScore)[0] ?? null

  const dates = [...new Set(sightings.map((sighting) => sighting.spotted_on))].sort().reverse()
  let streakDays = 0
  if (dates.length) {
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10)
    if (dates[0] === today || dates[0] === yesterday) {
      streakDays = 1
      const cursor = new Date(`${dates[0]}T00:00:00`)
      for (let index = 1; index < dates.length; index += 1) {
        cursor.setDate(cursor.getDate() - 1)
        const expected = cursor.toISOString().slice(0, 10)
        if (dates[index] !== expected) break
        streakDays += 1
      }
    }
  }

  return {
    uniqueColors,
    uniqueColorCount: uniqueColors.length,
    sightingCount,
    rarityScore,
    xp,
    level,
    nextLevelXp,
    progressPercent,
    collectionPercent,
    streakDays,
    rarestColor,
  }
}

export const fetchSighting = cache(async function fetchSighting(id: string): Promise<Sighting | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('sighting')
    .select('*, sighting_photo(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  return (data as Sighting | null) ?? null
})

export const fetchCollectorData = cache(async function fetchCollectorData(): Promise<CollectorData | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [{ data: profile }, { data: sightings }] = await Promise.all([
    supabase
      .from('app_user')
      .select('id, email, username, avatar_initials, bio, created_at')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('sighting')
      .select('*, sighting_photo(*)')
      .eq('user_id', user.id)
      .order('spotted_on', { ascending: false })
      .order('created_at', { ascending: false }),
  ])

  const typedSightings = (sightings ?? []) as Sighting[]

  return {
    user,
    profile: (profile as AppUserProfile | null) ?? null,
    sightings: typedSightings,
    stats: computeCollectorStats(typedSightings),
  }
})
