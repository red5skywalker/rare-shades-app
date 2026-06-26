import type { User } from '@supabase/supabase-js'
import { COLORS, getColorBySlug, type PorscheColor } from '@/lib/colors'
import { createClient } from '@/lib/supabase/server'

export interface AppUserProfile {
  id: string
  email: string
  username: string
  avatar_initials: string | null
  bio: string | null
  created_at: string
}

export interface Sighting {
  id: string
  user_id: string
  color_slug: string
  color_name: string
  color_family: string
  color_hex: string
  rarity: string
  model: string
  model_year: number | null
  spotted_on: string
  location_label: string
  notes: string | null
  photo_url: string | null
  photo_position: string
  created_at: string
  updated_at: string
}

export interface CollectorStats {
  uniqueColors: PorscheColor[]
  uniqueColorCount: number
  sightingCount: number
  rarityScore: number
  xp: number
  level: number
  nextLevelXp: number
  progressPercent: number
  collectionPercent: number
  streakDays: number
  rarestColor: PorscheColor | null
}

export interface CollectorData {
  user: User
  profile: AppUserProfile | null
  sightings: Sighting[]
  stats: CollectorStats
}

export function formatDate(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function rarityClass(rarity: string): string {
  return `rarity-${rarity.toLowerCase().replace(/\s+/g, '-')}`
}

export function buildDisplayIdentity(user: User, profile: AppUserProfile | null) {
  const emailPrefix = user.email?.split('@')[0] ?? 'collector'
  const username = profile?.username || emailPrefix
  const avatarInitials = profile?.avatar_initials || username.slice(0, 2).toUpperCase() || 'RS'
  return { username, avatarInitials }
}

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
  const nextLevelXp = Math.pow(level, 2) * 110
  const progressPercent = Math.min(100, Math.round((xp / nextLevelXp) * 100))
  const collectionPercent = Math.round((uniqueColors.length / COLORS.length) * 100)
  const rarestColor = uniqueColors.slice().sort((a, b) => b.rarityScore - a.rarityScore)[0] ?? null

  const dates = [...new Set(sightings.map((sighting) => sighting.spotted_on))].sort().reverse()
  let streakDays = 0
  if (dates.length) {
    streakDays = 1
    const cursor = new Date(`${dates[0]}T00:00:00`)
    for (let index = 1; index < dates.length; index += 1) {
      cursor.setDate(cursor.getDate() - 1)
      const expected = cursor.toISOString().slice(0, 10)
      if (dates[index] !== expected) break
      streakDays += 1
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

export async function fetchCollectorData(): Promise<CollectorData | null> {
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
      .select('*')
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
}
