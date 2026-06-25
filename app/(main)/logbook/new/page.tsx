'use server'

import NewSightingForm from './NewSightingForm'

export default async function NewSightingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { color } = await searchParams
  const initialColorSlug = typeof color === 'string' ? color : undefined
  return <NewSightingForm initialColorSlug={initialColorSlug} />
}
