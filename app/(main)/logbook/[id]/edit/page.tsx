import { notFound, redirect } from 'next/navigation'
import { fetchCollectorData } from '@/lib/collector'
import EditSightingForm from './EditSightingForm'

export default async function EditSightingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const collector = await fetchCollectorData()

  if (!collector) {
    redirect('/login')
  }

  const sighting = collector.sightings.find((entry) => entry.id === id)
  if (!sighting) {
    notFound()
  }

  return <EditSightingForm sighting={sighting} />
}
