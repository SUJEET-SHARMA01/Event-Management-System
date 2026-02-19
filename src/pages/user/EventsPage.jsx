import { useState, useMemo } from 'react'
import { useEvents } from '../../context/EventsContext'
import EventCard from '../../components/EventCard'
import Loading, { LoadingCard } from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

export default function EventsPage() {
  const { events, loading } = useEvents()
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      events.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase())
      ),
    [events, search]
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="mt-1 text-gray-600">Find and book your next experience.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="mt-1 text-gray-600">Find and book your next experience.</p>
      </div>
      <div className="mb-8">
        <div className="relative max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search events or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title={search ? 'No events found' : 'No events available'}
          description={search ? 'Try adjusting your search terms' : 'Check back later for new events'}
          icon="🔍"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
