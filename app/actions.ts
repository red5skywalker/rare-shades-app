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

  const photoFile = formData.get('photo') as File | null
  const photoPosition = (formData.get('photo_position') as string) || '50% 50%'
  if (photoFile && photoFile.size > 0) {
    const ext = photoFile.type.split('/')[1] || 'jpg'
    const path = `${user.id}/${inserted.id}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('sighting-photos')
      .upload(path, photoFile)
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('sighting-photos').getPublicUrl(path)
      await supabase.from('sighting').update({ photo_url: publicUrl, photo_position: photoPosition }).eq('id', inserted.id)
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
    .select('id, photo_url, photo_position')
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
  const removePhoto = formData.get('remove_photo') === 'true'

  if (!model || !spottedOn || !locationLabel) {
    return { error: 'Model, date, and location are required.' }
  }

  let photoUrl: string | null = existing.photo_url ?? null
  let photoPosition: string = (existing as { photo_position?: string }).photo_position ?? '50% 50%'
  if (removePhoto) {
    photoUrl = null
    photoPosition = '50% 50%'
  } else {
    const incomingPosition = (formData.get('photo_position') as string) || '50% 50%'
    photoPosition = incomingPosition
    const photoFile = formData.get('photo') as File | null
    if (photoFile && photoFile.size > 0) {
      const ext = photoFile.type.split('/')[1] || 'jpg'
      const path = `${user.id}/${id}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('sighting-photos')
        .upload(path, photoFile, { upsert: true })
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('sighting-photos').getPublicUrl(path)
        photoUrl = publicUrl
      }
    }
  }

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
      photo_url: photoUrl,
      photo_position: photoPosition,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

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
