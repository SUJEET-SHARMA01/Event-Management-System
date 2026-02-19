import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useBookings } from '../../context/BookingsContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loading, { LoadingCard } from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

const statusColors = {
  Confirmed: 'bg-green-100 text-green-800',
  Pending: 'bg-amber-100 text-amber-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function MyBookingsPage() {
  const { bookings, loading, cancelBooking, fetchBookings, actionLoading } = useBookings()
  const location = useLocation()

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  useEffect(() => {
    if (location.state?.message) {
      // Could show a toast notification here
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id)
      } catch (error) {
        // Error handled by context
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-gray-600">View and manage your event bookings.</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-gray-600">View and manage your event bookings.</p>
      </div>
      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Start exploring events and book your first one!"
          action={
            <Link to="/events">
              <Button>Browse Events</Button>
            </Link>
          }
          icon="🎫"
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{booking.eventTitle}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {booking.date} · {booking.tickets} ticket{booking.tickets > 1 ? 's' : ''}
                </p>
                <span
                  className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                    statusColors[booking.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Link to={`/events/${booking.eventId}`}>
                  <Button variant="outline" size="sm">
                    View Event
                  </Button>
                </Link>
                {booking.status !== 'Cancelled' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleCancel(booking.id)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
