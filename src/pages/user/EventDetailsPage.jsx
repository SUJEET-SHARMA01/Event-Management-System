import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEvents } from '../../context/EventsContext'
import { useBookings } from '../../context/BookingsContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

export default function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentEvent, loadingOne, fetchEventById } = useEvents()
  const { createBooking, actionLoading } = useBookings()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (id) {
      fetchEventById(id).catch(() => {
        // Error handled by context
      })
    }
  }, [id, fetchEventById])

  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    try {
      await createBooking(currentEvent.id, currentEvent.title, 1)
      navigate('/bookings', { state: { message: 'Event booked successfully!' } })
    } catch (error) {
      // Error handled by context
    }
  }

  if (loadingOne) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Loading size="lg" className="min-h-[400px]" />
      </div>
    )
  }

  if (!currentEvent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmptyState
          title="Event not found"
          description="The event you're looking for doesn't exist or has been removed."
          action={
            <Link to="/events">
              <Button>Back to Events</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const event = currentEvent

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/events" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Events
      </Link>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
          <Card>
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <p className="mt-4 text-gray-600">{event.description}</p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {event.date} · {event.time}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {event.location}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Capacity: {event.capacity}
              </span>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <div className="text-2xl font-bold text-primary-600">{event.price}</div>
            <p className="mt-1 text-sm text-gray-500">per ticket</p>
            <Button className="w-full mt-6" size="lg" onClick={handleBookEvent} disabled={actionLoading}>
              {actionLoading ? 'Booking...' : 'Book Now'}
            </Button>
            <p className="mt-4 text-xs text-gray-500 text-center">
              {isAuthenticated
                ? 'Booking will be added to your bookings list.'
                : 'Please sign in to book this event.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
