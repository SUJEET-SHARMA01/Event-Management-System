import { useEffect } from 'react'
import { useBookings } from '../../context/BookingsContext'
import Card from '../../components/ui/Card'
import Loading, { LoadingCard } from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

const statusColors = {
  Confirmed: 'bg-green-100 text-green-800',
  Pending: 'bg-amber-100 text-amber-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function ManageBookingsPage() {
  const { bookings, loading, fetchBookings } = useBookings()

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-600">View and manage all event bookings.</p>
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="text-gray-600">View and manage all event bookings.</p>
      </div>
      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Bookings will appear here once users start booking events." icon="🎫" />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Booking ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Event</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tickets</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-4 px-6 font-mono text-sm text-gray-600">{booking.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{booking.eventTitle}</td>
                    <td className="py-4 px-6 text-gray-600">{booking.date}</td>
                    <td className="py-4 px-6 text-gray-600">{booking.tickets}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusColors[booking.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
