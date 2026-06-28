import type { Metadata } from 'next'
import NewSightingForm from './NewSightingForm'

export const metadata: Metadata = { title: 'Log a Sighting — Rare Shades' }

export default async function NewSightingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { color } = await searchParams
  const initialColorSlug = typeof color === 'string' ? color : undefined
  return <NewSightingForm initialColorSlug={initialColorSlug} />
}
