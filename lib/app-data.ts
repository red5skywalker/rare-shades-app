import type { User } from '@supabase/supabase-js'
import { type PorscheColor } from '@/lib/colors'

export interface AppUserProfile {
  id: string
  email: string
  username: string
  avatar_initials: string | null
  bio: string | null
  created_at: string
}

export interface SightingPhoto {
  id: string
  sighting_id: string
  photo_url: string
  photo_position: string
  photo_scale: number
  sort_order: number
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
  photo_scale: number
  sighting_photo: SightingPhoto[]
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

/** Returns the ordered photos for a sighting, with legacy photo_url fallback. */
export function getSightingPhotos(sighting: Sighting): SightingPhoto[] {
  if (sighting.sighting_photo && sighting.sighting_photo.length > 0) {
    return [...sighting.sighting_photo].sort((a, b) => a.sort_order - b.sort_order)
  }
  if (sighting.photo_url) {
    return [{
      id: 'legacy',
      sighting_id: sighting.id,
      photo_url: sighting.photo_url,
      photo_position: sighting.photo_position ?? '50% 50%',
      photo_scale: sighting.photo_scale ?? 1,
      sort_order: 0,
    }]
  }
  return []
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
