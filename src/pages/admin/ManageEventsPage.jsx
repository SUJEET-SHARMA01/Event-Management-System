import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../../context/EventsContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal, { ConfirmModal } from '../../components/ui/Modal'
import Loading, { LoadingCard } from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

export default function ManageEventsPage() {
  const { events, loading, deleteEvent, actionLoading } = useEvents()
  const [deleteId, setDeleteId] = useState(null)
  const [editId, setEditId] = useState(null)

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteEvent(deleteId)
        setDeleteId(null)
      } catch (error) {
        // Error handled by context
      }
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
            <p className="text-gray-600">Edit or remove events.</p>
          </div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-gray-600">Edit or remove events.</p>
        </div>
        <Link to="/admin/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>
      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create your first event to get started."
          action={
            <Link to="/admin/events/create">
              <Button>Create Event</Button>
            </Link>
          }
          icon="📅"
        />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Event</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Price</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                        <span className="font-medium text-gray-900">{event.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{event.date}</td>
                    <td className="py-4 px-6 text-gray-600">{event.location}</td>
                    <td className="py-4 px-6 text-gray-600">{event.price}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/events/${event.id}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => setEditId(event.id)} disabled>
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteId(event.id)}
                          disabled={actionLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete event?"
        message="This action cannot be undone. The event will be permanently removed."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
