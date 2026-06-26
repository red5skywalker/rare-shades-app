'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getColorBySlug } from '@/lib/colors'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/logbook')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Check your email to confirm your account.' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function createSighting(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const colorSlug = formData.get('color_slug') as string
  const color = getColorBySlug(colorSlug)
  if (!color) return { error: 'Invalid color selected.' }

  const model = formData.get('model') as string
  const modelYear = formData.get('model_year') ? parseInt(formData.get('model_year') as string) : null
  const spottedOn = formData.get('spotted_on') as string
  const locationLabel = formData.get('location_label') as string
  const notes = (formData.get('notes') as string) || null

  if (!model || !spottedOn || !locationLabel) {
    return { error: 'Model, date, and location are required.' }
  }

  const { data: inserted, error } = await supabase.from('sighting').insert({
    user_id: user.id,
    color_slug: colorSlug,
    color_name: color.name,
    color_family: color.family,
    color_hex: color.hex[0],
    rarity: color.rarityCategory,
    model,
    model_year: modelYear,
    spotted_on: spottedOn,
    location_label: locationLabel,
    notes,
  }).select('id').single()

  if (error) return { error: error.message }

  // Upload up to 3 photos into sighting_photo table
  for (let i = 0; i < 3; i++) {
    const photoFile = formData.get(`photo_${i}`) as File | null
    if (!photoFile || photoFile.size === 0) continue
    const position = (formData.get(`photo_${i}_position`) as string) || '50% 50%'
    const scale = parseFloat((formData.get(`photo_${i}_scale`) as string) || '1') || 1
    const ext = photoFile.type.split('/')[1] || 'jpg'
    const path = `${user.id}/${inserted.id}_${i}.${ext}`
    const { error: uploadError } = await supabase.storage.from('sighting-photos').upload(path, photoFile)
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('sighting-photos').getPublicUrl(path)
      await supabase.from('sighting_photo').insert({
        sighting_id: inserted.id,
        photo_url: publicUrl,
        photo_position: position,
        photo_scale: scale,
        sort_order: i,
      })
    }
  }

  revalidatePath('/logbook')
  redirect('/logbook')
}

export async function updateSighting(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existing } = await supabase
    .from('sighting')
    .select('id, photo_url')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!existing) return { error: 'Sighting not found.' }

  const colorSlug = formData.get('color_slug') as string
  const color = getColorBySlug(colorSlug)
  if (!color) return { error: 'Invalid color selected.' }

  const model = formData.get('model') as string
  const modelYear = formData.get('model_year') ? parseInt(formData.get('model_year') as string) : null
  const spottedOn = formData.get('spotted_on') as string
  const locationLabel = formData.get('location_label') as string
  const notes = (formData.get('notes') as string) || null

  if (!model || !spottedOn || !locationLabel) {
    return { error: 'Model, date, and location are required.' }
  }

  // Update sighting row (no photo fields — those live in sighting_photo)
  const { error } = await supabase
    .from('sighting')
    .update({
      color_slug: colorSlug,
      color_name: color.name,
      color_family: color.family,
      color_hex: color.hex[0],
      rarity: color.rarityCategory,
      model,
      model_year: modelYear,
      spotted_on: spottedOn,
      location_label: locationLabel,
      notes,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  // Delete photos the user removed
  const deletePhotoIdsRaw = (formData.get('delete_photo_ids') as string) || ''
  const deletePhotoIds = deletePhotoIdsRaw.split(',').filter(Boolean)
  if (deletePhotoIds.length > 0) {
    await supabase.from('sighting_photo').delete().in('id', deletePhotoIds)
  }

  // Update position/scale on kept existing photos
  const { data: keptPhotos } = await supabase
    .from('sighting_photo')
    .select('id, photo_position, photo_scale')
    .eq('sighting_id', id)
  for (const photo of keptPhotos ?? []) {
    const position = (formData.get(`existing_${photo.id}_position`) as string) || photo.photo_position
    const scale = parseFloat((formData.get(`existing_${photo.id}_scale`) as string) || String(photo.photo_scale)) || photo.photo_scale
    await supabase.from('sighting_photo').update({ photo_position: position, photo_scale: scale }).eq('id', photo.id)
  }

  // Upload new photos
  const currentCount = (keptPhotos?.length ?? 0)
  for (let i = 0; i < 3; i++) {
    const photoFile = formData.get(`new_photo_${i}`) as File | null
    if (!photoFile || photoFile.size === 0) continue
    const position = (formData.get(`new_photo_${i}_position`) as string) || '50% 50%'
    const scale = parseFloat((formData.get(`new_photo_${i}_scale`) as string) || '1') || 1
    const ext = photoFile.type.split('/')[1] || 'jpg'
    const path = `${user.id}/${id}_new_${Date.now()}_${i}.${ext}`
    const { error: uploadError } = await supabase.storage.from('sighting-photos').upload(path, photoFile)
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('sighting-photos').getPublicUrl(path)
      await supabase.from('sighting_photo').insert({
        sighting_id: id,
        photo_url: publicUrl,
        photo_position: position,
        photo_scale: scale,
        sort_order: currentCount + i,
      })
    }
  }

  revalidatePath('/logbook')
  redirect(`/logbook/${id}`)
}

export async function deleteSighting(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('sighting')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/logbook')
  redirect('/logbook')
}
