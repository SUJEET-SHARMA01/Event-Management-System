import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../../context/EventsContext'
import { useBookings } from '../../context/BookingsContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'

export default function AdminDashboard() {
  const { events, loading: eventsLoading } = useEvents()
  const { bookings, loading: bookingsLoading } = useBookings()

  const stats = [
    {
      label: 'Total Events',
      value: events.length,
      icon: '📅',
      color: 'bg-primary-100 text-primary-600',
      link: '/admin/events',
    },
    {
      label: 'Total Bookings',
      value: bookings.length,
      icon: '🎫',
      color: 'bg-green-100 text-green-600',
      link: '/admin/bookings',
    },
    {
      label: 'Revenue',
      value: '$0',
      icon: '💰',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Users',
      value: '0',
      icon: '👥',
      color: 'bg-violet-100 text-violet-600',
    },
  ]

  if (eventsLoading || bookingsLoading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Overview of your event management.</p>
          </div>
        </div>
        <Loading size="lg" className="min-h-[400px]" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your event management.</p>
        </div>
        <Link to="/admin/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link || '#'} className={stat.link ? '' : 'pointer-events-none'}>
            <Card className={`flex items-center gap-4 transition-shadow hover:shadow-md ${stat.link ? 'cursor-pointer' : ''}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <Card className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Recent activity</h2>
        <p className="mt-2 text-gray-500 text-sm">Recent bookings and events will appear here.</p>
        {bookings.length > 0 && (
          <div className="mt-4 space-y-2">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-sm font-medium text-gray-900">{booking.eventTitle}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {booking.date} · {booking.tickets} ticket{booking.tickets > 1 ? 's' : ''} · {booking.status}
                </p>
              </div>
            ))}
          </div>
        )}
        {bookings.length === 0 && (
          <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-500">No recent activity.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
